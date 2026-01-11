import mongoose from "mongoose";

const reviewschema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type:Number, required:true },
    title: { type:String, required:true },
    comment: { type:String, required:true },
    createdon: { type:Date, default:Date.now }, 
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },   
});

// At most ONE review per (user, product) pair.
// This compound unique index ensures the same user cannot submit more than
// one review for the same product. Duplicate attempts will raise E11000.
reviewschema.index({ product: 1, createdby: 1 }, { unique: true, name: 'uniq_user_product_review' });
const Review = mongoose.model('Review', reviewschema);
export default Review;