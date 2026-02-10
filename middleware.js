module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      if (req.session) {
        req.session.redirectUrl = req.originalUrl;
      }
         req.flash("error","Login required for this action");
       return  res.redirect("/login");
     }
     next();
}




module.exports.saveUrl= (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = require("./models/listing.js");
  let foundListing = await listing.findById(id);
  if (!foundListing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  if (!foundListing.owner._id.equals(req.user._id)) {
    req.flash("error", "Access denied!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
