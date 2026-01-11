import express from 'express';
import { verifyjwt } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderById, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();


// All routes require authentication via verifyjwt middleware

// Create new order for logged-in user
router.post('/', verifyjwt, createOrder);

// Get all orders for the current user
router.get('/mine', verifyjwt, getMyOrders);

// Get a specific order by ID (must belong to user)
router.get('/:id', verifyjwt, getOrderById);

// Delete a specific order by ID (must belong to user)
router.delete('/:id', verifyjwt, deleteOrder);

export default router;
