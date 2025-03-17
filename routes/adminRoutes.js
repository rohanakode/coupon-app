const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (for simplicity)
  if (username === "admin" && password === "admin123") {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

router.get("/dashboard", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin/login");
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Coupon.countDocuments({});
    const totalPages = Math.ceil(total / limit);

    const coupons = await Coupon.find({}).skip(skip).limit(limit);

    res.render("admin/dashboard", {
      coupons,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).send("Error fetching coupons");
  }
});

router.post("/add-coupon", (req, res) => {
  const { code } = req.body;

  const newCoupon = new Coupon({ code });
  newCoupon
    .save()
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((error) => {
      res.status(500).send("Error adding coupon");
    });
});

router.post("/toggle-coupon/:id", (req, res) => {
  const { id } = req.params;

  Coupon.findById(id)
    .then((coupon) => {
      if (!coupon) return res.status(404).send("Coupon not found");

      coupon.status = coupon.status === "Available" ? "Claimed" : "Available";
      return coupon.save();
    })
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch((error) => {
      res.status(500).send("Error toggling coupon");
    });
});

router.post("/delete-coupon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).send("Error deleting coupon");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
