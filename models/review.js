//campground to review is a 1 to n relationship
//we do 1 to many so we store object id of each review in campground
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model("Review",reviewSchema);