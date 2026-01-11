import express from "express";
const router = express.Router();
import { maybeUploadFields } from "../middleware/multer.js";
import { verifyjwt, requireAdmin } from "../middleware/auth.js";
import {addproduct,getallproducts,getproductbyid,deleteproduct,updateproduct} from "../controllers/product.controller.js";
// NEW: Accept both JSON (Admin) and multipart (future image upload).
router.route("/addproduct").post(verifyjwt, requireAdmin, maybeUploadFields([{name:"image",maxCount:5}]), addproduct);
router.route("/getallproducts").get(getallproducts);
router.route("/getproductbyid/:id").get(getproductbyid);
router.route("/deleteproduct/:id").delete(verifyjwt, requireAdmin, deleteproduct);
router.route("/updateproduct/:id").put(verifyjwt, requireAdmin, updateproduct);
export default router;