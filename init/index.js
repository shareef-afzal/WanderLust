const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const intiDB=async()=>{
    await Listing.deleteMany({});
    //  68567f8917c4d2c623522e31
    initData.data=initData.data.map((obj)=>({...obj,owner:"68567f8917c4d2c623522e31"}))
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
}

intiDB();