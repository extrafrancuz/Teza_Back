const mongoose = require("mongoose");

const RentSchema = new mongoose.Schema({
    district: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    price: Number,
    numberOfRooms: Number,
    area: Number,
    phone: String,
    location: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    housingFund: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    seller: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    condition: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    floor: Number,
    floorsNumber: Number,
    buildingType: String,
    company: String,
    parkingSpace: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    balcony: Number,
    bathroom: Number,
    bonuses: [
        {
            en: String,
            ro: String,
            ru: String,
            uk: String
        }
    ],
    living: Boolean,
    children: Boolean,
    pet: Boolean,
    imageUrls: [String],
    html: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    }
});

module.exports = mongoose.model("Rent", RentSchema);