const express = require("express")
const router = express.Router();
const passport = require("passport")
const middlewares = require("../middleware");
const userController = require("../controllers/user.controller")


router.route("/signup")
    .get(userController.showSignupForm)
    .post(userController.signupUser);

router.route("/login")
    .get(userController.showLoginForm)
    .post(middlewares.saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginUser);


router.get("/logout",
    userController.logOutUser);

module.exports = router;