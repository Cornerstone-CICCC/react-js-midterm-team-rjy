import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const productSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
});

export default mongoose.model("Product", productSchema);
