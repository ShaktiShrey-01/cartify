// Middleware to require admin role
// Only allows access if req.user.role is 'admin'
export const requireAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  // Respond with 403 if not admin
  return res.status(403).json({ statuscode: 403, message: 'Admin access required', success: false });
};
import { apierror } from "../utils/apierror.js";
import { asynchnadler } from "../utils/asynchandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT and attach user to request
// Checks for token in cookies or Authorization header
export const verifyjwt = asynchnadler(async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const authHeader = req.headers?.authorization;
    const token =
      req.cookies?.accesstoken ||
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : undefined);

    // Debug logs for incoming token
    // Debug logs removed for production

    if (!token) {
      // No token found
      // Debug log removed for production
      throw new apierror(401, "unauthorized access,token missing");
    }

    let decodedtoken;
    try {
      // Verify JWT signature and decode
      decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Debug log removed for production
    } catch (jwtErr) {
      // Token invalid or expired
      // Debug log removed for production
      throw new apierror(401, "unauthorized access,invalid token");
    }

    // Find user by ID in token, exclude password and refresh token
    const user = await User.findById(decodedtoken._id).select(
      "-password -refreshtoken"
    );
    if (!user) {
      // No user found for this token
      // Debug log removed for production
      throw new apierror(404, "invalid access token");
    }

    // Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    // Any error: treat as unauthorized
    // Debug log removed for production
    throw new apierror(401, err.message || "unauthorized access,invalid token");
  }
});