const Job = require("../models/Job")

exports.add = async (req, res) => {
    const { title, content, city, education, experience, salary, time, place, phone, email } = req.body

    try {
        const job = new Job({
            title,
            content,
            city,
            education,
            experience,
            salary,
            time,
            place,
            phone,
            email,
            company,
            company_logo
        })

        await job.save()

        return res.status(201).json({
            status: "SUCCESS",
            message: "Job created successfully",
            job
        })
    } catch (error) {
        return res.status(409).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

exports.getJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 12; // Number of items per page
        const skip = (page - 1) * limit; // Number of items to skip

        const filters = {};
        if (req.query.title) filters["title.en"] = { $regex: req.query.title, $options: "i" }; // Case-insensitive search
        if (req.query.city) filters["city.en"] = req.query.city;
        if (req.query.education) filters["education.en"] = req.query.education;
        if (req.query.experience) filters["experience.en"] = req.query.experience;
        if (req.query.time) filters["time.en"] = req.query.time;
        if (req.query.place) filters["place.en"] = req.query.place;
        if (req.query.minSalary || req.query.maxSalary) filters.salary = {};
        if (req.query.minSalary) filters.salary.$gte = Number(req.query.minSalary);
        if (req.query.maxSalary) filters.salary.$lte = Number(req.query.maxSalary);

        // Get total count before pagination
        const totalJobs = await Job.countDocuments(filters);
        const totalPages = Math.ceil(totalJobs / limit);

        // Get paginated data
        const jobs = await Job.find(filters)
            .sort({ createdAt: -1 }) // Sort by creation date (newest first)
            .skip(skip) // Skip the first (page - 1) * limit items
            .limit(limit); // Limit the number of items returned

        // Check if there are more documents
        const hasNextPage = page < totalPages;

        return res.status(200).json({
            status: "SUCCESS",
            data: {
                jobs,
                job_pagination: {
                    currentPage: page,
                    totalPages,
                    totalJobs,
                    hasNextPage,
                    hasPrevPage: page > 1,
                    itemsPerPage: limit
                }
            }
        });
    } catch (error) {
        return res.status(408).json({
            status: "FAILED",
            message: error.message
        });
    }
};

exports.getJobById = (req, res) => {
    const { id } = req.params; // Extracting the job ID from the request parameters

    try {
        Job.findById(id).then(job => {
            if (!job) {
                return res.status(404).json({
                    status: "FAILED",
                    message: "Job not found"
                });
            }
            return res.json(job);
        }).catch(error => {
            return res.status(408).json({
                status: "FAILED",
                message: error.message
            });
        });
    } catch (error) {
        return res.status(408).json({
            status: "FAILED",
            message: error.message
        });
    }
}