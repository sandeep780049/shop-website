import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const Coupons = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderAmount: "",
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/coupon/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).getTime() : null,
      };

      const response = await axios.post(
        backendUrl + "/api/coupon/add",
        payload,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setForm({
          code: "",
          discountType: "percent",
          discountValue: "",
          minOrderAmount: "",
          expiresAt: "",
        });
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleCoupon = async (couponId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/coupon/toggle",
        { couponId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/coupon/delete",
        { couponId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <p className="text-2xl mb-4">Coupons</p>

      {/* Add coupon form */}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded border mb-8"
      >
        <input
          required
          name="code"
          value={form.code}
          onChange={onChange}
          placeholder="CODE"
          className="border px-3 py-2 uppercase"
        />
        <select
          name="discountType"
          value={form.discountType}
          onChange={onChange}
          className="border px-3 py-2"
        >
          <option value="percent">Percent (%)</option>
          <option value="flat">Flat ({currency})</option>
        </select>
        <input
          required
          name="discountValue"
          value={form.discountValue}
          onChange={onChange}
          type="number"
          min="1"
          placeholder="Discount value"
          className="border px-3 py-2"
        />
        <input
          name="minOrderAmount"
          value={form.minOrderAmount}
          onChange={onChange}
          type="number"
          min="0"
          placeholder={`Min order amount (${currency}, optional)`}
          className="border px-3 py-2"
        />
        <input
          name="expiresAt"
          value={form.expiresAt}
          onChange={onChange}
          type="date"
          className="border px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 cursor-pointer"
        >
          Create Coupon
        </button>
      </form>

      {/* Coupons list */}
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-100 text-sm font-medium">
          <span>Code</span>
          <span>Discount</span>
          <span>Min Order</span>
          <span>Used</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {coupons.length === 0 ? (
          <p className="text-sm text-gray-400 px-3 py-4">
            No coupons yet — create your first one above.
          </p>
        ) : (
          coupons.map((c) => (
            <div
              key={c._id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-3 bg-white border text-sm"
            >
              <span className="font-medium uppercase">{c.code}</span>
              <span>
                {c.discountType === "percent"
                  ? `${c.discountValue}%`
                  : `${currency}${c.discountValue}`}
              </span>
              <span>{c.minOrderAmount > 0 ? `${currency}${c.minOrderAmount}` : "—"}</span>
              <span>{c.usedCount}</span>
              <span className={c.isActive ? "text-green-600" : "text-gray-400"}>
                {c.isActive ? "Active" : "Off"}
              </span>
              <span className="flex gap-3 justify-end">
                <button
                  onClick={() => toggleCoupon(c._id)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {c.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteCoupon(c._id)}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupons;
