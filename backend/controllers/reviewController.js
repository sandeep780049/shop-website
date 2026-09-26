import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Sort options accepted by getProductReviews
const REVIEW_SORTS = {
  newest: { date: -1 },
  oldest: { date: 1 },
  highest: { rating: -1, date: -1 },
  lowest: { rating: 1, date: -1 },
  helpful: { helpful: -1, date: -1 },
};

// Aggregate a product's average rating, review count and 5->1 star breakdown in
// one query. Conditional sums keep it constant-memory regardless of review count.
const getRatingSummary = async (productId) => {
  const [stats] = await reviewModel.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
        five: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        four: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        three: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        two: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        one: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
      }
    }
  ]);

  const ratingCount = stats ? stats.ratingCount : 0;
  const avgRating = stats ? Math.round(stats.avgRating * 10) / 10 : 0;

  const countByRating = stats
    ? { 5: stats.five, 4: stats.four, 3: stats.three, 2: stats.two, 1: stats.one }
    : {};

  const breakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = countByRating[rating] || 0;
    return {
      rating,
      count,
      percentage: ratingCount === 0 ? 0 : Math.round((count / ratingCount) * 100)
    };
  });

  return { avgRating, ratingCount, breakdown };
};

// Recompute and persist a product's average rating & review count
const updateProductRating = async (productId) => {
  const { avgRating, ratingCount } = await getRatingSummary(productId);
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

    // Single atomic upsert so two concurrent submissions can never create a
    // second review for the same user/product pair. $set leaves helpful /
    // helpfulBy untouched on edit, setDefaultsOnInsert seeds them on insert.
    const review = await reviewModel.findOneAndUpdate(
      { productId, userId },
      { $set: reviewData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await updateProductRating(productId);

    res.json({ success: true, review });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews for a product, supporting star filter, sorting and pagination
export const getProductReviews = async (req, res) => {
  try {
    const { productId, rating, sort = "newest", page = 1, limit = 5 } = req.body;
    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const filters = { productId };
    if (rating) {
      const value = Number(rating);
      if (!value || value < 1 || value > 5) {
        return res.json({
          success: false,
          message: "Rating filter must be between 1 and 5"
        });
      }
      filters.rating = value;
    }

    const perPage = Math.min(Math.max(Number(limit) || 5, 1), 20);
    const currentPage = Math.max(Number(page) || 1, 1);

    const total = await reviewModel.countDocuments(filters);
    const pages = Math.ceil(total / perPage);

    const [reviews, summary] = await Promise.all([
      reviewModel
        .find(filters)
        .sort(REVIEW_SORTS[sort] || REVIEW_SORTS.newest)
        .skip((currentPage - 1) * perPage)
        .limit(perPage),
      getRatingSummary(productId)
    ]);

    res.json({ success: true, reviews, total, page: currentPage, pages, summary });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Toggle a "this was helpful" vote on a review
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const userId = req.body.userId;

    if (!reviewId) {
      return res.json({ success: false, message: "Review ID is required" });
    }
    if (!userId) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    const voters = (review.helpfulBy || []).map(String);
    const alreadyVoted = voters.includes(String(userId));

    const nextVoters = alreadyVoted
      ? voters.filter((id) => id !== String(userId))
      : [...voters, String(userId)];

    review.helpfulBy = nextVoters;
    review.helpful = nextVoters.length;
    await review.save();

    res.json({ success: true, helpful: review.helpful, voted: !alreadyVoted });
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