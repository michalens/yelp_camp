const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX
router.get("/", (req,res) => {
    //get all campgrounds from DB
    Campground.find({}, (err, allcampgrounds) => {
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allcampgrounds})
      }
    })
});

//NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    const { name, image, description, price, address } = req.body;
    const author = {
      id: req.user._id,
      username: req.user.username
    };
    const newCampground = {name, image, description, author, price};
    // create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
      if(err){
        console.log(err);
      } else {
        //redirect back to campgrounds page
        res.redirect("/campgrounds");
      }
    })

})

// SHOW
router.get("/:id", (req, res) => {
  //find the campground with provided id
  Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground:foundCamp});
    }
  })
});


//Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
          res.render("campgrounds/edit", {campground:foundCamp});
    });
});

//update
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
    if (err) {
      console.log(err);
      return res.redirect("/campgrounds");
    }
    res.redirect("/campgrounds/" + req.params.id)
  });
});

//Delete
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


module.exports = router;
