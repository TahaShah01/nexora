import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import categoryRoutes from "./routes/category.routes";
import conversationRoutes from "./routes/conversation.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import notificationRoutes from "./routes/notification.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import serviceRoutes from "./routes/service.routes";
import serviceCategoryRoutes from "./routes/service-category.routes";
import uploadRoutes from "./routes/upload.routes";
import userRoutes from "./routes/user.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import adminRoutes from "./routes/admin.routes";
import feedRoutes from "./routes/feed.routes";
import searchRoutes from "./routes/search.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (env.nodeEnv !== "test") app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/search", searchRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
