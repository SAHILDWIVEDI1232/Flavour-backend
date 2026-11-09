// const foodModel=require("../models/food.model");
// const starageservice=requirerequire('../services/storage.service')
// const {v4:uuid}=require("uuid")
// async function createFood(req,res){
//     console.log(req.foodPartner)
//     console.log(req.body)
//     console.log(req.file)
//     res.send("food item created")
// }
// costfileuploadresult=await storagaeService.uplaoadFile(req.file.buffer,uuid())
// consoloe.log(fileUploadResult)
// module.exports={
//     createFood
// }


const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel = require("../models/likes.models");
const saveModel = require("../models/save.model");

// ========================================
// 1. CREATE FOOD
// ========================================
async function createFood(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food Partner authentication required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a food video"
            });
        }

        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Food name is required"
            });
        }

        // Upload video to Cloudinary
        const fileUploadResult = await storageService.uploadFile(
            req.file,
            uuid()
        );

        // Save food item in MongoDB
        const foodItem = await foodModel.create({
            name: name.trim(),
            description: description || "",
            video: fileUploadResult.secure_url,
            foodPartner: req.foodPartner._id
        });

        return res.status(201).json({
            message: "Food item created successfully",
            food: foodItem
        });

    } catch (error) {
        console.error("Create Food Error:", error);

        return res.status(500).json({
            message: "Food creation failed",
            error: error.message
        });
    }
}


// ========================================
// 2. GET ALL FOOD ITEMS
// ========================================
async function getFoodItems(req, res) {
    try {
        const userId = req.user._id;

        const [foods, likes, saves] = await Promise.all([
            foodModel.find({})
                .populate("foodPartner", "name")
                .sort({ _id: -1 })
                .lean(),

            likeModel.find({ user: userId })
                .select("food")
                .lean(),

            saveModel.find({ user: userId })
                .select("food")
                .lean()
        ]);

        // Store liked and saved food IDs
        const likedIds = new Set(
            likes.map(item => String(item.food))
        );

        const savedIds = new Set(
            saves.map(item => String(item.food))
        );

        // Add user-specific status to each food
        const foodItems = foods.map(food => ({
            ...food,
            isLiked: likedIds.has(String(food._id)),
            isSaved: savedIds.has(String(food._id))
        }));

        return res.status(200).json({
            message: "Food Items fetched successfully",
            foodItems
        });

    } catch (error) {
        console.error("Get Food Error:", error);

        return res.status(500).json({
            message: "Unable to fetch food items",
            error: error.message
        });
    }
}


// ========================================
// 3. LIKE / UNLIKE FOOD
// ========================================
async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        if (!foodId || !mongoose.isValidObjectId(foodId)) {
            return res.status(400).json({
                message: "Valid Food ID is required"
            });
        }

        const food = await foodModel.findById(foodId);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        const existingLike = await likeModel.findOne({
            user: userId,
            food: foodId
        });

        // If already liked, unlike it
        if (existingLike) {
            await likeModel.deleteOne({
                _id: existingLike._id
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            });

            return res.status(200).json({
                message: "Food unliked successfully",
                isLiked: false
            });
        }

        // Otherwise, create a new like
        await likeModel.create({
            user: userId,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        });

        return res.status(201).json({
            message: "Food liked successfully",
            isLiked: true
        });

    } catch (error) {
        console.error("Like Food Error:", error);

        return res.status(500).json({
            message: "Like operation failed",
            error: error.message
        });
    }
}


// ========================================
// 4. SAVE / UNSAVE FOOD
// ========================================
async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const userId = req.user._id;

        if (!foodId || !mongoose.isValidObjectId(foodId)) {
            return res.status(400).json({
                message: "Valid Food ID is required"
            });
        }

        const food = await foodModel.findById(foodId);

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        const existingSave = await saveModel.findOne({
            user: userId,
            food: foodId
        });

        // If already saved, remove from saved list
        if (existingSave) {
            await saveModel.deleteOne({
                _id: existingSave._id
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { saveCount: -1 }
            });

            return res.status(200).json({
                message: "Food unsaved successfully",
                isSaved: false
            });
        }

        // Otherwise, save the food
        await saveModel.create({
            user: userId,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: 1 }
        });

        return res.status(201).json({
            message: "Food saved successfully",
            isSaved: true
        });

    } catch (error) {
        console.error("Save Food Error:", error);

        return res.status(500).json({
            message: "Save operation failed",
            error: error.message
        });
    }
}


// ========================================
// 5. GET USER'S SAVED FOOD ITEMS
// ========================================
async function getSavedFoodItems(req, res) {
    try {
        const userId = req.user._id;

        const savedItems = await saveModel
            .find({ user: userId })
            .populate({
                path: "food",
                populate: {
                    path: "foodPartner",
                    select: "name"
                }
            })
            .sort({ createdAt: -1 });

        const savedFoods = savedItems
            .filter(item => item.food)
            .map(item => ({
                ...item.food.toObject(),
                isSaved: true
            }));

        return res.status(200).json({
            message: "Saved food items fetched successfully",
            savedFoods
        });

    } catch (error) {
        console.error("Get Saved Food Error:", error);

        return res.status(500).json({
            message: "Unable to fetch saved food items",
            error: error.message
        });
    }
}


// ========================================
// EXPORT ALL FUNCTIONS
// ========================================
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoodItems
};
