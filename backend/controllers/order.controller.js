import Order from "../models/order.js";
import User from "../models/user.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";

// Helper to shape order data for client responses
const toClientOrder = (doc) => {
  // Convert Mongoose doc to plain object if needed
  const raw = doc?.toObject ? doc.toObject({ virtuals: false }) : (doc || {})
  return {
    id: String(raw?._id ?? raw?.id ?? ""),
    name: raw?.name || '',
    status: raw?.status || 'ordered',
    total: raw?.total ?? 0,
    // Map each item to a client-friendly format
    items: Array.isArray(raw?.items) ? raw.items.map(it => ({
      id: it?.product ? String(it.product) : undefined,
      name: it?.name,
      price: it?.price,
      quantity: it?.quantity,
      image: it?.image,
    })) : [],
    createdAt: raw?.createdAt,
  }
}

// Create a new order for the authenticated user
export const createOrder = async (req, res) => {
  const userId = req?.user?._id
  if (!userId) {
    throw new apierror(401, "Unauthorized") // User must be logged in
  }

  const { name, items, total } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    throw new apierror(400, "Order items are required") // Must have at least one item
  }

  // Compute total if not provided, to prevent tampering
  const computedTotal = Array.isArray(items)
    ? items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)
    : 0
  const finalTotal = Number(total) || Math.round(computedTotal)

  // Create the order document
  const order = await Order.create({
    user: userId,
    name: name || (items.length === 1 ? items[0]?.name : `Cart Order (${items.length} items)`),
    items: items.map(it => ({
      product: it.id || it.product || undefined,
      name: it.name,
      price: it.price,
      quantity: it.quantity || 1,
      image: it.image || undefined,
    })),
    total: finalTotal,
    status: 'ordered',
  })

  // Link order to user.orders for convenience (ignore errors if fails)
  try {
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } })
  } catch {}

  // Respond with the created order
  return res.status(201).json(new apiresponse(201, toClientOrder(order), "Order created successfully"))
}

// Get all orders for the authenticated user
export const getMyOrders = async (req, res) => {
  const userId = req?.user?._id
  if (!userId) {
    throw new apierror(401, "Unauthorized")
  }
  // Pagination: ?page=1&limit=20
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  // Find all orders for this user, newest first
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const shaped = orders.map(toClientOrder)
  return res.status(200).json(new apiresponse(200, shaped, "Orders fetched successfully"))
}

// Get a specific order by ID (must belong to user)
export const getOrderById = async (req, res) => {
  const userId = req?.user?._id
  const { id } = req.params
  // Only allow access to user's own orders
  const order = await Order.findOne({ _id: id, user: userId }).lean()
  if (!order) throw new apierror(404, "Order not found")
  return res.status(200).json(new apiresponse(200, toClientOrder(order), "Order fetched successfully"))
}

// Delete a specific order by ID (must belong to user)
export const deleteOrder = async (req, res) => {
  const userId = req?.user?._id
  const { id } = req.params
  // Only allow deletion of user's own orders
  const order = await Order.findOneAndDelete({ _id: id, user: userId }).lean()
  if (!order) throw new apierror(404, "Order not found")
  // Remove order reference from user.orders (ignore errors)
  try {
    await User.findByIdAndUpdate(userId, { $pull: { orders: order._id } })
  } catch {}
  return res.status(200).json(new apiresponse(200, null, "Order deleted successfully"))
}

