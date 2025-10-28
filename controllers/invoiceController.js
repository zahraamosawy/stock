const db = require("../db");

// 7️⃣ GET /invoice/client/:id
exports.getClientInvoices = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT id AS "invoiceId", client_id AS "clientId", amount, created_at AS "date"
      FROM invoice
      WHERE client_id = $1
      ORDER BY created_at DESC
      LIMIT 50;
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error("GET /invoice/client/:id ERROR:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الفواتير" });
  }
};
