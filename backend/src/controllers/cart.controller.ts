import { Request, Response } from "express";
import CartItem from "../models/Cart.model";
import Product from "../models/product.model";

export const getCart = async (req: Request, res: Response) => {
  try {
    const items = await CartItem.find().populate("productId");
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: "Product not found" });

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
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;
    const updated = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update" });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete" });
  }
};