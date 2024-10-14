const ExpressError = require("../utils/expressError.js");
const model = require("../models/listing.js");
const Review = require("../models/reviews.model.js")

module.exports.showPostReviews = async (req, res) => {
    const id = req.params.id;
    let listing = await model.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Page not found");
    }
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currentUser;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New Review created");
    res.redirect(`/listing/${req.params.id}`);
};

module.exports.DeleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await model.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
};


