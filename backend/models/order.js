import mongoose from "mongoose";


// Schema for individual items in an order
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product
    name: { type: String, required: true }, // Product name
    price: { type: Number, required: true }, // Price at time of order
    quantity: { type: Number, default: 1 }, // Quantity ordered
    image: { type: String } // Product image URL
}, { _id: false });


// Main order schema
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who placed the order
    name: { type: String }, // Order name/label
    items: { type: [orderItemSchema], default: [] }, // Array of order items
    total: { type: Number, required: true }, // Total price
    status: { type: String, enum: ['ordered','pending','shipped','delivered','cancelled'], default: 'ordered' }, // Order status
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;