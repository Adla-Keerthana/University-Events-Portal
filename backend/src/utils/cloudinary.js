const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'event_images',
            resource_type: 'auto'
        });

        // Delete the file from local storage after upload
        fs.unlinkSync(file.path);

        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary }; 