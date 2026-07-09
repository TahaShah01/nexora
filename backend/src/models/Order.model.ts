import { Schema, model, models, type Document, type Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface IOrderProductSnapshot {
  title: string;
  price: number;
  image?: string;
}

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  product: Types.ObjectId;
  productSnapshot: IOrderProductSnapshot;
  quantity: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  paymentMethod?: "cod" | "online";
  paymentProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// One product per order (see IMPLEMENTATION_LOG.md Phase 6 — the SRS
// doesn't specify a multi-item cart, so this is "Buy Now" semantics: one
// order document per purchase click, not a cart checkout).
const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productSnapshot: {
      title: String,
      price: Number,
      image: String,
    },
    quantity: { type: Number, default: 1, min: 1 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    shippingAddress: { type: String, maxlength: 500 },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentProofUrl: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });

export const Order = models.Order || model<IOrder>("Order", orderSchema);
