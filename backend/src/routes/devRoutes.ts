import { Router } from "express";
import Product from "../models/Product.model";
import { seedProductsForce } from "../seed/productsSeed";

const router = Router();

// ✅ 개발 환경에서만 허용
router.use((req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ message: "Dev routes are disabled" });
  }
  next();
});

/**
 * DELETE /api/dev/products
 * - products 전체 삭제
 */
router.delete("/products", async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete products" });
  }
});

/**
 * POST /api/dev/seed-products
 * - products 전체 삭제 후 seed 3개 다시 넣기
 */
router.post("/seed-products", async (req, res) => {
  try {
    await seedProductsForce();
    const products = await Product.find();
    res.status(201).json({ count: products.length, products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to seed products" });
  }
});

export default router;
