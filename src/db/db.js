// const mongoose =require('mongoose')

// function connectDB(){
//     mongoose.connect(process.env.MONGODB_URI)
//     .then(()=>{
//         console.log("MongoDB connected");
//     })
//     .catch((err)=>{
//         console.log("MongoDB connection error:",err)
//     })
// }
// module.exports=connectDB

const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected");
            console.log("Database Name:", mongoose.connection.name);
            console.log(
                "Food Partner Collection:",
                mongoose.connection.collection("foodpartners").collectionName
            );
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        });
}

module.exports = connectDB;