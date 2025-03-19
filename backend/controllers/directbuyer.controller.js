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
    if(!buyers){
        return res.status(404).json({message:"User Not Found"})
    }

    //display all buyers
    return res.status(200).json({buyers});
};

//data insert

export const addBuyers = async (req, res, next) => {
  const { name, contact, address } = req.body;

  let buyer;

  try {
    if (!name || !contact || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    buyer = new Buyer({ name, contact, address });

    // Save the new buyer to the database
    await buyer.save();

  } catch (err) {
    console.error("Error while saving buyer:", err);
    return res.status(500).json({ message: "Unable to add buyer due to server error" });
  }

  return res.status(201).json({ buyer });
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

    if(!buyer){
        return res.status(404).send({message:"Buyer Not Found"});
    }
    return res.status(200).json({ buyer });


};


//update buyer details

export const updateBuyer = async(req, res, next) => {

    const id = req.params.id;
    const {name, contact, address } = req.body;

    let buyers;

    try{
        buyers = await Buyer.findByIdAndUpdate(id,
            {name: name, contact: contact, address: address});
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





