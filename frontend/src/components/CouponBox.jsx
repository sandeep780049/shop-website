import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const CouponBox = () => {
  const { applyCouponCode, removeCoupon, appliedCoupon } = useContext(ShopContext);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    const ok = await applyCouponCode(code);
    setChecking(false);
    if (ok) setCode("");
  };

  return (
    <div className="mt-4 border border-dashed border-gray-300 p-4 text-sm">
      <p className="font-medium mb-3">Have a coupon?</p>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2">
          <div>
            <p className="font-medium text-green-700">
              {appliedCoupon.code} applied
            </p>
            <p className="text-xs text-green-600">
              You save ₹{appliedCoupon.discount}
            </p>
          </div>
          <button
            onClick={removeCoupon}
            className="text-red-500 text-xs hover:underline cursor-pointer"
          >
            Remove
          </button>
          </div>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="border border-gray-300 px-3 py-2 flex-1 uppercase tracking-wide"
          />
          <button
            type="submit"
            disabled={checking}
            className="bg-black text-white px-5 py-2 disabled:opacity-50 cursor-pointer"
          >
            {checking ? "…" : "Apply"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CouponBox;
