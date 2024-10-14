if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const UserModel = require("./models/user.model")
const listingRouter = require("./routes/listing.routes");
const reviewsRouter = require("./routes/reviews.routes");
const userRoute = require("./routes/user.routes");
const ExpressError = require("./utils/expressError");
const { error } = require("console");


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,  // For lazy update
    collectionName: 'sessions'
});

store.on("error", () => {
    console.log("ERROR ", error)
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine);

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})


// Routes
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("templates/listings/error", { message });
});

// Starting the server on port 5000
app.listen(5000);
