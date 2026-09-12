import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const StarRow = ({ rating, size = "w-3.5" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <img
          key={i}
          src={i <= Math.round(rating) ? assets.star_icon : assets.star_dull_icon}
          className={size}
          alt=""
        />
      ))}
    </div>
  );
};

const formatDate = (ms) =>
  new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const Reviews = ({ productId }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.post(backendUrl + "/api/review/product", {
        productId,
      });
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [backendUrl, productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/review/add",
        { productId, rating, comment },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
        await fetchReviews();
        window.dispatchEvent(new Event("review-updated"));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium">Customer Reviews</p>
          <p className="text-sm text-gray-500 mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
        <a
          href="/login"
          className={`border-2 px-4 py-2 text-sm font-medium ${
            token ? "hidden" : ""
          }`}
        >
          Login to write a review
        </a>
      </div>

      {token && (
        <div className="border-2 p-5 my-6">
          <p className="text-sm font-medium mb-2">Write a Review</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={
                  i <= (hover || rating)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                className="w-6 cursor-pointer"
                alt=""
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            placeholder="Share your experience with this product..."
            className="w-full border mt-3 px-3 py-2 text-sm outline-none"
          ></textarea>
          <button
            onClick={submitReview}
            disabled={submitting}
            className="mt-3 bg-black text-white px-6 py-2 text-sm active:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 border-t pt-6">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <div className="flex flex-col gap-5 border-t pt-6">
          {reviews.map((review, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <StarRow rating={review.rating} />
                <p className="text-sm font-medium">{review.name}</p>
                <span className="text-xs text-gray-400">
                  {formatDate(review.date)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;