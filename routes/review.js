const Express = require("express");
const route =  Express.Router({ mergeParams: true });


const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");







const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);


    if (error) {
        throw new ExpressError(400, error);
    } else {
        next()
    }
};





//REVIEW POST ROUTE
route.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));


//REVIEW DELETE ROUTE
route.delete("/:reviewID", wrapAsync(reviewsController.deleteReview))


module.exports= route;
