const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Available", "Claimed"],
    default: "Available",
  },
  claimedBy: { type: String, default: null }, // IP or session ID
  claimedAt: { type: Date, default: null },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
