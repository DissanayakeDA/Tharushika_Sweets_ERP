import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pdfSchema = new Schema({
    pdf:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },

});

export default mongoose.model("InvoiceDetails", pdfSchema);
