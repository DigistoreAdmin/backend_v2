const panCardUsers = require("../db/models/pancard");
const definePassportDetails = require("../db/models/passport");
const Franchise = require("../db/models/franchise");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const kswift = require("../db/models/kswift");
const defineStaffsDetails = require("../db/models/staffs");
const BusBooking = require('../db/models/busbooking');
const fssaiRegistrations = require("../db/models/fssairegistration");
const fssaiLicences = require("../db/models/fssailicence");
const gstRegistrationDetails = require("../db/models/gstregistration");
const gstFilings = require("../db/models/gstfiling");

const getPancardDetails = async (req, res) => {
    try {
        const user = req.user;
        const { sort, page, pageLimit, pantype, isDuplicateOrChange } = req.query;

        console.log("req.query", req.query);

        if (!page || !pageLimit) {
            return res
                .status(400)
                .json({ error: "page and pageLimit query parameters are required" });
        }

        const pageNumber = parseInt(page, 10);
        const pageLimitNumber = parseInt(pageLimit, 10);

        const limit = pageLimitNumber;
        const offset = (pageNumber - 1) * limit;

        let where = {}

        if (pantype === "duplicateOrChangePancard") {
            where = { panType: pantype };
            if (isDuplicateOrChange) {
                where = { panType: pantype, isDuplicateOrChangePan: isDuplicateOrChange };
            }
        }
        else if (pantype) {
            where = { panType: pantype }
        }

        const franchise = await Franchise.findOne({
            where: { email: user.email },
        });

        if (!franchise) {
            return res.status(404).json({ message: "Franchise not found" });
        }

        const PancardUser = panCardUsers();

        const data = await PancardUser.findAndCountAll({
            where: where,
            limit,
            offset,
            order: sort ? [[sort, "ASC"]] : undefined,
        });
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        return res.status(200).json({
            data: data.rows,
            totalItems: data.count,
            totalPages: Math.ceil(data.count / limit),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error("Error fetching pancard details:", error);
        res.status(500).json({ error: "Failed to fetch pancard details" });
    }
};

const fetchPassport = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageSize query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const user = req.user;
    if (!user) {
        return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
        where: { email: user.email },
    });

    if (!franchise) {
        return next(new AppError("Franchise not found", 404));
    }

    if (!franchise.franchiseUniqueId) {
        return next(new AppError("Missing unique id for the franchise", 400));
    }

    const where = { uniqueId: franchise.franchiseUniqueId };

    const Passport = await definePassportDetails();
    const getPassport = await Passport.findAndCountAll({
        where,
        limit,
        offset,
    });
    if (!getPassport) {
        return next(new AppError("Data not found", 404));
    }

    res.status(200).json({
        data: getPassport.rows,
        totalPages: Math.ceil(getPassport.count / limit),
        totalItems: getPassport.count,
        currentPage: pageNumber,
    });
});

const fetchKswift = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageSize query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const user = req.user;
    if (!user) {
        return next(new AppError("User not found", 401));
    }
    const franchise = await Franchise.findOne({
        where: { email: user.email },
    });

    if (!franchise) {
        return next(new AppError("Franchise not found", 404));
    }

    if (!franchise.franchiseUniqueId) {
        return next(new AppError("Missing unique id for the franchise", 400));
    }

    const where = { uniqueId: franchise.franchiseUniqueId };

    const getKswift = await kswift.findAndCountAll({
        where,
        limit,
        offset,
    });
    if (!getKswift) {
        return next(new AppError("Data not found", 404));
    }

    res.status(200).json({
        data: getKswift.rows,
        totalPages: Math.ceil(getKswift.count / limit),
        totalItems: getKswift.count,
        currentPage: pageNumber,
    });
});

const fetchStaffs = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageSize query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const staff = await defineStaffsDetails();

    const getStaff = await staff.findAndCountAll({
        limit,
        offset,
    });
    if (!getStaff) {
        return next(new AppError("Data not found", 404));
    }

    res.status(200).json({
        data: getStaff.rows,
        totalPages: Math.ceil(getStaff.count / limit),
        totalItems: getStaff.count,
        currentPage: pageNumber,
    });
});

const getBusBookings = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const busBookings = await BusBooking.findAndCountAll({
        limit,
        offset
    })
    if (!busBookings) {
        return next(new AppError("Data not found", 404));
    }
    res.status(200).json({
        data: busBookings.rows,
        totalPages: Math.ceil(busBookings.count / limit),
        totalItems: busBookings.count,
        currentPage: pageNumber,
    });
})

const getFssaiRegistrations = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const fssaiRegistration = await fssaiRegistrations.findAndCountAll({
        limit,
        offset
    })
    if (!fssaiRegistration) {
        return next(new AppError("Data not found", 404));
    }
    res.status(200).json({
        data: fssaiRegistration.rows,
        totalPages: Math.ceil(fssaiRegistration.count / limit),
        totalItems: fssaiRegistration.count,
        currentPage: pageNumber,
    });
})

const getFssaiLicence = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const fssaiLicenceDetails = await fssaiLicences.findAndCountAll({
        limit,
        offset
    })
    if (!fssaiLicenceDetails) {
        return next(new AppError("Data not found", 404));
    }
    res.status(200).json({
        data: fssaiLicenceDetails.rows,
        totalPages: Math.ceil(fssaiLicenceDetails.count / limit),
        totalItems: fssaiLicenceDetails.count,
        currentPage: pageNumber,
    });
})

const getGstRegistrations = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const gstRegistrationTable = await gstRegistrationDetails()
    const gstRegistrations = await gstRegistrationTable.findAndCountAll({
        limit,
        offset
    })
    if (!gstRegistrations) {
        return next(new AppError("Data not found", 404));
    }
    res.status(200).json({
        data: gstRegistrations.rows,
        totalPages: Math.ceil(gstRegistrations.count / limit),
        totalItems: gstRegistrations.count,
        currentPage: pageNumber,
    });
})

const getGstFilings = catchAsync(async (req, res, next) => {
    const { page, pageLimit } = req.query;

    if (!page || !pageLimit) {
        return res
            .status(400)
            .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    const gstFilingDetails = await gstFilings.findAndCountAll({
        limit,
        offset
    })
    if (!gstFilingDetails) {
        return next(new AppError("Data not found", 404));
    }
    res.status(200).json({
        data: gstFilingDetails.rows,
        totalPages: Math.ceil(gstFilingDetails.count / limit),
        totalItems: gstFilingDetails.count,
        currentPage: pageNumber,
    });
})


module.exports = {
    fetchPassport, fetchKswift, fetchStaffs, getPancardDetails, getBusBookings, getFssaiRegistrations
    , getFssaiLicence, getGstRegistrations,getGstFilings
};