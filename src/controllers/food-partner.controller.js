// const foodPartnerModel=require('../models/foodpartner.model')
// const foodModel=require('../models/food.model')

// async function getFoodPartnerById(req,res){
//     const foodPartnerId=req.params.id;
//     const foodPartner=await foodPartnerModel.findById(foodPartnerId)
//     const foodItemsByFoodPartner=await foodModel.find({foodPartner:foodPartnerId})

//     if(!foodPartner){
//         return res.status(404).json({
//             message:"Food partner not found"
//         })
//     }
//     res.status(200).json({
//         message:"Food Partner retreived successfully",
//         foodPartner:{
//             ...foodPartner.toObject(),foodItems:foodItemsByFoodPartner
//         }
        
//     })
// }
// module.exports={
//     getFoodPartnerById
// }


const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;

        const foodPartner = await foodPartnerModel.findById(foodPartnerId);

        if (!foodPartner) {
            return res.status(404).json({
                message: "Food partner not found"
            });
        }

        const foodItems = await foodModel.find({
            foodPartner: foodPartner._id
        });

console.log("Food Partner ID:", foodPartner._id);
console.log("Total videos:", foodItems.length);

foodItems.forEach((item) => {
    console.log("Video:", item.name);
    console.log("Saved Partner ID:", item.foodPartner);
});

        return res.status(200).json({
            message: "Food Partner retrieved successfully",
            foodPartner,
            foodItems,
            totalMeals: foodItems.length
        });

    } catch (error) {
        console.log("Profile API error:", error);

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

module.exports = {
    getFoodPartnerById
};
