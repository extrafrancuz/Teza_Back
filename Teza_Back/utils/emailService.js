const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

const sendOTP = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.AUTH_EMAIL,
    to,
    subject: "Codul tău OTP",
    text: `Codul tău este: ${otp}`,
  });
};

module.exports = { sendOTP };
