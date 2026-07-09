import type { NextFunction, Request, Response } from "express";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { ApiError } from "../middleware/errorHandler";
import { Order } from "../models/Order.model";
import { Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { createNotification } from "../services/notification.service";

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const product = await Product.findById(req.body.product);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.seller.toString() === req.user.id) {
      throw new ApiError(400, "You can't buy your own product");
    }

    const quantity = req.body.quantity ?? 1;
    const order = await Order.create({
      buyer: req.user.id,
      seller: product.seller,
      product: product._id,
      productSnapshot: { title: product.title, price: product.price, image: product.images[0] },
      quantity,
      total: Math.round(product.price * quantity * 100) / 100,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "cod",
      paymentProofUrl: req.body.paymentProofUrl,
    });

    const buyer = await User.findById(req.user.id).select("name");
    await createNotification({
      recipient: product.seller.toString(),
      type: "order",
      title: "New order",
      body: `${buyer?.name ?? "A buyer"} ordered "${product.title}"`,
      targetUrl: "/dashboard/orders",
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const orders = await Order.find({ $or: [{ buyer: req.user.id }, { seller: req.user.id }] })
      .sort({ createdAt: -1 })
      .populate("product", "title slug images")
      .populate("buyer", "name username avatarUrl")
      .populate("seller", "name username avatarUrl");

    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

/** Powers the product page's "did I buy this?" check for Buy Now / Write a Review gating. */
export async function getMyOrderForProduct(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const product = await Product.findOne({ slug: req.query.product as string });
    if (!product) {
      res.json({ order: null });
      return;
    }

    const order = await Order.findOne({
      buyer: req.user.id,
      product: product._id,
      status: { $nin: ["cancelled", "refunded"] },
    }).sort({ createdAt: -1 });

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    const isSeller = order.seller.toString() === req.user.id;
    const isBuyer = order.buyer.toString() === req.user.id;
    const { status } = req.body;

    if (status === "cancelled") {
      if (!isSeller && !isBuyer) throw new ApiError(403, "You're not part of this order");
    } else if (!isSeller) {
      throw new ApiError(403, "Only the seller can update this order's status");
    }

    order.status = status;
    await order.save();

    if (isSeller) {
      await createNotification({
        recipient: order.buyer.toString(),
        type: "order",
        title: "Order update",
        body: `Your order for "${order.productSnapshot.title}" is now ${status}`,
        targetUrl: "/dashboard/orders",
      });
    } else if (isBuyer && status === "cancelled") {
      await createNotification({
        recipient: order.seller.toString(),
        type: "order",
        title: "Order cancelled",
        body: `The order for "${order.productSnapshot.title}" was cancelled by the buyer`,
        targetUrl: "/dashboard/orders",
      });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

export async function getOrderInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("seller", "name email");
    if (!order) throw new ApiError(404, "Order not found");

    const buyer = order.buyer as unknown as { _id: unknown; name: string; email: string };
    const seller = order.seller as unknown as { _id: unknown; name: string; email: string };
    const isSeller = seller._id?.toString() === req.user.id;
    const isBuyer = buyer._id?.toString() === req.user.id;
    if (!isSeller && !isBuyer) throw new ApiError(403, "You're not part of this order");

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const draw = (text: string, x: number, y: number, size = 11, useBold = false) =>
      page.drawText(text, { x, y, size, font: useBold ? bold : font, color: rgb(0.12, 0.12, 0.12) });

    draw("Nexora", 50, 792, 22, true);
    draw("Invoice", 50, 764, 14, true);
    draw(`Order #${order._id}`, 50, 744);
    draw(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 727);

    draw("Buyer", 50, 694, 11, true);
    draw(`${buyer.name} (${buyer.email})`, 50, 677);
    draw("Seller", 50, 649, 11, true);
    draw(`${seller.name} (${seller.email})`, 50, 632);

    draw("Item", 50, 590, 11, true);
    draw("Qty", 350, 590, 11, true);
    draw("Total", 450, 590, 11, true);
    draw(order.productSnapshot.title, 50, 570);
    draw(String(order.quantity), 350, 570);
    draw(`$${order.total.toFixed(2)}`, 450, 570);

    draw(`Status: ${order.status}`, 50, 530, 11, true);

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
}
