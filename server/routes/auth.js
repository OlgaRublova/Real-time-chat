const express = require("express");
const {signup, login} = require("../controllers/auth")

//  calling router
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

//  exporting router
module.exports = router;