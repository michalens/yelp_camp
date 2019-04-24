const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
  	author: {
    	id: {
      		type: mongoose.Schema.Types.ObjectId,
      		ref: "User"
    	},
    	username: String,
  	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	}
});

commentSchema.pre('remove', function(next) {
    Campground.remove({comment_id: this._id}).exec();
    next();
});

module.exports = mongoose.model("Comment", commentSchema);
