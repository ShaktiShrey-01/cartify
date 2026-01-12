import Review from '../models/review.js';
import Product from '../models/product.js';
import ApiResponse from '../utils/apiresponse.js';
import { apierror as ApiError } from '../utils/apierror.js';

// Map DB review to frontend shape
const toClientReview = (r) => {
  const createdByObj = r.createdby && typeof r.createdby === 'object' ? r.createdby : null;
  return {
    id: String(r._id),
    productId: String(r.product),
    userId: createdByObj ? String(createdByObj._id) : String(r.createdby),
    userName: createdByObj?.username || '',
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    date: r.createdon,
  };
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating || !title || !comment) {
      return next(new ApiError(400, 'productId, rating, title, and comment are required'));
    }

    const product = await Product.findById(productId);
    if (!product) return next(new ApiError(404, 'Product not found'));

    // Enforce max 1 review per user per product at the application level as well
    // (the DB unique index also enforces this). Returning a friendly message here.
    const already = await Review.findOne({ product: product._id, createdby: req.user._id });
    if (already) {
      return next(new ApiError(409, 'You have already reviewed this product'));
    }

    // Create review linked to product and user
    let review = await Review.create({
      product: product._id,
      rating,
      title,
      comment,
      createdby: req.user._id,
    });

    // Attach to product
    product.reviews.push(review._id);
    await product.save();

    // populate createdby for client shape
    review = await review.populate('createdby', 'username');
    const shaped = toClientReview(review);
    res.status(201).json(new ApiResponse(201, shaped, 'Review created successfully'));
  } catch (error) {
    // Handle duplicate key from unique index (E11000)
    if (error && error.code === 11000) {
      return next(new ApiError(409, 'You have already reviewed this product'));
    }
    next(new ApiError(400, error.message));
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { productId, page = 1, limit = 20 } = req.query;
    const query = productId ? { product: productId } : {};
    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, Math.min(50, parseInt(limit)));
    const reviews = await Review.find(query)
      .populate('createdby', 'username')
      .skip(skip)
      .limit(Math.max(1, Math.min(50, parseInt(limit))))
      .lean();
    const shaped = reviews.map(toClientReview);
    res.json(new ApiResponse(200, shaped, 'Reviews fetched successfully'));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Update review (only by creator)
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) return next(new ApiError(404, 'Review not found'));
    if (!req.user || review.createdby.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'You are not authorized to update this review'));
    }
    Object.assign(review, req.body);
    await review.save();
    const populated = await Review.findById(review._id).populate('createdby', 'username');
    res.json(new ApiResponse(200, toClientReview(populated), 'Review updated successfully'));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

// Delete review (only by creator)
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) return next(new ApiError(404, 'Review not found'));
    if (!req.user || review.createdby.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'You are not authorized to delete this review'));
    }
    // Remove from product.reviews as well
    await Product.updateOne({ _id: review.product }, { $pull: { reviews: review._id } });
    await review.deleteOne();
    res.json(new ApiResponse(200, null, 'Review deleted successfully'));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};
