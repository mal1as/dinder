const express = require("express");
const bodyParser = require('body-parser');
const mainController = require("../controllers/mainController");
const mainRouter = express.Router();
const jsonParser = bodyParser.json();

mainRouter.get("/about", mainController.about);
mainRouter.get("/", mainController.mainPage);
mainRouter.get("/myProfile", mainController.myProfile);
mainRouter.get("/editProfile", mainController.editProfile);
mainRouter.post('/editProfile', jsonParser, mainController.updateProfile);
mainRouter.post('/uploadAvatar', mainController.uploadAvatar);

module.exports = mainRouter;