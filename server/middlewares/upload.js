const fs = require("fs");

module.exports = (req, res, next) => {
  // file undefined
  if (typeof req.file === "undefined" || typeof req.body === "undefined")
    return res.status(400).json({ msg: "Issue with uploading image." });

  // app use express static
  let image = req.file.path;

  // file type
  if (
    !req.file.mimetype.includes("jpeg") &&
    !req.file.mimetype.includes("jpg") &&
    !req.file.mimetype.includes("png")
  ) {
    // remove the file
    fs.unlinkSync(image);
    return res.status(400).json({ msg: "This file is not supported." });
  }
  // file size
  if (req.file.size > 1024 * 1024) {
    //1024000
    fs.unlinkSync(image);
    return res.status(400).json({
      msg: "This file size is too large (Max: 1MB).",
    });
  }
  next();
};
