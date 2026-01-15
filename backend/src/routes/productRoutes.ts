import { Router } from "express";
import Product from "../models/Product.model";

const router = Router();

/* =======================
   GET all products
======================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* =======================
   GET product by id
======================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/* =======================
   POST product (Admin test)
======================= */
router.post("/", async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body;

    const newProduct = new Product({
      name,
      price,
      imageUrl,
      description,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

export default router;
