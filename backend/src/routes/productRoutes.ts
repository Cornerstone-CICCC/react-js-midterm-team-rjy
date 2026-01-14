import { Router } from "express";
import Product from "../models/Product.model";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body
    const newProduct = new Product({ name, price, imageUrl })
    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
});

export default router;
