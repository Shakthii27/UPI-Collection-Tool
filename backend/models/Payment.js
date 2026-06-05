const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },

    reference_id: {
      type: String,
      required: true,
      unique: true
    },

    note: {
      type: String
    },

    payment_link: {
      type: String
    },

    status: {
      type: String,
      default: "pending"
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);