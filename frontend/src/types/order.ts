export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";

interface OrderPartyRef {
  _id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Order {
  _id: string;
  buyer: OrderPartyRef | string;
  seller: OrderPartyRef | string;
  product: { _id: string; title: string; slug: string; images: string[] } | string;
  productSnapshot: { title: string; price: number; image?: string };
  quantity: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
}
