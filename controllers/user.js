const User = require("../models/user.js");

// Render the signup page
const renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

// Register a new user and log them in
const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Registration Successful");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render the login page
const renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

// Finalize login after passport authentication
const login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Log out the current user
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Succecssfully logged out!");
        res.redirect("/listings");
    });
};

module.exports = {
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout
};
