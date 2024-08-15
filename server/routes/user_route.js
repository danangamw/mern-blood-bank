const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventory_model");
const mongoose = require("mongoose");
// register new user
router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }

    // check if userType matches
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // save user
    const user = new User(req.body);
    await user.save();

    return res.json({
      success: true,
      message: `${user.userType} successfully registered`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.jwt_secret,
      { expiresIn: "1d" }
    );

    return res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user
router.get("/getCurrentUser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId }).select(
      "-password"
    );

    return res.send({
      success: true,
      message: "User fetched",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// Get donar
router.get("/donars", authMiddleware, async (req, res) => {
  console.log("get all donars");
  try {
    const donars = await User.find({ userType: "donar" }).select("-password");

    return res.send({
      success: true,
      message: "Donar fetched",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique donars
router.get("/get-all-donars", authMiddleware, async (req, res) => {
  const organization = new mongoose.Types.ObjectId(req.body.userId);

  try {
    // get all unique donor ids from inventory
    const uniqueDonorIds = await Inventory.distinct("donar", {
      organization,
    });

    const donars = await User.find({
      _id: { $in: uniqueDonorIds },
    }).select("-password");

    return res.send({
      success: true,
      message: "Donors fetch success",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  const organization = new mongoose.Types.ObjectId(req.body.userId);

  try {
    // get all unique donor ids from inventory
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });

    const hospitals = await User.find({
      _id: { $in: uniqueHospitalIds },
    }).select("-password");

    return res.send({
      success: true,
      message: "hospitals fetch success",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique organizations for a donar
router.get("/get-all-organizations-donar", authMiddleware, async (req, res) => {
  const donar = new mongoose.Types.ObjectId(req.body.userId);

  try {
    // get all unique donor ids from inventory
    const uniqueOrganizationIds = await Inventory.distinct("organization", {
      donar,
    });

    const organizations = await User.find({
      _id: { $in: uniqueOrganizationIds },
    }).select("-password");

    return res.send({
      success: true,
      message: "organization fetch success",
      data: organizations,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique organizations for a hospital
router.get(
  "/get-all-organizations-hospital",
  authMiddleware,
  async (req, res) => {
    const hospital = new mongoose.Types.ObjectId(req.body.userId);

    try {
      // get all unique donor ids from inventory
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        hospital,
      });

      const organizations = await User.find({
        _id: { $in: uniqueOrganizationIds },
      }).select("-password");

      return res.send({
        success: true,
        message: "organization fetch success",
        data: organizations,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
