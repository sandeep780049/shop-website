import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";
// import Stripe from "stripe";

//Gateway Intialize
// const stripe = new Stripe(process.env.STRIPE_KEY);

//Placing order using COD Method

const placeOrder = async (req,res) => {

    try {
        
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            statusHistory: [{ status: 'Order Placed', date: Date.now() }]
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}

//using Stripe

const placeOrderStripe = async (req,res) => {
    
    try {
        
        const {userId, items, amount, address, token} = req.body;
        const {origin } = req.headers;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
            statusHistory: [{ status: 'Order Placed', date: Date.now() }]
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // const line_item =



    } catch (error) {
        
    }
}

//using rozerpay

const placeOrderRozerpay = async (req,res) => {
    
}

//All oders details at admin
const allOrders = async (req,res) => {
    
    try {

        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

//user data at frontend

const userOrders = async (req,res) => {
    
    try {
        
        const {userId} = req.body

        const orders = await orderModel.find({userId})

        res.json({success:true,orders})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}

//update order status 

const ORDER_STATUSES = ['Order Placed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered']

const updateStatus = async (req,res) => {
    
    try {
        const {orderId , status} = req.body

        if (!ORDER_STATUSES.includes(status)) {
            return res.json({success:false,message:'Invalid status'})
        }

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.json({success:false,message:'Order not found'})
        }

        if (order.status === status) {
            return res.json({success:true,message:`Status is already ${status}`})
        }

        const statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : []

        if (!statusHistory.some(entry => entry.status === status)) {
            statusHistory.push({status, date: Date.now()})
        }

        order.status = status
        order.statusHistory = statusHistory
        await order.save()

        res.json({success:true,message:'Status Updated',statusHistory})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

export {placeOrder,placeOrderStripe, placeOrderRozerpay, userOrders, allOrders, updateStatus}