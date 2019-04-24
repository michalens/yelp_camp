const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');



//comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground:foundCamp})
    }
  })
});

//comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  //lookup camp using using ID
  Campground.findById(req.params.id, (err, foundCamp) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds")
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //connect new comment to camp
          foundCamp.comments.push(comment);
          console.log('from comment post:' + foundCamp)
          // calculate average rating
          // const ratingsList = foundCamp.comments.map(comment => comment.rating)
          // const ratingSum = ratingsList.reduce((acc,val) => acc+val)
          // const averageRating = (ratingSum / ratingsList.length).toFixed(1);
          // foundCamp.rating = averageRating;

          foundCamp.save();
          //redirect to campground show page
          req.flash("success", "Successfully added a comment");
          res.redirect("/campgrounds/" + foundCamp._id)
        }
      });
    }
  });
});

//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back")
    } else {
      res.render("comments/edit", {comment:foundComment, campground_id:req.params.id})
    }
  })
});

//update

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully updated");
      res.redirect ("/campgrounds/" + req.params.id)
    }
  })
});

//delete
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect("back")
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id)
    }
  });
});



module.exports = router;
