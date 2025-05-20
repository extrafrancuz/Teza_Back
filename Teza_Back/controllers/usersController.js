const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { sendOTP } = require("../utils/emailService");

dotenv.config();

const otpMap = new Map(); // email -> { otp, data, expires }
const otpResetMap = new Map();

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email deja folosit." });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedPassword = await bcrypt.hash(password, 10);
  otpMap.set(email, {
    otp,
    data: { username, email, password: hashedPassword },
    expires: Date.now() + 3 * 60 * 1000, // 3 minute
  });

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP trimis pe email." });
  } catch (err) {
    res.status(500).json({ message: "Eroare la trimiterea emailului." });
  }
};


exports.resend = async (req, res) => {
  const { email } = req.body;

  const record = otpMap.get(email);

  if (!record) {
    return res.status(400).json({ message: "Nu există o înregistrare pentru acest email. Încearcă să te înregistrezi din nou." });
  }

  if (Date.now() > record.expires) {
    otpMap.delete(email);
    return res.status(400).json({ message: "OTP-ul anterior a expirat. Te rugăm să te înregistrezi din nou." });
  }

  const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

  otpMap.set(email, {
    ...record,
    otp: newOtp,
    expires: Date.now() + 3 * 60 * 1000,
  });

  try {
    await sendOTP(email, newOtp);
    res.json({ message: "OTP retrimis pe email." });
  } catch (err) {
    res.status(500).json({ message: "Eroare la trimiterea emailului." });
  }
};



exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpMap.get(email);

  if (!record || record.otp !== otp) {
    return res.status(400).json({ message: "OTP invalid sau expirat." });
  }

  if (Date.now() > record.expires) {
    otpMap.delete(email);
    return res.status(400).json({ message: "OTP expirat." });
  }

  try {
    const user = new User(record.data);
    await user.save();
    otpMap.delete(email);
    res.json({ message: "Utilizator înregistrat cu succes!" });
  } catch (error) {
    res.status(500).json({ message: "Eroare la salvarea utilizatorului." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Credențiale invalide." });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET || "SECRET",
    { expiresIn: "1h" }
  );

  res.json({
    token,
    username: user.username,
    id: user._id,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Emailul nu a fost găsit." });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpResetMap.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minute
  });

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP trimis pe email." });
  } catch (err) {
    res.status(500).json({ message: "Eroare la trimiterea OTP-ului." });
  }
};

exports.verifyResetOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = otpResetMap.get(email);
  if (!record || record.otp !== otp) {
    return res.status(400).json({ message: "OTP invalid sau expirat." });
  }

  if (Date.now() > record.expires) {
    otpResetMap.delete(email);
    return res.status(400).json({ message: "OTP expirat." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Utilizator inexistent." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  otpResetMap.delete(email);
  res.json({ message: "Parola a fost resetată cu succes." });
};