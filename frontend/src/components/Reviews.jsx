import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RatingSummary from "./RatingSummary";

const REVIEWS_PER_PAGE = 5;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest rating" },
  { value: "lowest", label: "Lowest rating" },
  { value: "helpful", label: "Most helpful" }
];

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
    day: "numeric"
  });

const Reviews = ({ productId }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  // Filter, sort and page live in one object so a reset is always a single
  // state change, which keeps the fetch effect in sync with the controls.
  // `refresh` is bumped to force a refetch when the values themselves match.
  const [query, setQuery] = useState({
    rating: 0,
    sort: "newest",
    page: 1,
    refresh: 0
  });
  const [votedIds, setVotedIds] = useState([]);
  const [formRating, setFormRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { rating: ratingFilter, sort, page } = query;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.post(backendUrl + "/api/review/product", {
        productId,
        rating: query.rating || undefined,
        sort: query.sort,
        page: query.page,
        limit: REVIEWS_PER_PAGE
      });
      if (response.data.success) {
        setReviews(response.data.reviews);
        setSummary(response.data.summary);
        setTotal(response.data.total);
        setPages(response.data.pages);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [backendUrl, productId, query]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Changing a filter or sort order always returns to the first page
  const applyFilter = (value) => {
    setQuery((prev) => ({ ...prev, rating: value, page: 1 }));
  };

  const applySort = (event) => {
    const value = event.target.value;
    setQuery((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const changePage = (value) => {
    setQuery((prev) => ({ ...prev, page: value }));
  };

  const submitReview = async () => {
    if (formRating === 0) {
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
        { productId, rating: formRating, comment },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review submitted successfully");
        setFormRating(0);
        setComment("");
        setQuery((prev) => ({
          ...prev,
          rating: 0,
          sort: "newest",
          page: 1,
          refresh: prev.refresh + 1
        }));
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

  const voteHelpful = async (reviewId) => {
    if (!token) {
      toast.error("Please login to mark a review as helpful");
      return;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/review/helpful",
        { reviewId },
        { headers: { token } }
      );
      if (response.data.success) {
        const { helpful, voted } = response.data;
        setReviews((prev) =>
          prev.map((item) => (item._id === reviewId ? { ...item, helpful } : item))
        );
        setVotedIds((prev) =>
          voted ? [...prev, reviewId] : prev.filter((id) => id !== reviewId)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium">Customer Reviews</p>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "review" : "reviews"}
            {ratingFilter > 0 && ` · filtered to ${ratingFilter} star`}
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

      <RatingSummary
        summary={summary}
        activeRating={ratingFilter}
        onFilter={applyFilter}
      />

      {token && (
        <div className="border-2 p-5 my-6">
          <p className="text-sm font-medium mb-2">Write a Review</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={
                  i <= (hover || formRating)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                className="w-6 cursor-pointer"
                alt=""
                onClick={() => setFormRating(i)}
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

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {total === 0 ? 0 : (page - 1) * REVIEWS_PER_PAGE + 1}–
          {Math.min(page * REVIEWS_PER_PAGE, total)} of {total}
        </p>
        <select
          value={sort}
          onChange={applySort}
          className="border px-2 py-1 text-sm outline-none bg-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 border-t pt-6 mt-6">
          {ratingFilter > 0
            ? `No ${ratingFilter} star reviews yet.`
            : "No reviews yet. Be the first to review this product."}
        </p>
      ) : (
        <div className="flex flex-col gap-5 border-t pt-6 mt-6">
          {reviews.map((review) => {
            const hasVoted = votedIds.includes(review._id);
            return (
              <div key={review._id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <StarRow rating={review.rating} />
                  <p className="text-sm font-medium">{review.name}</p>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => voteHelpful(review._id)}
                    className={`text-xs border px-2 py-1 ${
                      hasVoted
                        ? "border-orange-500 text-orange-600"
                        : "border-gray-300 text-gray-600 hover:border-gray-500"
                    }`}
                  >
                    {hasVoted ? "Marked as helpful" : "Helpful"}
                  </button>
                  <span className="text-xs text-gray-400">
                    {review.helpful > 0 &&
                      `${review.helpful} ${
                        review.helpful === 1 ? "person" : "people"
                      } found this helpful`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => changePage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="border px-3 py-1 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => changePage(Math.min(page + 1, pages))}
            disabled={page === pages}
            className="border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
