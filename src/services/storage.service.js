const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File Function
async function uploadFile(file, fileName) {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            {
                public_id: fileName,
                folder: "food-items",
                resource_type: "auto",
            }
        );

        return result;

    } catch (error) {
        console.log("Cloudinary Upload Error:", error);
        throw error;
    }
}

module.exports = {
    cloudinary,
    uploadFile,
};