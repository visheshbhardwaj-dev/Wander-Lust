if(process.env.NODE_ENV !="production"){
// If we are NOT in production mode, load environment variables from .env file
require('dotenv').config();
}

const express = require("express");
const app = express(); // Create an Express application
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const session = require("express-session");
const flash   = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')
const {MongoStore} = require("connect-mongo");



app.engine("ejs", ejsMate); 
// Use ejsMate engine for EJS (helps with layouts/boilerplate)

app.set("view engine", "ejs"); 
// Set EJS as the template engine

app.set("views", path.join(__dirname, "views")); 
// Define the directory where view files are stored

app.use(express.urlencoded({ extended: true })); 
// Parse incoming form data (req.body)

app.use(methodOverride("_method")); 
// Allow PUT & DELETE requests using ?_method=PUT/DELETE

app.use(express.static(path.join(__dirname, "public"))); 
// Serve static files (CSS, JS, images) from public folder


const DbURL  = process.env.ATLASDB_URL
// Get MongoDB connection URL from environment variables


main().then(() => {
    console.log("connection established"); // Log when DB connects successfully
}).catch((err) => {
    console.log(err); // Log error if DB connection fails
})

async function main() {
    await mongoose.connect(DbURL); 
    // Connect to MongoDB using mongoose
}

const store = MongoStore.create({
    mongoUrl:DbURL, // MongoDB URL for session storage
    touchAfter: 24*60*60, 
    // Only update session once in 24 hours if unchanged (reduces DB writes)
    crypto:{
        secret : process.env.SESSION_SECRET 
        // Encrypt session data with secret
    }
});

store.on("error",(err)=>{
    console.log("session store error:",err); 
    // Log session store errors
});


const sessionOptions =  {
    store, // Use MongoDB store instead of default memory store
    secret:process.env.SESSION_SECRET, 
    // Secret key to sign session ID cookie
    resave: false, 
    // Don't resave session if nothing changed
    saveUninitialized: false, 
    // Don't create session until something is stored
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, 
        // Cookie expiration time (7 days)
        maxAge: 7*24*60*60*1000, 
        // Cookie lifespan (7 days in ms)
        httpOnly: true
        // Prevent client-side JS from accessing cookie (security)
    }
}


app.get("/", (req, res) => {
    res.redirect("/listings") 
    // Redirect root URL to /listings
})


app.use(session(sessionOptions)); 
// Initialize session middleware with options

app.use(flash()); 
// Enable flash messages (temporary messages stored in session)

app.use(passport.initialize()); 
// Initialize passport authentication

app.use(passport.session()); 
// Enable persistent login sessions


passport.use(new localStrategy(User.authenticate())); 
// Use local strategy (username & password) for authentication

passport.serializeUser(User.serializeUser()); 
// Decide what data of user is stored in session

passport.deserializeUser(User.deserializeUser()); 
// Retrieve full user data from session


app.use(( req, res, next) => {
    res.locals.success  = req.flash("success"); 
    // Make success flash messages available in all templates

    res.locals.error = req.flash("error"); 
    // Make error flash messages available in all templates

    res.locals.currUser = req.user; 
    // Make current logged-in user available in all templates

    next(); 
    // Move to next middleware
})


// listings routes
app.use("/listings",listingRoutes);
// All routes starting with /listings go to listingRoutes

// reviews routes
app.use("/listings/:id/review", reviewRoutes);
// Routes for reviews nested under listings

// user routes
app.use("/",userRoutes);
// Authentication & user-related routes


// 404 handler (if no route matched above)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
    // Forward custom 404 error to error handler
});

// error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    // Use provided status code or default to 500

    const message = err.message || "Something went wrong"; 
    // Use provided error message or fallback

    res.status(statusCode).render("listings/error", { message });
    // Render error page with status and message
});


const PORT = process.env.PORT || 8080;
// Use environment port (for deployment) or default to 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start server and log running port
});
