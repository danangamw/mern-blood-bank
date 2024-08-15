const router = require("express").Router();
const Inventory = require("../models/inventory_model");
const User = require("../models/user_model");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

// add inventory
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // validate email and inventoryType
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Email not registered");

    if (req.body.inventoryType === "in" && user.userType !== "donar") {
      throw new Error("This email is not registered as donar");
    }

    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("This email is not registered as hospital");
    }

    if (req.body.inventoryType === "out") {
      // check if inventory is available
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);

      const totalInOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalIn = totalInOfRequestedGroup[0].total || 0;

      const totalOutOfRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);

      const totalOut = totalOutOfRequestedGroup[0]?.total || 0;

      const availableQuantityOfRequestGroup = totalIn - totalOut;

      if (availableQuantityOfRequestGroup < requestedQuantity) {
        throw new Error(
          `only ${availableQuantityOfRequestGroup} units of ${requestedBloodGroup.toUpperCase()} is available`
        );
      }

      req.body.hospital = user._id;
    } else {
      req.body.donar = user._id;
    }

    // add inventory
    const inventory = new Inventory(req.body);
    await inventory.save();

    return res.send({
      success: true,
      message: "Successfully added",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get inventory
router.get("/get", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({ organization: req.body.userId })
      .populate("donar", "-password")
      .populate("hospital");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
