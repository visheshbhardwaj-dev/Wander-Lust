const Express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const route = Express.Router();
const passport= require("passport");
const { saveUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");



//signup form route
route.get("/signup", userController.renderSignupForm)




//signup route
route.post("/signup", wrapAsync(userController.signup))

//login form route
route.get("/login", userController.renderLoginForm)

//login route
route.post("/login",
    saveUrl
    ,passport.authenticate(
        "local",
        {failureRedirect:"/login",
            failureFlash:true
        }
    )
    ,userController.login
)

//logout route
route.get("/logout", userController.logout)

module.exports = route;
