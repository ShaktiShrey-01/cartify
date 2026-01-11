
import express from "express";
import { createReview, getReviews, updateReview, deleteReview } from "../controllers/review.controller.js";
import { verifyjwt } from "../middleware/auth.js";
const router = express.Router();

// CRUD routes for reviews
router.post("/", verifyjwt, createReview);
router.get("/", getReviews);
router.put("/:id", verifyjwt, updateReview);
router.delete("/:id", verifyjwt, deleteReview);

export default router;
