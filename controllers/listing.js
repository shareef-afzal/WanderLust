const Listing=require("../models/listing");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxClient({ accessToken:mapToken });

module.exports.index=(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.create=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let sv=await newListing.save();
    console.log(sv);
    req.flash("success","new Listing created");
    res.redirect("/listings");
}
module.exports.showListing=async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing Doesnot Exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.renderEditForm=async (req,res)=>{
    let id=req.params.id;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doesnot Exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/c_fill,h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.updateListing=async (req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    let id=req.params.id;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}
module.exports.searchInListings=async (req, res) => {
    const { q,filter } = req.query;
    let allListings=[];
    if(q){
        const regex=new RegExp(q,'i');
        allListings=await Listing.find({
            $or:[
                {title:regex},
                {location:regex},
                {country:regex}
            ]
        });
    }
    else if(filter){
        console.log(filter);
        const regex=new RegExp(filter,'i');
        allListings=await Listing.find({filters:regex});
        console.log(allListings);
    }
    res.render("listings/search.ejs",{allListings});
}