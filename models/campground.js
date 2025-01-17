const mongoose = require('mongoose');
const Review = require('./review')
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

//to delete all reviews of that campground when we delete campground
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
    console.log(doc);
})
module.exports = mongoose.model('Campground', CampgroundSchema);