const Rent = require("../models/Rent")
const Image = require("../models/Image")

exports.add = async (req, res) => {
    const { district, price, numberOfRooms, area, phone, location, housingFund, seller, condition, floor, floorsNumber, buildingType, company, parkingSpace, balcony, bathroom, bonuses, living, children, pet, imageUrls, html } = req.body;

    try {
        const rent = new Rent({
            district,
            price,
            numberOfRooms,
            area,
            phone,
            location,
            housingFund,
            seller,
            condition,
            floor,
            floorsNumber,
            buildingType,
            company,
            parkingSpace,
            balcony,
            bathroom,
            bonuses,
            living,
            children,
            pet,
            imageUrls,
            html
        });

        await rent.save();

        const imageDocuments = imageUrls.map((url) => ({
            rentId: rent._id,
            url: url,
        }));

        await Image.insertMany(imageDocuments);

        return res.status(201).json({
            status: "SUCCESS",
            message: "New rent added successfully",
            rent,
            images: imageDocuments,
        });
    } catch (error) {
        return res.status(409).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

exports.getRents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const filters = {};

        if (req.query.district) {
            filters["district.en"] = req.query.district;
        }
        if (req.query.location) {
            filters["location.en"] = { $regex: req.query.location, $options: "i" }; // Case-insensitive search
        }
        if (req.query.housingFund) {
            filters["housingFund.en"] = req.query.housingFund;
        }
        if (req.query.seller) {
            filters["seller.en"] = req.query.seller;
        }
        if (req.query.condition) {
            filters["condition.en"] = req.query.condition;
        }
        if (req.query.parkingSpace) {
            filters["parkingSpace.en"] = req.query.parkingSpace;
        }

        // Other filters (non-nested fields)
        if (req.query.numberOfRooms) {
            filters.numberOfRooms = Number(req.query.numberOfRooms);
        }
        if (req.query.minRooms) {
            filters.numberOfRooms = { ...filters.numberOfRooms, $gte: Number(req.query.minRooms) };
        }
        if (req.query.area) {
            filters.area = Number(req.query.area);
        }
        if (req.query.minArea) {
            filters.area = { ...filters.area, $gte: Number(req.query.minArea) };
        }
        if (req.query.maxArea) {
            filters.area = { ...filters.area, $lte: Number(req.query.maxArea) };
        }
        if (req.query.floor) {
            filters.floor = req.query.floor;
        }
        if (req.query.floorsNumber) {
            filters.floorsNumber = req.query.floorsNumber;
        }
        if (req.query.balcony) {
            filters.balcony = Number(req.query.balcony);
        }
        if (req.query.minBalcony) {
            filters.balcony = { ...filters.balcony, $gte: Number(req.query.minBalcony) };
        }
        if (req.query.bathroom) {
            filters.bathroom = Number(req.query.bathroom);
        }
        if (req.query.minBathroom) {
            filters.bathroom = { ...filters.bathroom, $gte: Number(req.query.minBathroom) };
        }
        if (req.query.children) {
            filters.children = req.query.children;
        }
        if (req.query.pet) {
            filters.pet = req.query.pet;
        }
        if (req.query.minPrice) {
            filters.price = { ...filters.price, $gte: Number(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            filters.price = { ...filters.price, $lte: Number(req.query.maxPrice) };
        }

        // Get total count before pagination
        const totalRents = await Rent.countDocuments(filters);
        const totalPages = Math.ceil(totalRents / limit);

        // Get paginated data using regular find instead of cursor
        const rents = await Rent.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Check if there are more documents by querying for one more
        const hasNextPage = await Rent.findOne(filters)
            .sort({ createdAt: -1 })
            .skip(skip + limit)
            .limit(1)
            .then(doc => !!doc);

        return res.status(200).json({
            status: "SUCCESS",
            data: {
                rents,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRents,
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

exports.getRentByID = async (req, res) => {
    const { id } = req.params;

    try {
        const rent = await Rent.findById(id).select("-__v"); // Exclude only the `__v` field

        if (!rent) {
            return res.status(404).json({
                status: "FAILED",
                message: "Rent not found"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: rent
        });
    } catch (error) {
        return res.status(408).json({
            status: "FAILED",
            message: error.message
        });
    }
};