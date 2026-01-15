import { Router } from "express";
import CartItem from "../models/Cart.model";
import Product from "../models/Product.model";

const router = Router();

/**
 * GET /api/cart
 * - 장바구니 전체 조회 (product populate)
 */
router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find().populate("productId");
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

/**
 * POST /api/cart/add
 * body: { productId: string, quantity?: number }
 * - 이미 있으면 quantity 증가, 없으면 새로 생성
 */
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body as {
      productId?: string;
      quantity?: number;
    };

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    // product 존재 확인(안전)
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = Math.max(1, Number(quantity ?? 1));

    const existing = await CartItem.findOne({ productId });
    if (existing) {
      existing.quantity += qty;
      await existing.save();
      return res.status(200).json(existing);
    }

    const created = await CartItem.create({ productId, quantity: qty });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

/**
 * PATCH /api/cart/:id
 * body: { quantity: number }
 */
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body as { quantity?: number };
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: "quantity must be >= 1" });
    }

    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity: qty },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

/**
 * DELETE /api/cart/:id
 * - 아이템 1개 삭제
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Deleted", id: req.params.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
});

/**
 * DELETE /api/cart
 * - 장바구니 전체 비우기(개발 편의)
 */
router.delete("/", async (req, res) => {
  try {
    const result = await CartItem.deleteMany({});
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;
