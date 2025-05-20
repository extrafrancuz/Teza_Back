const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        author: {
            type: String,
            required: false
        },
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;