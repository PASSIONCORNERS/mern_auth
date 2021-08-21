const cloudinary = require("cloudinary");
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const uploadController = {
  uploadAvatar: (req, res) => {
    try {
      const file = req.file;

      cloudinary.v2.uploader.upload(
        file.path,
        {
          folder: "avatar",
          width: 150,
          height: 150,
          crop: "fill",
        },
        async (err, result) => {
          if (err) throw err;
          fs.unlinkSync(file.path);
          // console.log(result);
          res.status(200).json({
            msg: "Uploaded successfully!",
            url: result.secure_url,
            // bytes: result.bytes,
          });
        }
      );
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = uploadController;
