const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const uploadController = {
  uploadAvar: async (req, res) => {
    try {
      // get file
      const file = req.file;

      // upload to cloudinary
      cloudinary.v2.uploader.upload(
        file.path,
        {
          folder: "avatar",
          width: 150,
          height: 150,
          crop: "fill",
        },
        (err, result) => {
          if (err) throw err;
          fs.unlinkSync(file.path);
          res.status(200).json({
            msg: "Uploaded successfully.",
            url: result.secure_url,
          });
        }
      );
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = uploadController;
