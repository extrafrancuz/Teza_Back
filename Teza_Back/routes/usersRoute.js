const express = require("express");
const router = express.Router();
const { register, verifyOTP, login, resend, forgotPassword,verifyResetOTP } = require("../controllers/usersController");

router.post("/auth/register", register);
router.post("/auth/verify-otp", verifyOTP);
router.post("/auth/login", login);
router.post("/auth/resend", resend);
router.post("/auth/forgot-password",forgotPassword);
router.post("/auth/verify-reset-otp", verifyResetOTP);
 


module.exports = router;
