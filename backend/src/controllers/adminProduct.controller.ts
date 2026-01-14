import { Request, Response } from "express"
import { Product } from "../models/product.model"

/**
 * GET /admin/products
 */
const getAllProducts = async (req: Request, res: Response) => {
  try{
    const products = await Product.find()
    res.status(200).json(products)
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: "Failed to get all admin product."})
  }
}

/**
 * POST /admin/products
 */
const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
  const { name, price, category, description, imgUrl } = req.body
  try{
    const newProduct = await Product.create({ name, price, category, description, imgUrl })
    if(!newProduct){
      res.status(500).json({ message: "Unable to add product."})
      return
    }
    res.status(200).json(newProduct)
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add product.'})
  }
}

/**
 * PUT /admin/products/:id
 */
const updateProductById = async (req: Request<{ id: string }, Partial<Product>>, res: Response) => {
  const { name, price, category, description, imgUrl } = req.body
  try{
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, imgUrl },
      { new: true }
    )
    if(!updatedProduct){
      res.status(404).json({ message: "Product not found."})
      return
    }
    res.status(200).json(updatedProduct)
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: "Failed to update product."})
  }
}

/**
 * DELETE /admin/products:id
 */
const deleteProductById = async (req: Request<{ id: string }>, res: Response) => {
  try{
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if(!deletedProduct){
      res.status(404).json({ message: "Product not found."})
      return
    }
    res.status(200).json(deletedProduct)
  } catch(err){
    console.error(err)
    res.status(500).json({ message: "Failed to delete product."})
  }
}

export default {
  getAllProducts,
  addProduct,
  updateProductById,
  deleteProductById
}