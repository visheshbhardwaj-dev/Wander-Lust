const { cloudinary } = require("../cloudConfig.js");
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// all show route
// List all listings
const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

//new route
// Render the new listing form
const renderNewForm = (req, res) => {
  res.render("listings/new");
};

//show each route
// Show a single listing with populated reviews and owner
const showListing = async (req, res) => {
  const { id } = req.params;
  const foundListing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!foundListing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { foundListing });
};

//create new
// Create a new listing
const createListing = async (req, res) => {
  const listingData = req.body.listing;
  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

//Edit form
// Render the edit listing form
const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const foundListing = await Listing.findById(id);
  res.render("listings/edit", { foundListing });
};

//update route
// Update an existing listing
const updateListing = async (req, res) => {
  const { id } = req.params;
  let updatedListing = await Listing.findById(id);

  // update text fields
  updatedListing.set(req.body.listing);

  if (req.file) {
    // delete OLD image
    await cloudinary.uploader.destroy(updatedListing.image.filename);

    // assign NEW image
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await updatedListing.save();

  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

//delete route
// Delete a listing
const deleteListing = async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted Successfully");
  console.log(deleted);
  res.redirect("/listings");
};

//Categorised Listings

const categoryListing = async (req, res) => {
  const allowedCategories = [
    "Beaches",
    "Cabins",
    "Rooms",
    "Apartments",
    "Mountains",
    "Camping",
    "Iconic_cities",
    "Amazing_pools",
    "Igloo",
    "Farms",
  ];

  const { category } = req.params;
  if (!allowedCategories.includes(category)) {
    throw new ExpressError(404, "Category not found");
  }

  const foundListing = await Listing.find({ category });

 
res.render("listings/category",{foundListing,category})
};

module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
  categoryListing
};
