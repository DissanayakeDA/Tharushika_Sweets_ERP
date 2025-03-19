import mongoose from "mongoose";
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    
});
const Return = mongoose.model("Buyer", buyerSchema);

export default Return;