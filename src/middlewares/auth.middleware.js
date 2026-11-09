
const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ========================================
// FOOD PARTNER AUTHENTICATION
// ========================================
async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food Partner account not found. Please login again."
            });
        }

        req.foodPartner = foodPartner;

        next();

    } catch (error) {
        console.log("Food Partner Auth Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


// ========================================
// USER AUTHENTICATION
// ========================================
async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "User account not found. Please login again."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("User Auth Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};
