import express from 'express'
import { applyCoupon, listCoupons, addCoupon, toggleCoupon, deleteCoupon } from '../controllers/couponController.js'
import adminAuth from '../middleware/adminAuth.js'

const couponRouter = express.Router()

// Customer
couponRouter.post('/apply', applyCoupon)

// Admin
couponRouter.post('/list', adminAuth, listCoupons)
couponRouter.post('/add', adminAuth, addCoupon)
couponRouter.post('/toggle', adminAuth, toggleCoupon)
couponRouter.post('/delete', adminAuth, deleteCoupon)

export default couponRouter
