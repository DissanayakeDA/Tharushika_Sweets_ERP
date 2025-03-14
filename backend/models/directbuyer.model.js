import mongoose from "mongoose";
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    name:{
        type:String,//datatype
        required:true,//vaidate
    },
    contact:{
        type:Number,//datatype
        required:true,//vaidate
    },
    date:{
        type:Date,//datatype
        required:true,//vaidate
    },
    
});
const Buyer = mongoose.model("Buyer", buyerSchema);

export default Buyer;