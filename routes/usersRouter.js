const express = require("express");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const usersController = require("../controllers/usersController");
const usersRouter = express.Router();

usersRouter.get("/register", usersController.registerPage);
usersRouter.post('/register', jsonParser, usersController.registerNewUser);
usersRouter.get("/auth", usersController.authPage);
usersRouter.post("/auth", jsonParser, usersController.authorizeUser);
usersRouter.get("/profiles/:userNickname", usersController.userProfile);

module.exports = usersRouter;