import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {type:String, required:true},
    userId: {type:String, required:true},
    name: {type:String, required:true},
    rating: {type:Number, required:true, min:1, max:5},
    comment: {type:String, required:true, trim:true, maxlength:500},
    date: {type:Number, default:Date.now}
})

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;