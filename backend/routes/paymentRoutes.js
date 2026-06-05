const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateLink,
  callbackHandler,
  getPayments,
  getDashboardData
} = require("../controllers/paymentController");

router.post(
  "/generate-link",
  protect,
  generateLink
);

router.post(
  "/callback",
  callbackHandler
);

router.get(
  "/all",
  protect,
  getPayments
);

router.get(
  "/dashboard",
  protect,
  getDashboardData
);

module.exports = router;