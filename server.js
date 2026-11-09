//start server
// require('dotenv').config();
// const app=require('./src/app')
// const connectDB=require('./src/db/db')
// connectDB()
// app.listen(3000,()=>{
//     console.log("Server is running on port 3000")
// })

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        })
        .catch((err) => {
            console.error("Database connection failed:", err);
        });
} else {
    module.exports = async (req, res) => {
        try {
            await connectDB();
            return app(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Database connection failed"
            });
        }
    };
}