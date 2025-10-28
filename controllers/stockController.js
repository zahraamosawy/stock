//stockController.js


// 2️⃣ GET /stock/available
//    ➤ Purpose: Return the number of “ready” cards for each plan.
//    ➤ Response Example:
//        [
//          { planId: 1, planName: "Zain 5K", available: 25 },
//          { planId: 2, planName: "Google Play 10$", available: 10 }
//        ]
// controllers/stockController.js
const db = require("../db");

const getStock = async () => {
  const { rows } = await db.query("SELECT * FROM stock ORDER BY id ASC;");
  return rows;
};

const getAvailableStocks = async () => {
  const { rows } = await db.query(`
    SELECT
      plan.id AS "planId",
      plan.name AS "planName",
      COUNT(stock.id) AS "available"
    FROM plan
    LEFT JOIN stock ON stock.plan_id = plan.id AND stock.state = 'ready'
    GROUP BY plan.id, plan.name
    ORDER BY plan.id ASC;
  `);
  return rows;
};

 const getAvailableStocksByPlan = async (planId) => {
  const { rows } = await db.query(`
    SELECT
      plan.id AS "planId",
      plan.name AS "planName",
      COUNT(stock.id) AS "available"
    FROM plan
    LEFT JOIN stock ON stock.plan_id = plan.id AND stock.state = 'ready'
    WHERE plan.id = $1
    GROUP BY plan.id, plan.name;
  `, [planId]);
  
  return rows[0] || { planId, available: 0 };
 };

  const getStocksSold = async () => {
      const { rows } = await db.query(`
      SELECT
      plan.id AS "planId",
      plan.name AS "planName",
      COUNT(stock.id) AS "sold"
    FROM plan
    LEFT JOIN stock ON stock.plan_id = plan.id AND stock.state = 'sold'
    GROUP BY plan.id, plan.name
    ORDER BY plan.id;

 `);
  return rows;
};

// 8️⃣ POST /stock/batch
const addStockBatch = async (req, res) => {
  const { planId, codes } = req.body;

  if (!planId || !Array.isArray(codes) || !codes.length)
    return res.status(400).json({ message: "بيانات غير صحيحة" });

  const values = codes.map((code) => `(${planId}, '${code}', 'ready')`).join(",");
  try {
    await db.query(`INSERT INTO stock (plan_id, code, state) VALUES ${values}`);
    res.json({ inserted: codes.length });
  } catch (error) {
    console.error("POST /stock/batch ERROR:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الأكواد" });
  }
};

module.exports = { getStock, getAvailableStocks,getAvailableStocksByPlan ,getStocksSold,addStockBatch};
