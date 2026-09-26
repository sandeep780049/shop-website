import React from "react";
import { assets } from "../assets/assets";

// Overall average + 5->1 star distribution bars. Clicking a bar filters the
// review list, so it doubles as the star filter control.
const RatingSummary = ({ summary, activeRating, onFilter }) => {
  if (!summary) return null;

  const { avgRating, ratingCount, breakdown } = summary;
  const rows = breakdown || [];
  const hasReviews = ratingCount > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start border p-5 mt-6">
      <div className="flex flex-col items-center sm:items-start shrink-0">
        <p className="text-4xl font-medium leading-none">{avgRating.toFixed(1)}</p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={i <= Math.round(avgRating) ? assets.star_icon : assets.star_dull_icon}
              className="w-4"
              alt=""
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
        </p>
        {activeRating > 0 && (
          <button
            onClick={() => onFilter(0)}
            className="text-xs underline text-gray-600 mt-3"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex-1 w-full flex flex-col gap-1">
        {rows.map((row) => {
          const isActive = activeRating === row.rating;
          return (
            <button
              key={row.rating}
              disabled={!hasReviews}
              onClick={() => onFilter(isActive ? 0 : row.rating)}
              className={`flex items-center gap-2 text-xs w-full px-1 py-0.5 ${
                isActive ? "bg-orange-50" : ""
              } ${hasReviews ? "cursor-pointer hover:bg-gray-50" : "cursor-default"}`}
            >
              <span className="w-8 text-left text-gray-600 shrink-0">
                {row.rating} star
              </span>
              <span className="flex-1 h-2 bg-gray-200 rounded-sm overflow-hidden">
                <span
                  className="block h-full bg-orange-400"
                  style={{ width: `${row.percentage}%` }}
                ></span>
              </span>
              <span className="w-16 text-right text-gray-500 shrink-0">
                {row.count} ({row.percentage}%)
              </span>
            </button>
          );
        })}
        {!hasReviews && (
          <p className="text-xs text-gray-500 mt-1">
            No ratings yet — be the first to review this product.
          </p>
        )}
      </div>
    </div>
  );
};

export default RatingSummary;
