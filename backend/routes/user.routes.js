import express from "express";
import {asynchnadler} from "../utils/asynchandler.js";
import { verifyjwt } from "../middleware/auth.js";
import { registeruser,loginuser,logoutuser,refreshtoken, deleteCurrentUser } from "../controllers/user.controller.js";

const router = express.Router();


// NEW: Return current user info if authenticated (for frontend state hydration)

// Get current user info
router.route("/me").get(verifyjwt, (req, res) => {
	res.json({
		statuscode: 200,
		data: req.user,
		message: "Current user info",
		success: true
	});
});

// Delete current user
router.route("/me").delete(verifyjwt, deleteCurrentUser);

router.route("/signup").post(registeruser)
router.route("/login").post(loginuser);
router.route("/logout").post(verifyjwt,logoutuser);
router.route("/refreshtoken").post(refreshtoken);

export default router;