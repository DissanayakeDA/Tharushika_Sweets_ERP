import Buyer from '../models/directbuyer.model.js';

//display part
export const getAllBuyers = async (req, res, next) => {

    let buyers;

    //get all buyers
    try{
        buyers = await Buyer.find();
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error occurred" });
    }
    //if not found any buyer
    if(!buyers){
        return res.status(404).json({message:"User Not Found"})
    }

    //display all buyers
    return res.status(200).json({buyers});
};

//data insert

export const addBuyers = async (req, res, next) =>{

    const {name, contact, date} = req.body;

    let buyers;

    try{
        buyers = new Buyer({name, contact, date });
        await buyers.save();
    }catch(err){
        console.log(err);
    }

    //if not inserting buyers
    if(!buyers){
        return res.status(404).send({message:"Unable to add users"});
    }
    return res.status(200).json({ buyers });

};

//getbyid
export const getById = async (req, res, next) => {

    const id = req.params.id;

    let buyer;

    try{
        buyer = await Buyer.findById(id);
    }catch(err){
        console.log(err);
    }

    //if not available buyers
    if(!buyer){
        return res.status(404).send({message:"Buyer Not Found"});
    }
    return res.status(200).json({ buyer });


};


//update buyer details

export const updateBuyer = async(req, res, next) => {

    const id = req.params.id;
    const {name, contact, date } = req.body;

    let buyers;

    try{
        buyers = await Buyer.findByIdAndUpdate(id,
            {name: name, contact: contact, date: date});
            buyers = await buyers.save();
    }catch(err){
        console.log(err);
    }
    if(!buyers){
        return res.status(404).send({message:"Unable to update buyer details"});
    }
    return res.status(200).json({ buyers });

};

//delete buyer details
export const deleteBuyer = async (req, res, next) => {

    const id = req.params.id;

    let buyer;

    try{
        buyer = await Buyer.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }

    if(!buyer){
        return res.status(404).send({message:"Unable to delete buyer details"});
    }
    return res.status(200).json({ buyer });
};

//export
/*exports.getAllBuyers = getAllBuyers;
exports.addBuyers = addBuyers;
exports.getById = getById;
exports.updateBuyer = updateBuyer;
exports.deleteBuyer = deleteBuyer;**/





