// multer-storage-cloudinary is a tool working with multer and cloudinary to make it a pretty smooth process overall, to upload files that multer is parsing to cloudinary. it is a middleware that we can use in our express application to upload files to cloudinary.
// it also works once we get the url back from cloudinary, multer adds in so that we have access to them in our routes handling callback.    it will store that url in our database.
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

// Config
dotenv.config();

//configure cloudinary to use our cloudinary account which we have set up in the .env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'RenewMart',// the folder in cloudinary where the images will be stored
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}