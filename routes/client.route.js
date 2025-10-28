//client.router.js
const express = require("express");
const router = express.Router();
const { register, login , getClientByID ,topUpBalance} = require("../controllers/clientController");
const clientAuth = require("../middleware/clientAuth");




router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const isSaved = await register(body);
    if (!isSaved) {
      return res.status(501).send({ message: "اكو مشكله بالدنيا..." });
    }
    res.send({ message: "Register succefully." });
  } catch (error) {
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const result = await login(body.phone, body.password);
    if (!result.success) {
      return res.status(501).send({ message: result.message });
    }
    res.send({ token: result.token });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});


// 1️⃣ GET /client/:id/balance
//    ➤ Purpose: Return the balance of a specific client.
//    ➤ Response: { id, name, balance }
//

router.get("/:id/balance",clientAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getClientByID(id);
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: "You are not allowed to view another client's balance." });
    }

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({
      id: client.id,
      name: client.name,
      balance: client.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// 6️⃣ POST /client/:id/topup
router.post("/:id/topup", topUpBalance);




module.exports = router;
