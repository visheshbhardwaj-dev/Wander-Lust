if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
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
const MongoStore = require("connect-mongo");

const upload = multer({ dest: 'uploads/' })

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const DbURL  = process.env.ATLASDB_URL




main().then(() => {
    console.log("connection established");

}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(DbURL);

}
const store = MongoStore.createKrupteinAdapter({
    mongoUrl:DbURL,
    touchAfter: 24*60*60,
    crypto:{
        secret : process.env.SESSION_SECRET
    }
});

store.on("error",(err)=>{
    console.log("session store error:",err);
});


const sessionOptions =  {
    store,
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true

    }
}




app.get("/", (req, res) => {
    res.redirect("/listings")
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



 app.use(( req, res, next) => {
    res.locals.success  = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})






//listings 
app.use("/listings",listingRoutes);

//reviews
app.use("/listings/:id/review", reviewRoutes);


//user
app.use("/",userRoutes);





// 404 handler (no route matched)
app.use((req, res, next) => {


    next(new ExpressError(404, "Page not Found!"));
});

// error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).render("listings/error", { message });
});




app.listen(8080, () => {
    console.log("listening on port 8080");
});