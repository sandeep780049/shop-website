import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Recompute and persist a product's average rating & review count
const updateProductRating = async (productId) => {
  const reviews = await reviewModel.find({ productId });
  const ratingCount = reviews.length;
  const avgRating =
    ratingCount === 0
      ? 0
      : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10;
  await productModel.findByIdAndUpdate(productId, { avgRating, ratingCount });
};

// Add a review, or update the reviewer's existing review (one per user per product)
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (!comment || !comment.trim()) {
      return res.json({ success: false, message: "Please write a review comment" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const reviewData = {
      productId,
      userId,
      name: user.name,
      rating: Number(rating),
      comment: comment.trim(),
      date: Date.now()
    };

    const existing = await reviewModel.findOne({ productId, userId });
    let review;
    if (existing) {
      review = await reviewModel.findByIdAndUpdate(existing._id, reviewData, { new: true });
    } else {
      review = await new reviewModel(reviewData).save();
    }

    await updateProductRating(productId);

    res.json({ success: true, review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product (newest first)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }
    const reviews = await reviewModel.find({ productId }).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete own review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    if (String(review.userId) !== String(userId)) {
      return res.json({ success: false, message: "Not authorized to delete this review" });
    }
    await reviewModel.findByIdAndDelete(reviewId);
    await updateProductRating(review.productId);
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: list all reviews for moderation
export const allReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: delete any review
export const adminDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }
    await reviewModel.findByIdAndDelete(reviewId);
    await updateProductRating(review.productId);
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};