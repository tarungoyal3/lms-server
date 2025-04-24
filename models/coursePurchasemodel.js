import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Pending','completed','failed'],
        default:"Pending"
    },
    paymentId:{
        type:String,
        required:true
    }
},{timestamps:true})

export const CoursePurchase = mongoose.model("CoursePurchase",coursePurchaseSchema)
export default CoursePurchase;