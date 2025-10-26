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
// 🔹 تُرجع عدد البطاقات الجاهزة لخطة واحدة حسب id
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

module.exports = { getStock, getAvailableStocks,getAvailableStocksByPlan };
