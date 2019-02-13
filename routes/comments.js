const express = require('express');
var router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');



//comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground:foundCamp})
    }
  })
});

//comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
  //lookup camp using using ID
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds")
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //connect new comment to camp
          foundCamp.comments.push(comment);
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      res.redirect("back")
    } else {
      res.render("comments/edit", {comment:foundComment, campground_id:req.params.id})
    }
  })
});

//update

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully updated");
      res.redirect ("/campgrounds/" + req.params.id)
    }
  })
});

//delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect("back")
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id)
    }
  });
});



module.exports = router;
