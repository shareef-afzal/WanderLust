const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.get("/search", listingController.searchInListings);
//index route 
router.get("/",wrapAsync(listingController.index));
//NEW route(C)
router.get("/new",isLoggedIn,listingController.renderNewForm);
//CREATE ROUTE(C)
router.post("/",isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.create));
//show route(R)
router.get("/:id",wrapAsync(listingController.showListing));
//Edit Route(U)
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))
//Update Route(U)
router.put("/:id",isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing));
//Delete Request
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
//Search requess


module.exports=router;