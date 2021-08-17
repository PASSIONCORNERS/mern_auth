const { Router } = require("express");
const route = Router();
const userController = require("../controllers/userController");

route.post("/api/auth/register", userController.register);

module.exports = route;
