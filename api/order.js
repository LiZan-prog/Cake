import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, cake, quantity } = req.body;

    // Read existing orders (for local testing)
    const filePath = path.join(process.cwd(), "data/orders.json");
    let orders = [];
    try {
      orders = JSON.parse(fs.readFileSync(filePath));
    } catch {}

    orders.push({ name, cake, quantity });
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    res.status(200).json({ message: `Thanks ${name}, your order for ${quantity} ${cake}(s) is received!` });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}