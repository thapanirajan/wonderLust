const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.controller.js");

const wrapasync = require("../utils/asyncwrap");
const middlewares = require("../middleware.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

// Get all listing
router.route("/")
    .get(wrapasync(listingController.handleGetAllListings))

    // create new listing
    .post(middlewares.isLoggedIn,
        upload.single('listing[image]'),
        middlewares.validateListing,
        wrapasync(listingController.handleCreateListing))

router.route("/:id")
    // Update listing by id
    .patch(middlewares.isLoggedIn,
        middlewares.isOwner,
        upload.single("listing[image]"),
        middlewares.validateListing,
        wrapasync(listingController.handleUpdateListingDetails))

    // Delete a listing by ID
    .delete(middlewares.isLoggedIn,
        middlewares.isOwner,
        wrapasync(listingController.handleDeleteListing));


// render create new listing form 
router.get("/create", middlewares.isLoggedIn, wrapasync(listingController.handleCreateListingForm)); // ggg


// get details of listing by id
router.get("/:id", wrapasync(listingController.handleListingDetailByid));


// Render Edit listing form 
router.get("/edit/:id", middlewares.isLoggedIn, middlewares.isOwner, wrapasync(listingController.handleGetEditListingForm)); //gg

module.exports = router;
