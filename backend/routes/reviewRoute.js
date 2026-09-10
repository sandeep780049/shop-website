import express from "express";
import { addReview, getProductReviews, deleteReview, allReviews, adminDeleteReview } from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const reviewRouter = express.Router();

// User features
reviewRouter.post('/add', authUser, addReview)
reviewRouter.post('/product', getProductReviews)
reviewRouter.post('/delete', authUser, deleteReview)

// Admin features
reviewRouter.post('/list', adminAuth, allReviews)
reviewRouter.post('/admin-delete', adminAuth, adminDeleteReview)

export default reviewRouter;