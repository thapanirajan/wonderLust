const express = require("express");
const router = express.Router({ mergeParams: true });
const middlewares = require("../middleware")

const wrapasync = require("../utils/asyncwrap");

const reviewsController = require("../controllers/review.controller");


// Create new review
router.post("/",
    middlewares.isLoggedIn,
    middlewares.validateReview,
    wrapasync(reviewsController.showPostReviews));

// delete review 
router.delete("/:reviewId",
    middlewares.isLoggedIn,
    middlewares.isReviewAuthor,
    wrapasync(reviewsController.DeleteReview));


module.exports = router;

