const mongoose = require('mongoose');

//Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

campgroundSchema.virtual('averageRating').get(function() {
  const totalRating = this.comments.reduce((total, comment) => total + comment.rating, 0);

  return totalRating / this.comments.length;
});

module.exports = mongoose.model("Campground", campgroundSchema);
