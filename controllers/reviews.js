const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// Create a new review and attach it to the listing
const createReview = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    const reviewData = req.body.review;

    const newReview = new Review(reviewData);
    newReview.author = req.user._id;
    console.log(newReview);
    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();

    res.redirect(`/listings/${id}`);
};

// Delete a review and remove it from the listing
const deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    const foundReview = await Review.findById(reviewID);
    if (req.user && !foundReview.author._id.equals(req.user._id)) {
        req.flash("error", "Permission Denied!");
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${id}`);
};

module.exports = {
    createReview,
    deleteReview
};
