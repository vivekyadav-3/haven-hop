if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn, isOwner, isReviewAuthor, saveRedirectUrl } = require("./middleware.js");

const NodeGeocoder = require("node-geocoder");
const options = {
  provider: 'openstreetmap',
};
const geocoder = NodeGeocoder(options);

// Database Connection
const dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/haven_hop";
mongoose.connect(dbUrl)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const MongoStore = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

app.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Haven Hop!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

app.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("DEBUG: Authenticate callback");
    if (err) {
      console.log("DEBUG Error:", err);
      return next(err);
    }
    if (!user) {
      console.log("DEBUG Failure Info:", info);
      req.flash("error", info.message || "Login Failed");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("DEBUG Login Error:", err);
        return next(err);
      }
      console.log("DEBUG: Login Successful!");
      req.flash("success", "Welcome back to Haven Hop!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  })(req, res, next);
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
});

app.get("/listings", async (req, res) => {
  const { search, category } = req.query;
  let allListings;
  
  if (search) {
    allListings = await Listing.find({ title: { $regex: search, $options: "i" } });
  } else if (category) {
    allListings = await Listing.find({ category: category });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});

app.post("/listings", isLoggedIn, async (req, res) => {
  let geoData = await geocoder.geocode(req.body.listing.location);
  let geometry = { type: 'Point', coordinates: [77.209, 28.6139] }; // Default New Delhi

  if (geoData.length > 0) {
      geometry = { type: 'Point', coordinates: [geoData[0].longitude, geoData[0].latitude] };
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.geometry = geometry;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
});

app.get("/listings/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});

const Review = require("./models/review.js");

app.post("/listings/:id/reviews", isLoggedIn, async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
});

app.delete("/listings/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  let { id, reviewId } = req.params;
  
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
});

const PORT = process.env.PORT || 8080;

// Vercel handles the server start in production
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`);
  });
}

module.exports = app;
