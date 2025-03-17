const mongoose = require("mongoose");
const Coupon = require("./models/Coupon");

require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log(" Connected to MongoDB");

    await Coupon.deleteMany({}); // Clear existing coupons
    const sampleCoupons = [
      { code: "COUPON1", status: "Available" },
      { code: "COUPON2", status: "Available" },
      { code: "COUPON3", status: "Available" },
      { code: "COUPON4", status: "Available" },
      { code: "COUPON5", status: "Available" },
      { code: "COUPON6", status: "Available" },
      { code: "COUPON7", status: "Available" },
      { code: "COUPON8", status: "Available" },
      { code: "COUPON9", status: "Available" },
    ];
    await Coupon.insertMany(sampleCoupons);
    console.log(" Database seeded successfully");
  } catch (error) {
    console.error(" Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log(" Database connection closed");
  }
};

seedDatabase();
