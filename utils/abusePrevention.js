const abusePrevention = (req, res, next) => {
  const userIP = req.ip;
  const sessionID = req.session.id;

  if (req.session.claimedCoupon) {
    return res.status(403).json({
      message:
        "You have already claimed a coupon. Please wait before claiming again.",
    });
  }

  req.session.claimedCoupon = true;

  next();
};

module.exports = abusePrevention;
