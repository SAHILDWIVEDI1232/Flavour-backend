// const express=require('express');
// const foodController=require("../controllers/food.controller")
// const authMiddleware=require("../middlewares/auth.middleware")
// const router=express.Router();
// const multer=require('multer')

// const upload=multer({
//     storage:multer.memoryStorage(),
// })

// /*POST /api/food/ [protected] */
// router.post('/',authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodController.createFood)
// /*GET /api/food/[protected]*/
// router.get("/",
//     authMiddleware.authUserMiddleware,
//     foodController.getFoodItems
// )

 




const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

// Create food (Food Partner login required)
router.post(
    "/",
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood
);

// Get saved food (User login required)
router.get(
    "/saved",
    authMiddleware.authUserMiddleware,
    foodController.getSavedFoodItems
);

// Get all food videos (User login required)
router.get(
    "/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems
);

// Like / Unlike
router.post(
    "/like",
    authMiddleware.authUserMiddleware,
    foodController.likeFood
);

// Save / Unsave
router.post(
    "/save",
    authMiddleware.authUserMiddleware,
    foodController.saveFood
);

module.exports = router;
