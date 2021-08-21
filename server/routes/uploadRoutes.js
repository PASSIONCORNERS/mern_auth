const route = require("express").Router();
const upload = require("../middlewares/upload");
const uploadImage = require("../middlewares/uploadImage");
const uploadController = require("../controllers/uploadController");
const auth = require("../middlewares/auth");

route.post(
  "/api/upload",
  uploadImage,
  upload,
  auth,
  uploadController.uploadAvatar
);

module.exports = route;
