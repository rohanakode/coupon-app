const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./init/db");
const Coupon = require("./models/Coupon");
const abusePrevention = require("./utils/abusePrevention");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.ATLASDB_URL, 
      collectionName: "sessions",
    }),
    cookie: { secure: false, httpOnly: true, maxAge: 86400000 }, 
  })
);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/claim-coupon", abusePrevention);

app.get("/", (req, res) => {
  res.render("index");
});

app.set("trust proxy", true); // Trust proxy to get real IP

app.get("/claim-coupon", async (req, res) => {
  try {
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const nextCoupon = await Coupon.findOne({ status: "Available" }).sort({
      _id: 1,
    });
    if (!nextCoupon)
      return res.status(404).json({ message: "No coupons left" });

    nextCoupon.status = "Claimed";
    nextCoupon.claimedBy = clientIp; // Save the correct IP
    nextCoupon.claimedAt = new Date();
    await nextCoupon.save();

    res.json({ message: "Coupon claimed!", coupon: nextCoupon.code });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});