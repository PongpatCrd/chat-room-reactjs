const express = require("express");
const router = express.Router();

const userAPI = require("./api/users");

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/login", userAPI.login);
router.post("/logout", userAPI.logout);

router.post("/user/create", userAPI.createUser);
router.post("/user/send-activate", userAPI.sendActivationEmail);
router.get("/user/activate/:activateToken", userAPI.activateUse);

module.exports = router;
