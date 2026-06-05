const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return res.status(400).json({
    message: "All fields are required"
  });
}

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(201).json({
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({
    message: "All fields are required"
  });
}
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getProfile = async (req, res) => {

  res.status(200).json({
    message: "Protected Route Accessed",
    user: req.user
  });

};
module.exports = {
  registerUser,loginUser,getProfile
};