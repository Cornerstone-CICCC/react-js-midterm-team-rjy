import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "./Product.model";

export interface ICartItem extends Document {
  product: IProduct["_id"];
  quantity: number;
}

const CartItemSchema: Schema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
});

export default mongoose.model<ICartItem>("CartItem", CartItemSchema);
