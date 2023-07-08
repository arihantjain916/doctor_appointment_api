const router = require("express").Router();

const {isRegistered,registerUser,verifyOtp,resendOtp,userDetails} = require("../controllers/userController");
const {isLoggedIn} = require("../middlewares/user");

router.route("/is-registered").get(isRegistered);
router.route("/register").post(registerUser);
router.route("/verify-otp").get(verifyOtp);
router.route("/resend-otp").get(resendOtp);
router.route("/details").get(isLoggedIn,userDetails);




module.exports = router;