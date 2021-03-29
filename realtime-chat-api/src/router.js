const express = require("express");
const router = express.Router();
const middleware = require("./middleware/users");

const userAPI = require("./api/users");
const roomAPI = require("./api/rooms");
const utility = require("./api/utility");

router.post("/test", utility.test);

router.post("/login", userAPI.login);
router.post("/logout", userAPI.logout);

// router.use("/user", middleware.checkAccessJWT);
router.post("/user/create", userAPI.createUser);
router.post("/user/send-activate", userAPI.sendActivationEmail);
router.get("/user/activate/:activateToken", userAPI.activateUse);
router.post("user/get-token", userAPI.getNewToken);

router.post("/room/create", roomAPI.createRoom);

module.exports = router;
