const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    content: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    city: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    education: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    experience: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    salary: Number,
    time: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    place: {
        en: String,
        ro: String,
        ru: String,
        uk: String
    },
    phone: String,
    email: String,
    company: String,
    company_logo: String
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);