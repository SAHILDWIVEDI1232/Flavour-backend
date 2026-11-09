
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
function generateToken(id) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in .env file");
    }

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// Cookie Options
function setTokenCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}


// ================= USER REGISTER =================

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isUserAlreadyExists = await userModel.findOne({
            email: normalizedEmail
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Check JWT configuration before creating user
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is missing in environment variables"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        setTokenCookie(res, token);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("User Registration Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}


// ================= USER LOGIN =================

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const token = generateToken(user._id);

        setTokenCookie(res, token);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("User Login Error:", error);

        return res.status(500).json({
            message: "User login failed",
            error: error.message
        });
    }
}


// ================= USER LOGOUT =================

function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        message: "User logged out successfully"
    });
}


// ================= FOOD PARTNER REGISTER =================

async function registerFoodPartner(req, res) {
    try {
        const {
            name,
            email,
            password,
            phoneno,
            contactname
        } = req.body;

        if (!name || !email || !password || !phoneno || !contactname) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email: normalizedEmail
        });

        if (isAccountAlreadyExists) {
            return res.status(409).json({
                message: "Food Partner Account already exists"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is missing in environment variables"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            contactname,
            phoneno
        });

        const token = generateToken(foodPartner._id);

        setTokenCookie(res, token);

        return res.status(201).json({
            message: "Food Partner registered successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                contactname: foodPartner.contactname,
                phoneno: foodPartner.phoneno
            }
        });

    } catch (error) {
        console.error("Food Partner Registration Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            message: "Food Partner registration failed",
            error: error.message
        });
    }
}


// ================= FOOD PARTNER LOGIN =================

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const foodPartner = await foodPartnerModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!foodPartner) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            foodPartner.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }
console.log("Food Partner Login ID:", foodPartner._id);
        const token = generateToken(foodPartner._id);

        setTokenCookie(res, token);

        return res.status(200).json({
            message: "Food Partner logged in successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            }
        });

    } catch (error) {
        console.error("Food Partner Login Error:", error);

        return res.status(500).json({
            message: "Food Partner login failed",
            error: error.message
        });
    }
}


// ================= FOOD PARTNER LOGOUT =================

function logoutFoodPartner(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        message: "Food Partner logged out successfully"
    });
}


// EXPORT ALL FUNCTIONS

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
