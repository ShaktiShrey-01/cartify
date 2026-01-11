import express from "express";
import { verifyjwt } from "../middleware/auth.js";
import { addAddress, editAddress, deleteAddress, getAddresses } from "../controllers/address.controller.js";

const router = express.Router();

// Get all addresses for current user
router.get("/", verifyjwt, getAddresses);
// Add new address
router.post("/", verifyjwt, addAddress);
// Edit address by index
router.put("/:index", verifyjwt, editAddress);
// Delete address by index
router.delete("/:index", verifyjwt, deleteAddress);

export default router;
