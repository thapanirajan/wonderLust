
const model = require("./models/listing")
const Reviews = require("./models/reviews.model")
const { reviewSchema, wonderSchema } = require("./schema");
const ExpressError = require("./utils/expressError")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await model.findById(id)
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "you don't have permission to edit or delete this listing")
        return res.redirect(`/listing/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let reviews = await Reviews.findById(reviewId)
    if (!reviews.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "you don't have permission to  delete this review")
        return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = wonderSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next()
    }
}