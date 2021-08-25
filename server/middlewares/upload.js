const fs = require("fs");

module.exports = (req, res, next) => {
  // check file exist
  if (typeof req.file === "undefined" || typeof req.body === "undefined")
    return res.status(400).json({ msg: "Issue with uploading this image." });

  // app use upload
  let image = req.file.path;

  // file type
  if (
    !req.file.mimetype.includes("jpeg") &&
    !req.file.mimetype.includes("jpg") &&
    !req.file.mimetype.includes("png")
  ) {
    // remove file
    fs.unlinkSync(image);
    return res.status(400).json({ msg: "This file is not supported." });
  }

  // file size
  if (req.file.size > 1024 * 1024) {
    // remove file
    fs.unlinkSync(image);
    return res.status(400).json({ msg: "This file is too large (Max: 1MB)" });
  }
  // success
  next();
};
