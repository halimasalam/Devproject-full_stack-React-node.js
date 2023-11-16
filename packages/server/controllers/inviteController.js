const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const { createUser } = require("./usersController");

const inviteFriend = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Please provide name and email" });
  }

  const user = await User.findOne({ email }).lean();

  if (user) {
    return res
      .status(400)
      .json({ message: "User with the given email already exists" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const password = generator.generate({
    length: 10,
    numbers: true
  });
  const newReq = { ...req };
  newReq.body.password = password;
  newReq.isInvite = true;

  createUser(newReq, res);

  const sender = await User.findById(req.userId).lean();
  const info = await transporter.sendMail({
    from: sender.email,
    to: email,
    subject: "Calorie App Invitation",
    text: `You have been invited to Calorie Tracker App by ${sender.name}. Please use the following credentials to login, email: ${email} and password: ${password}`,
    html: `<p>You have been invited to Calorie Tracker App by ${sender.name}.<br>Please use the following credentials to login, email: ${email} and password: ${password}</p>`
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    message: "Invite sent successfully"
  });
});

module.exports = { inviteFriend };
