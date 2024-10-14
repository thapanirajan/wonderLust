const model = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeoCoding({ accessToken: mapToken })


module.exports.handleGetAllListings = async (req, res) => {
    const listings = await model.find({});
    res.render("templates/listings/index", { listings });
};

module.exports.handleCreateListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new model({
        ...req.body.listing,
        owner: req.user._id
    });
    newListing.image = { url, filename };
    newListing.coordinates = response.body.features[0].geometry
    await newListing.save();
    req.flash("success", "New Listing created")
    res.redirect("/listing");
};

module.exports.handleCreateListingForm = (req, res) => {
    res.render("templates/listings/create");
};

module.exports.handleListingDetailByid = async (req, res) => {
    const { id } = req.params;
    let detail = await model.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner")
    if (!detail) {
        req.flash("error", "Requested Listing doesnot exists")
        return res.redirect("/listing")
    }
    let averageRating = 0;
    let totalrating = 0;
    if (detail.reviews.length > 0) {
        reviewNumber = detail.reviews.length;
        detail.reviews.forEach((review) => {
            totalrating = totalrating + Number(review.rating);
        })
        averageRating = (totalrating / reviewNumber).toFixed(1);
    }
    res.render("templates/listings/detail", { detail, averageRating });
};

module.exports.handleGetEditListingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await model.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("templates/listings/edit", { listing, originalImageUrl });
};

module.exports.handleUpdateListingDetails = async (req, res) => {
    const { id } = req.params;
    let updatedListing = await model.findByIdAndUpdate(id, {
        ...req.body.listing
    });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename }
        await updatedListing.save();
    }
    req.flash("success", "Listing updated!!");
    res.redirect(`/listing/${id}`);
};

module.exports.handleDeleteListing = async (req, res) => {
    const { id } = req.params;
    await model.findByIdAndDelete(id);
    req.flash("success", "Listing deleted")
    res.redirect("/listing");
};

