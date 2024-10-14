const UserModel = require("../models/user.model")

module.exports.showSignupForm = (req, res) => {
    res.render("templates/users/signup");
}

module.exports.signupUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new UserModel({ email, username });
        const registeredUser = await UserModel.register(newUser, password);


        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "User was registered successfully");
                return res.redirect("/listing");
            }
        })
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup")
    }
}

module.exports.showLoginForm = (req, res) => {
    res.render("templates/users/login");
}

module.exports.loginUser = (req, res) => {
    req.flash("success", "Successfully Logged in")
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logOutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "User succesfully logged out")
        res.redirect("/listing");
    })
}