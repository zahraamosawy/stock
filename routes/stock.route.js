
// 2️⃣ GET /stock/available
//    ➤ Purpose: Return the number of “ready” cards for each plan.
//    ➤ Response Example:
//        [
//          { planId: 1, planName: "Zain 5K", available: 25 },
//          { planId: 2, planName: "Google Play 10$", available: 10 }
//        ]

// 3️⃣ GET /stock/sold
//    ➤ Purpose: Count sold cards for each plan.
//
// routes/stock.route.js
const express = require("express");
const router = express.Router();
const { getStock, getAvailableStocks,getAvailableStocksByPlan ,getStocskSold ,addStockBatch} = require("../controllers/stockController");
const db = require("../db");



router.get("/", async (req, res) => {
  try {
    const results = await getStock();
    res.json(results);
  } catch (error) {
    console.error("GET /stock ERROR:", error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.get("/available", async (req, res) => {
  try {

    const results = await getAvailableStocks();
    res.json(results);
  } catch (error) {
    console.error("GET /stock/available ERROR:", error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.get("/:id/available", async (req, res) => {
  try {
    const planId = req.params.id; 
    const results = await getAvailableStocksByPlan(planId);
    res.json(results);
  } catch (error) {
    console.error("GET /stock/:id/available ERROR:", error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});



router.get("/sold", async (req, res) => {
  try {

    const results = await getStocskSold();
    res.json(results);
  } catch (error) {
    console.error("GET /stock/sold ERROR:", error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.post("/batch", addStockBatch);




module.exports = router;

