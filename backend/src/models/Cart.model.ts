import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const cartSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<ICartItem>("CartItem", cartSchema);
