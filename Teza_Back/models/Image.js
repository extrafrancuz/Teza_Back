const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ImageSchema = new Schema(
    {
        rentId: {
            type: String,
            ref: "Rent",
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Image = mongoose.model("Image", ImageSchema)

module.exports = Image
