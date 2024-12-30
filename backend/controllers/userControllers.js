const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { sendResetPasswordMail } = require("../middleware/emailService");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerUser = async (req, res) => {
  let { name, email, ID, password } = req.body;
  email = email.toLowerCase();
  // console.log(email);

  if (password.length < 6 || password.length > 20) {
    return res
      .status(400)
      .json({ message: "Password length must be at least of 6" });
  }

  try {
    const userExists = await User.findOne({ email });
    const userExistsId = await User.findOne({ ID });

    if (userExists) {
      return res.status(400).json({ message: "This Email is already used." });
    } else if (userExistsId) {
      return res.status(400).json({ message: "This ID is already used." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      ID,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not Exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status == null) {
      return res
        .status(403)
        .json({ message: "Wait for admin to assign you a Status." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("User Does not exist");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    // const { id } = req.params;
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User do not exist." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { name, email, ID, status, departmentId } = req.body;
  let profileImage = null;
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      profileImage = result.secure_url; // Use the URL of the uploaded image
      fs.unlinkSync(req.file.path);
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        ID,
        status,
        departmentId,
        profileImage: profileImage || req.body.profileImage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error Updating User Info.", error });
  }
};

const forgetPassword = async (req, res) => {
  const { email, ID } = req.body;
  // console.log(req.body);
  let user;
  try {
    user = await User.findOne({ email, ID });
    // console.log("Inside: ", user);
    if (!user) {
      return res.status(404).json({ message: "User do not exist." });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 3600000;
    // console.log("Moment of truth.");
    await user.save();
    // console.log("momentof truth 2");
    await sendResetPasswordMail(user.name, user.email, token);
    // console.log("Well successfull.");
    res.status(200).json({
      message: "Check you mail a password reset link has been sent.",
    });
  } catch (error) {
    if (user) {
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpires = null;
      await user.save();
    }
    res.status(500).json({ message: "Error sending mail" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  // console.log(req.params);
  // console.log("+++++++++++++++++++++++++++++");
  // console.log(req.body);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token expired you may try again." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password didn't match" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getUser,
  getAllUsers,
  deleteUser,
  updateUserInfo,
  forgetPassword,
  resetPassword,
};
