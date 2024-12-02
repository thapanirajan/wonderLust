const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.model.js");

const url = "mongodb://127.0.0.1:27017/listing";
mongoose.connect(url);


const wondereSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        url: String,
        filename: String
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    country: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    coordinates: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});


// Deletes associated reviews when a listing is deleted
wondereSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})


const wonder = mongoose.model("wonder", wondereSchema);

module.exports = wonder;
