import { Router } from "express";
import CartItem from "../models/Cart.model";

const router = Router();

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find().populate("product");
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const item = new CartItem({ product: productId, quantity });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
