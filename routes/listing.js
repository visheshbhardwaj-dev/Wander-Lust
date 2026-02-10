const Express = require("express");
const route = Express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js")
const listingsController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage}  = require('../cloudConfig.js');
const upload = multer({ storage });



//validating schema on server side
const validate = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);


    if (error) {
        throw new ExpressError(400, error);
    } else {
        next()
    }
};


// all show route
route.get("/", wrapAsync(listingsController.index));

//new route
route.get("/new", isLoggedIn, listingsController.renderNewForm)

//show route
route.get("/:id", wrapAsync(listingsController.showListing));


//create route
route.post(
    "/",isLoggedIn ,upload.single("listing[image]"),validate ,wrapAsync(listingsController.createListing)
);


//edit route
route.get("/:id/edit", isOwner, wrapAsync(listingsController.renderEditForm));


//update route 
route.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"),validate, wrapAsync(listingsController.updateListing));

//delete route
route.delete("/:id", isOwner, wrapAsync(listingsController.deleteListing));

module.exports = route;
