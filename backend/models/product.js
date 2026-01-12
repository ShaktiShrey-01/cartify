import mongoose from "mongoose";

const productschema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // NEW: Keep the old category relation optional (frontend uses categoryKey string).
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    // NEW: Simple category key used by frontend routing (electronics/grocery/clothes).
    categoryKey: { type: String, default: '' },
    // NEW: Product type used by SortNav filtering (e.g., mobile, laptop, etc.).
    type: { type: String, default: '' },
    // NEW: Optional rating value for sorting/display.
    rating: { type: Number, default: null },
    // NEW: Whether the product should appear in the Featured section.
    featured: { type: Boolean, default: false },
    image: { type: String, default: "" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Product = mongoose.model('Product', productschema);
export default Product;