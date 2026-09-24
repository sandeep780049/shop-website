import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percent', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Number, default: null }
})

const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema)

export default couponModel
