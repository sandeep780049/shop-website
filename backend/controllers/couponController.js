import couponModel from "../models/couponModel.js";

// ---- Customer ----

// Validate and price a coupon code against a cart amount
const applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await couponModel.findOne({
      code: String(code || "").toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid coupon code" });
    }
    if (coupon.expiresAt && Date.now() > coupon.expiresAt) {
      return res.json({ success: false, message: "This coupon has expired" });
    }
    if (amount < coupon.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order Rs.${coupon.minOrderAmount} required for this coupon`,
      });
    }

    const discount =
      coupon.discountType === "percent"
        ? Math.round((amount * coupon.discountValue) / 100)
        : Math.min(coupon.discountValue, amount);

    res.json({
      success: true,
      code: coupon.code,
      discount,
      message: `Coupon ${coupon.code} applied — you save Rs.${discount}`,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ---- Admin ----

// List all coupons (newest first)
const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ _id: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Create a coupon
const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiresAt } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.json({ success: false, message: "Code, discount type and value are required" });
    }
    if (discountType === "percent" && discountValue > 100) {
      return res.json({ success: false, message: "Percent discount cannot exceed 100" });
    }

    const normalized = String(code).toUpperCase().trim();

    const exists = await couponModel.findOne({ code: normalized });
    if (exists) {
      return res.json({ success: false, message: "A coupon with this code already exists" });
    }

    await couponModel.create({
      code: normalized,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      expiresAt: expiresAt || null,
    });

    res.json({ success: true, message: "Coupon created" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Toggle a coupon active/inactive
const toggleCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    const coupon = await couponModel.findById(couponId);
    if (!coupon) {
      return res.json({ success: false, message: "Coupon not found" });
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, isActive: coupon.isActive, message: `Coupon ${coupon.isActive ? "enabled" : "disabled"}` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    await couponModel.findByIdAndDelete(couponId);
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { applyCoupon, listCoupons, addCoupon, toggleCoupon, deleteCoupon };
