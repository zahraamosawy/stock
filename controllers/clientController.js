// clientController.js

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (body) => {
  const phone = body.phone;
  const password = body.password;
  const name = body.name;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(`INSERT INTO Client (name, phone, password)
                VALUES
                ('${name}', '${phone}', '${hashedPassword}');`);

  if (result.rowCount === 1) {
    return true;
  } else {
    return false;
  }
};

const login = async (phone, password) => {
  const result = await db.query(`select * from client where phone = '${phone}'`);
  if (result.rowCount !== 1) {
    return { success: false, message: "user not found!" };
  }

  const user = result.rows[0];
  const hashedPassword = user.password;
  const isPassValid = await bcrypt.compare(password, hashedPassword);
  if (!isPassValid) {
    return { success: false, message: "لاتصير لوتي" };
  }

  const token = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      name: user.name,
    },
    process.env.SECRET_KEY
  );

  
  return { success: true, token: token };
};

// 1️⃣ GET /client/:id/balance
//    ➤ Purpose: Return the balance of a specific client.
//    ➤ Response: { id, name, balance }
//

const getClientByID = async (client_id) => {
  const result = await db.query(
    `SELECT id, name, balance FROM client WHERE id = ${client_id}`);
  return result.rows[0];
};


// 6️⃣ POST /client/:id/topup
const topUpBalance = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  console.log(id);

  if (!amount || amount <= 0) return res.status(400).json({ message: "قيمة الشحن غير صالحة" });

  try {
    const { rows } = await db.query("SELECT balance FROM client WHERE id = $1", [id]);
    if (!rows.length) return res.status(404).json({ message: "العميل غير موجود" });

    const oldBalance = rows[0].balance;
    const newBalance = oldBalance + amount;

    await db.query("UPDATE client SET balance = $1 WHERE id = $2", [newBalance, id]);
    res.json({ id, oldBalance, newBalance });
  } catch (error) {
    console.error("POST /client/:id/topup ERROR:", error);
    res.status(500).json({ message: "حدث خطأ أثناء الشحن" });
  }
};


module.exports = {
  register,
  login,
  getClientByID,
  topUpBalance
};
