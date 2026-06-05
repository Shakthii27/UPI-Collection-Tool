const axios = require("axios");
const Payment = require("../models/Payment");

const generateLink = async (req, res) => {
  try {

    const { amount, note } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const reference_id = `REF_${Date.now()}`;

    let payment_link = null;

    try {

      const response = await axios.post(
        "https://api.bulkpe.in/client/checkOutRequest",
        {
          amount,
          reference_id,
          transcation_note: note
        },
        {
          headers: {
            Authorization:
              "Bearer aaWSVQNyt+z3IiJHV+YX9UheFbgRP7GEWsX/L4Rx1OLI1cBWmydMHppMpRXh2TtZDARWEd7aOvtCC9A0rkVPhdA=="
          }
        }
      );

      console.log("BULKPE RESPONSE:");
      console.log(response.data);

      if (response.data.status) {
        payment_link = response.data.payment_link;
      }

    } catch (bulkpeError) {

      console.log("BulkPe Error:");
      console.log(bulkpeError.response?.data);

    }

    const payment = await Payment.create({
      amount,
      reference_id,
      note,
      payment_link,
      status: "pending",
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const callbackHandler = async (req, res) => {
  try {

    const { reference_id, status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { reference_id },
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getPayments = async (req, res) => {
  try {

    const payments = await Payment.find({
  user: req.user.id
});

    res.status(200).json(payments);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch payments for this user, sorted by date (newest first)
    const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });

    const totalCollected = payments
      .filter((p) => p.status.toLowerCase() === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingCount = payments.filter((p) => p.status.toLowerCase() === "pending").length;

    const totalCount = payments.length;
    const successCount = payments.filter((p) => p.status.toLowerCase() === "success").length;
    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 100;

    const stats = {
      totalCollected,
      pendingCount,
      successRate,
      monthlyGrowth: totalCollected > 0 ? 12.5 : 0, // Mock growth rate
      urgentCount: payments.filter((p) => p.status.toLowerCase() === "pending" && (Date.now() - new Date(p.createdAt).getTime() > 24 * 60 * 60 * 1000)).length,
      pendingCallbacks: 0 // Mock callbacks count
    };

    // Format recent transactions
    const recentTransactions = payments.map((p) => ({
      id: p._id,
      customerName: p.note || `UPI Payee (${p.reference_id.slice(-6)})`,
      amount: p.amount,
      date: p.createdAt,
      status: p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase(),
    }));

    res.status(200).json({
      success: true,
      stats,
      recentTransactions,
      recentCallbacks: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateLink,
  callbackHandler,
  getPayments,
  getDashboardData
};