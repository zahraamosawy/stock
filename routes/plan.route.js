const express = require("express");
const router = express.Router();
const { getPlans, getPlanById, purchase ,getPlanStockSummary} = require("../controllers/planController");
const clientAuth = require("../middleware/clientAuth");

router.get("/", async (req, res) => {
  try {
    const results = await getPlans();
    res.send(results);
    console.log(results);
  } catch (error) {
        console.error("GET /plans ERROR:", error);
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    console.log(planId);

    const results = await getPlanById(planId);
    res.send(results);
  } catch (error) {
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});

router.post("/purchase", clientAuth, async (req, res) => {
  try {
    const clientId = parseInt(req.user.id);
    const planId = parseInt(req.body.planId);
    const results = await purchase(planId, clientId);
    if (!results.success) {
      return res.status(501).send({ message: results.message });
    }
    res.send(results);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "اكو مشكله بالدنيا..." });
  }
});
// 5️⃣ GET /plans/:id/stock
router.get("/:id/stock",getPlanStockSummary);

module.exports = router;
