/**
 * Comprehensive seed script for the Nexora platform.
 *
 * Clears and re-populates ALL collections with realistic mock data:
 *   - 10 Buyers, 8 Sellers, 8 Service Providers, 2 Admins
 *   - Product & Service Categories (with subcategory support)
 *   - 20 Products (various categories, sellers, prices, conditions)
 *   - 20 Services (various providers, packages, delivery times)
 *   - Orders (pending, confirmed, shipped, delivered)
 *   - Bookings (pending, accepted, completed, cancelled)
 *   - Reviews (products, services, and users)
 *   - Wishlists, Follows, Conversations, Messages, Notifications
 *
 * Run with:  cd backend && npm run seed
 *
 * WARNING: This drops ALL existing data before seeding.
 *          Do NOT run against a production database.
 */
import mongoose, { Types } from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User.model";
import { Category } from "../models/Category.model";
import { ServiceCategory } from "../models/ServiceCategory.model";
import { Product } from "../models/Product.model";
import { Service } from "../models/Service.model";
import { Order } from "../models/Order.model";
import { Booking } from "../models/Booking.model";
import { Review } from "../models/Review.model";
import { Wishlist } from "../models/Wishlist.model";
import { Follow } from "../models/Follow.model";
import { Conversation } from "../models/Conversation.model";
import { Message } from "../models/Message.model";
import { Notification } from "../models/Notification.model";
import { hashPassword } from "../utils/password";
import { slugify } from "../utils/slug";
import { recomputeTrustScore } from "../utils/trustScore";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

const CITIES = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
  "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
  "Dallas, TX", "Austin, TX", "Miami, FL", "Seattle, WA",
];

const SKILLS_POOL = [
  "Communication", "Customer Service", "Product Photography", "Negotiation",
  "Logistics", "Inventory Management", "Quality Control", "Branding",
  "Social Media Marketing", "UI/UX Design", "Web Development", "Copywriting",
  "Video Editing", "Music Production", "Graphic Design", "SEO",
  "Content Strategy", "Email Marketing", "Data Analysis", "Project Management",
];

const REVIEW_COMMENTS_GOOD = [
  "Absolutely love this! Exceeded my expectations.",
  "Great quality and fast delivery. Highly recommend.",
  "Exactly as described. Very satisfied with the purchase.",
  "The seller was professional and responsive. 5 stars!",
  "Outstanding value for the price. Will buy again.",
  "Packaging was excellent, product arrived in perfect condition.",
  "Very happy with this purchase. The quality is top notch.",
  "Smooth transaction. Item is as advertised.",
];

const REVIEW_COMMENTS_MID = [
  "Good product, but shipping took longer than expected.",
  "Solid quality overall, minor packaging issue on arrival.",
  "Works well, but the description could be more detailed.",
  "Decent purchase, the seller was helpful when I had questions.",
  "Pretty good for the price. A few small imperfections.",
];

const REVIEW_COMMENTS_BAD = [
  "Not quite what I expected. The quality could be better.",
  "Took way too long to ship. Product is okay.",
  "Condition was not accurately described. Disappointed.",
];

// ---------------------------------------------------------------------------
// Static Data
// ---------------------------------------------------------------------------

const PRODUCT_CATEGORIES_DATA = [
  { name: "Electronics", icon: "Laptop" },
  { name: "Fashion", icon: "Shirt" },
  { name: "Home & Living", icon: "Home" },
  { name: "Beauty", icon: "Sparkles" },
  { name: "Sports", icon: "Dumbbell" },
  { name: "Automotive", icon: "Car" },
  { name: "Books", icon: "Book" },
  { name: "Toys & Games", icon: "Gamepad2" },
  { name: "Others", icon: "MoreHorizontal" },
];

const SERVICE_CATEGORIES_DATA = [
  { name: "Design & Creative", icon: "Palette" },
  { name: "Web Development", icon: "Code2" },
  { name: "Writing & Translation", icon: "PenLine" },
  { name: "Digital Marketing", icon: "Megaphone" },
  { name: "Video & Animation", icon: "Clapperboard" },
  { name: "Music & Audio", icon: "Music" },
  { name: "Programming & Tech", icon: "Terminal" },
  { name: "Business", icon: "Briefcase" },
  { name: "Lifestyle", icon: "Heart" },
  { name: "Other", icon: "MoreHorizontal" },
];

const PRODUCT_TEMPLATES = [
  { title: "Sony WH-1000XM5 Wireless Headphones", cat: "Electronics", price: 349.99, condition: "new", stock: 12 },
  { title: "Apple MacBook Air M2", cat: "Electronics", price: 1099.00, condition: "new", stock: 5 },
  { title: "Samsung 4K OLED TV 55\"", cat: "Electronics", price: 799.99, condition: "like_new", stock: 3 },
  { title: "Men's Leather Jacket – Brown", cat: "Fashion", price: 189.99, condition: "new", stock: 8 },
  { title: "Women's Floral Summer Dress", cat: "Fashion", price: 54.99, condition: "new", stock: 20 },
  { title: "Classic Oxford Shoes – Black", cat: "Fashion", price: 99.00, condition: "like_new", stock: 6 },
  { title: "Marble Coffee Table", cat: "Home & Living", price: 429.00, condition: "new", stock: 2 },
  { title: "Scented Soy Candle Set (6-pack)", cat: "Home & Living", price: 34.99, condition: "new", stock: 50 },
  { title: "Egyptian Cotton Bedsheet Set", cat: "Home & Living", price: 79.99, condition: "new", stock: 15 },
  { title: "La Mer Moisturizing Cream", cat: "Beauty", price: 195.00, condition: "new", stock: 10 },
  { title: "Dyson Airwrap Complete", cat: "Beauty", price: 499.00, condition: "like_new", stock: 4 },
  { title: "Professional Yoga Mat", cat: "Sports", price: 68.00, condition: "new", stock: 25 },
  { title: "Adjustable Dumbbell Set 5-52.5 lbs", cat: "Sports", price: 379.00, condition: "new", stock: 7 },
  { title: "Road Bike Carbon Frame 700c", cat: "Sports", price: 1250.00, condition: "used", stock: 1 },
  { title: "Car Dash Cam 4K – Front & Rear", cat: "Automotive", price: 129.99, condition: "new", stock: 18 },
  { title: "Leather Steering Wheel Cover", cat: "Automotive", price: 29.99, condition: "new", stock: 30 },
  { title: "Atomic Habits – James Clear", cat: "Books", price: 18.99, condition: "like_new", stock: 40 },
  { title: "Deep Work – Cal Newport", cat: "Books", price: 15.99, condition: "new", stock: 35 },
  { title: "LEGO Technic Bugatti Chiron Set", cat: "Toys & Games", price: 329.99, condition: "new", stock: 6 },
  { title: "Portable Bluetooth Speaker Waterproof", cat: "Electronics", price: 89.99, condition: "used", stock: 9 },
];

const SERVICE_TEMPLATES = [
  { title: "Professional Logo Design", cat: "Design & Creative", packages: [{ name: "Starter", price: 49, deliveryDays: 3, features: ["1 concept", "2 revisions", "PNG/SVG files"] }, { name: "Pro", price: 149, deliveryDays: 7, features: ["3 concepts", "Unlimited revisions", "Full brand kit"] }] },
  { title: "Brand Identity & Style Guide", cat: "Design & Creative", packages: [{ name: "Basic", price: 199, deliveryDays: 7, features: ["Logo", "Color palette", "Typography"] }, { name: "Premium", price: 499, deliveryDays: 14, features: ["Full brand system", "Business card", "Social media kit"] }] },
  { title: "Full-Stack Web Application", cat: "Web Development", packages: [{ name: "Landing Page", price: 299, deliveryDays: 5, features: ["1 page", "Mobile responsive", "Contact form"] }, { name: "Full App", price: 999, deliveryDays: 21, features: ["Multi-page", "Auth", "Database integration"] }] },
  { title: "E-commerce Store Setup", cat: "Web Development", packages: [{ name: "Starter", price: 399, deliveryDays: 10, features: ["Up to 50 products", "Payment gateway", "SEO setup"] }, { name: "Growth", price: 899, deliveryDays: 21, features: ["Unlimited products", "Custom theme", "Analytics"] }] },
  { title: "SEO Blog Articles (5-Pack)", cat: "Writing & Translation", packages: [{ name: "Standard", price: 79, deliveryDays: 5, features: ["5 x 800-word articles", "Keyword research"] }, { name: "Premium", price: 179, deliveryDays: 7, features: ["5 x 1500-word articles", "Internal linking", "Meta descriptions"] }] },
  { title: "English to Spanish Translation", cat: "Writing & Translation", packages: [{ name: "1000 words", price: 49, deliveryDays: 2, features: ["Native speaker", "Proofreading included"] }, { name: "5000 words", price: 199, deliveryDays: 7, features: ["Certified translator", "Industry-specific glossary"] }] },
  { title: "Instagram Growth Strategy", cat: "Digital Marketing", packages: [{ name: "Audit", price: 69, deliveryDays: 3, features: ["Profile review", "Competitor analysis", "Action plan"] }, { name: "Management", price: 299, deliveryDays: 30, features: ["Daily posting", "Engagement", "Monthly report"] }] },
  { title: "Google Ads Campaign Setup", cat: "Digital Marketing", packages: [{ name: "Setup", price: 149, deliveryDays: 5, features: ["Keyword research", "Ad copy", "Campaign config"] }, { name: "Management (30 days)", price: 399, deliveryDays: 30, features: ["Ongoing optimization", "Weekly reporting", "A/B testing"] }] },
  { title: "YouTube Video Editing", cat: "Video & Animation", packages: [{ name: "Basic", price: 59, deliveryDays: 3, features: ["Up to 10 min", "Color grading", "Background music"] }, { name: "Pro", price: 149, deliveryDays: 5, features: ["Up to 30 min", "Motion graphics", "Captions"] }] },
  { title: "2D Animated Explainer Video", cat: "Video & Animation", packages: [{ name: "30 seconds", price: 249, deliveryDays: 7, features: ["Script writing", "Voiceover", "Custom animation"] }, { name: "60 seconds", price: 449, deliveryDays: 14, features: ["Full production", "Music", "Storyboard"] }] },
  { title: "Custom Music Composition", cat: "Music & Audio", packages: [{ name: "Jingle (30s)", price: 99, deliveryDays: 5, features: ["Original composition", "MP3/WAV delivery"] }, { name: "Full Track (3 min)", price: 349, deliveryDays: 14, features: ["Full arrangement", "Mixing & mastering"] }] },
  { title: "Podcast Editing & Production", cat: "Music & Audio", packages: [{ name: "Per Episode", price: 49, deliveryDays: 2, features: ["Noise removal", "Level adjustment", "Intro/outro"] }, { name: "Monthly Package", price: 199, deliveryDays: 30, features: ["Up to 8 episodes", "Show notes", "Transcript"] }] },
  { title: "Python Automation Script", cat: "Programming & Tech", packages: [{ name: "Simple Script", price: 79, deliveryDays: 3, features: ["Data scraping or file processing", "Documentation"] }, { name: "Complex Automation", price: 299, deliveryDays: 10, features: ["Multi-step workflow", "Error handling", "Scheduled runs"] }] },
  { title: "Mobile App (React Native)", cat: "Programming & Tech", packages: [{ name: "MVP", price: 799, deliveryDays: 21, features: ["iOS & Android", "2 screens", "API integration"] }, { name: "Full App", price: 1999, deliveryDays: 45, features: ["Unlimited screens", "Auth", "Push notifications"] }] },
  { title: "Business Plan Writing", cat: "Business", packages: [{ name: "Lean Plan", price: 149, deliveryDays: 5, features: ["Executive summary", "Market analysis", "Financials overview"] }, { name: "Investor-Ready", price: 499, deliveryDays: 14, features: ["Full 30-page plan", "Financial projections", "Pitch deck"] }] },
  { title: "Virtual Assistant (20 hrs/month)", cat: "Business", packages: [{ name: "Basic", price: 199, deliveryDays: 30, features: ["Email management", "Scheduling", "Data entry"] }, { name: "Pro", price: 399, deliveryDays: 30, features: ["All basic tasks", "Research", "Social media management"] }] },
  { title: "Personal Fitness Coaching", cat: "Lifestyle", packages: [{ name: "Monthly Plan", price: 99, deliveryDays: 30, features: ["Custom workout plan", "Nutrition tips", "Weekly check-ins"] }, { name: "Transformation Package", price: 299, deliveryDays: 90, features: ["Personalized plan", "Daily coaching", "Progress tracking"] }] },
  { title: "Online Cooking Classes", cat: "Lifestyle", packages: [{ name: "Single Class", price: 29, deliveryDays: 1, features: ["1-hour live session", "Recipe card", "Q&A"] }, { name: "6-Class Series", price: 149, deliveryDays: 30, features: ["6 themed classes", "All recipes", "Private group access"] }] },
  { title: "Resume & LinkedIn Optimization", cat: "Business", packages: [{ name: "Resume Only", price: 79, deliveryDays: 3, features: ["ATS-optimized format", "Professional summary"] }, { name: "Full Package", price: 149, deliveryDays: 5, features: ["Resume + LinkedIn", "Cover letter template", "Interview tips"] }] },
  { title: "UI/UX Design for Web App", cat: "Design & Creative", packages: [{ name: "Wireframes", price: 199, deliveryDays: 5, features: ["User flows", "Low-fidelity wireframes", "Figma file"] }, { name: "Full Design", price: 599, deliveryDays: 14, features: ["High-fidelity mockups", "Design system", "Prototype"] }] },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("[seed] Connected to MongoDB");

  // ------------------------------------------------------------------
  // 1. Clear all collections
  // ------------------------------------------------------------------
  console.log("[seed] Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    ServiceCategory.deleteMany({}),
    Product.deleteMany({}),
    Service.deleteMany({}),
    Order.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Wishlist.deleteMany({}),
    Follow.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("[seed] All collections cleared");

  const passwordHash = await hashPassword("password123");
  const adminPasswordHash = await hashPassword("Admin@123");
  const defaultPasswordHash = await hashPassword("Password123");

  // ------------------------------------------------------------------
  // 2. Create Users
  // ------------------------------------------------------------------
  const userDefs = [
    // Admin
    { name: "System Administrator", role: "admin", prefix: "admin", customEmail: "admin@nexora.local", customPasswordHash: adminPasswordHash },
    
    // The 5 Explicit Demo Users
    { name: "John Smith", role: "seller", prefix: "johnsmith", customEmail: "john@nexora.local", customPasswordHash: defaultPasswordHash },
    { name: "Emily Chen", role: "provider", prefix: "emilyc", customEmail: "emily@nexora.local", customPasswordHash: defaultPasswordHash },
    { name: "Michael Chang", role: "buyer", prefix: "mikec", customEmail: "michael@nexora.local", customPasswordHash: defaultPasswordHash },
    { name: "Sarah Jenkins", role: "seller", prefix: "sarahj", customEmail: "sarah@nexora.local", customPasswordHash: defaultPasswordHash },
    { name: "David Rodriguez", role: "provider", prefix: "davidr", customEmail: "david@nexora.local", customPasswordHash: defaultPasswordHash },
    
    // Remaining Background Users
    { name: "James Thornton", role: "seller", prefix: "seller1" },
    { name: "Priya Sharma", role: "seller", prefix: "seller2" },
    { name: "Lucas Bennett", role: "seller", prefix: "seller3" },
    { name: "Amara Osei", role: "seller", prefix: "seller4" },
    { name: "Ethan Cole", role: "seller", prefix: "seller5" },
    { name: "Sofia Martinez", role: "seller", prefix: "seller6" },
    { name: "Noah Kim", role: "seller", prefix: "seller7" },
    { name: "Isabella Chen", role: "seller", prefix: "seller8" },
    { name: "Ryan Foster", role: "provider", prefix: "provider1" },
    { name: "Natalie Brooks", role: "provider", prefix: "provider2" },
    { name: "Daniel Park", role: "provider", prefix: "provider3" },
    { name: "Olivia White", role: "provider", prefix: "provider4" },
    { name: "Liam Johnson", role: "provider", prefix: "provider5" },
    { name: "Emma Davis", role: "provider", prefix: "provider6" },
    { name: "Chloe Thompson", role: "provider", prefix: "provider7" },
    { name: "Owen Garcia", role: "provider", prefix: "provider8" },
    { name: "Aria Patel", role: "buyer", prefix: "buyer1" },
    { name: "Mason Wright", role: "buyer", prefix: "buyer2" },
    { name: "Zoe Baker", role: "buyer", prefix: "buyer3" },
    { name: "Caleb Harris", role: "buyer", prefix: "buyer4" },
    { name: "Lily Torres", role: "buyer", prefix: "buyer5" },
    { name: "Jack Robinson", role: "buyer", prefix: "buyer6" },
    { name: "Ava Mitchell", role: "buyer", prefix: "buyer7" },
    { name: "Henry Clark", role: "buyer", prefix: "buyer8" },
    { name: "Grace Lewis", role: "buyer", prefix: "buyer9" },
    { name: "Samuel Walker", role: "buyer", prefix: "buyer10" },
  ];

  const userDocs = await Promise.all(
    userDefs.map(async (u, idx) => {
      const username = slugify(u.name.replace(/\s+/g, "")) + (idx < 6 ? "" : (1000 + idx));
      return User.create({
        name: u.name,
        email: u.customEmail ?? `${u.prefix}@nexora.example`,
        username,
        passwordHash: u.customPasswordHash ?? passwordHash,
        role: u.role,
        bio: `Hi, I'm ${u.name}. ${
          u.role === "seller"
            ? "I sell quality products at competitive prices."
            : u.role === "provider"
            ? "I offer professional services with guaranteed satisfaction."
            : u.role === "admin"
            ? "Platform administrator for Nexora."
            : "I love discovering great deals on Nexora!"
        }`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        coverImageUrl: `https://picsum.photos/seed/${u.prefix}/900/300`,
        location: pick(CITIES),
        contact: { phone: `+1-${randInt(200, 999)}-${randInt(100, 999)}-${randInt(1000, 9999)}`, email: `${u.prefix}@nexora.example` },
        skills: pickN(SKILLS_POOL, randInt(2, 5)),
        socialLinks: [
          { platform: "linkedin", url: `https://linkedin.com/in/${username}` },
          { platform: "twitter", url: `https://twitter.com/${username}` },
        ],
        trustScore: randInt(60, 100),
        verificationStatus: pick(["unverified", "pending", "verified"]),
        ratingAvg: randFloat(3.5, 5.0, 1),
        ratingCount: randInt(5, 80),
        followerCount: randInt(0, 200),
        followingCount: randInt(0, 100),
        responseTimeMinutes: randInt(10, 240),
        completionRate: randFloat(85, 100, 1),
        lastSeenAt: daysAgo(randInt(0, 7)),
      });
    })
  );

  const admins = userDocs.filter((u) => u.role === "admin");
  const sellers = userDocs.filter((u) => u.role === "seller");
  const providers = userDocs.filter((u) => u.role === "provider");
  const buyers = userDocs.filter((u) => u.role === "buyer");

  console.log(`[seed] Created ${userDocs.length} users (${admins.length} admins, ${sellers.length} sellers, ${providers.length} providers, ${buyers.length} buyers)`);

  // ------------------------------------------------------------------
  // 3. Categories
  // ------------------------------------------------------------------
  const catDocs = await Promise.all(
    PRODUCT_CATEGORIES_DATA.map(async (c, idx) => {
      const slug = slugify(c.name);
      return Category.findOneAndUpdate(
        { slug },
        { $setOnInsert: { name: c.name, slug, icon: c.icon, order: idx } },
        { upsert: true, new: true }
      );
    })
  );

  const svcCatDocs = await Promise.all(
    SERVICE_CATEGORIES_DATA.map(async (c, idx) => {
      const slug = slugify(c.name);
      return ServiceCategory.findOneAndUpdate(
        { slug },
        { $setOnInsert: { name: c.name, slug, icon: c.icon, order: idx } },
        { upsert: true, new: true }
      );
    })
  );

  console.log(`[seed] Ensured ${catDocs.length} product categories and ${svcCatDocs.length} service categories`);

  // ------------------------------------------------------------------
  // 4. Products (20 unique products)
  // ------------------------------------------------------------------
  const productDocs = await Promise.all(
    PRODUCT_TEMPLATES.map(async (pt, idx) => {
      const seller = sellers[idx % sellers.length];
      const cat = catDocs.find((c) => c && c.name === pt.cat) ?? catDocs[0];
      const slug = slugify(pt.title) + "-" + (1000 + idx);
      const imgSeed = `product-${idx + 1}`;

      return Product.create({
        seller: seller._id,
        title: pt.title,
        slug,
        description: `${pt.title} — a premium quality item from ${seller.name}. Ships from ${seller.location}. All items are carefully inspected before dispatch. Buyer satisfaction is our top priority.`,
        category: cat!._id,
        price: pt.price,
        compareAtPrice: idx % 3 === 0 ? parseFloat((pt.price * 1.2).toFixed(2)) : undefined,
        condition: pt.condition as any,
        images: [
          `https://picsum.photos/seed/${imgSeed}/600/600`,
          `https://picsum.photos/seed/${imgSeed}-b/600/600`,
        ],
        location: seller.location,
        stock: pt.stock,
        ratingAvg: randFloat(3.8, 5.0, 1),
        ratingCount: randInt(2, 40),
        status: "active",
        createdAt: daysAgo(randInt(10, 90)),
      });
    })
  );

  console.log(`[seed] Created ${productDocs.length} products`);

  // ------------------------------------------------------------------
  // 5. Services (20 unique services)
  // ------------------------------------------------------------------
  const serviceDocs = await Promise.all(
    SERVICE_TEMPLATES.map(async (st, idx) => {
      const provider = providers[idx % providers.length];
      const cat = svcCatDocs.find((c) => c && c.name === st.cat) ?? svcCatDocs[0];
      const slug = slugify(st.title) + "-" + (2000 + idx);

      return Service.create({
        provider: provider._id,
        title: st.title,
        slug,
        description: `Expert ${st.title} by ${provider.name}. ${randInt(3, 8)} years of experience. Based in ${provider.location}. Satisfaction guaranteed or your money back. Let's create something amazing together.`,
        category: cat!._id,
        packages: st.packages,
        startingPrice: Math.min(...st.packages.map((p) => p.price)),
        images: [
          `https://picsum.photos/seed/service-${idx + 1}/600/400`,
          `https://picsum.photos/seed/service-${idx + 1}-b/600/400`,
        ],
        location: provider.location,
        ratingAvg: randFloat(3.9, 5.0, 1),
        ratingCount: randInt(3, 55),
        status: "active",
        createdAt: daysAgo(randInt(5, 60)),
      });
    })
  );

  console.log(`[seed] Created ${serviceDocs.length} services`);

  // ------------------------------------------------------------------
  // 6. Orders (mix of statuses — enough for dashboard analytics)
  // ------------------------------------------------------------------
  const orderStatuses: Array<"pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"> = [
    "pending", "confirmed", "shipped", "delivered", "delivered", "delivered",
    "cancelled", "refunded", "delivered", "delivered",
  ];

  const orderDocs = [];
  for (let i = 0; i < 30; i++) {
    const buyer = buyers[i % buyers.length];
    const product = productDocs[i % productDocs.length];
    const status = orderStatuses[i % orderStatuses.length];
    const createdAt = daysAgo(randInt(1, 120));
    const o = await Order.create({
      buyer: buyer._id,
      seller: product.seller,
      product: product._id,
      productSnapshot: {
        title: product.title,
        price: product.price,
        image: product.images[0],
      },
      quantity: 1,
      total: product.price,
      status,
      shippingAddress: `${randInt(10, 999)} Main St, ${pick(CITIES)}`,
      createdAt,
      updatedAt: createdAt,
    });
    orderDocs.push(o);
  }

  console.log(`[seed] Created ${orderDocs.length} orders`);

  // ------------------------------------------------------------------
  // 7. Bookings (mix of statuses)
  // ------------------------------------------------------------------
  const bookingStatuses: Array<"pending" | "accepted" | "declined" | "completed" | "cancelled"> = [
    "pending", "accepted", "completed", "completed", "cancelled", "declined",
    "completed", "accepted", "pending", "completed",
  ];

  const bookingDocs = [];
  for (let i = 0; i < 30; i++) {
    const buyer = buyers[i % buyers.length];
    const service = serviceDocs[i % serviceDocs.length];
    const status = bookingStatuses[i % bookingStatuses.length];
    const pkg = service.packages[i % service.packages.length];
    const createdAt = daysAgo(randInt(1, 90));
    const b = await Booking.create({
      service: service._id,
      package: { name: pkg.name, price: pkg.price, deliveryDays: pkg.deliveryDays, features: pkg.features },
      buyer: buyer._id,
      provider: service.provider,
      status,
      scheduledDate: status === "pending" || status === "accepted" ? daysFromNow(randInt(1, 30)) : daysAgo(randInt(1, 60)),
      notes: pick(["Please prioritize quality.", "Need this urgently, please rush.", "Follow the brief attached.", "Open to suggestions on approach.", undefined as any]),
      createdAt,
      updatedAt: createdAt,
    });
    bookingDocs.push(b);
  }

  console.log(`[seed] Created ${bookingDocs.length} bookings`);

  // ------------------------------------------------------------------
  // 8. Reviews (products, services, users)
  // ------------------------------------------------------------------
  const reviewDocs = [];

  // Product reviews (from delivered orders)
  const deliveredOrders = orderDocs.filter((o) => o.status === "delivered");
  for (const order of deliveredOrders) {
    const rating = randInt(3, 5);
    const comment = rating >= 5 ? pick(REVIEW_COMMENTS_GOOD) : rating === 4 ? pick(REVIEW_COMMENTS_MID) : pick(REVIEW_COMMENTS_BAD);
    try {
      const r = await Review.create({
        author: order.buyer,
        targetType: "product",
        targetId: order.product,
        order: order._id,
        rating,
        comment,
        createdAt: new Date(order.createdAt.getTime() + randInt(1, 5) * 24 * 60 * 60 * 1000),
      });
      reviewDocs.push(r);
    } catch (_) { /* skip duplicate */ }
  }

  // Service reviews (from completed bookings)
  const completedBookings = bookingDocs.filter((b) => b.status === "completed");
  for (const booking of completedBookings) {
    const rating = randInt(3, 5);
    const comment = rating >= 5 ? pick(REVIEW_COMMENTS_GOOD) : rating === 4 ? pick(REVIEW_COMMENTS_MID) : pick(REVIEW_COMMENTS_BAD);
    try {
      const r = await Review.create({
        author: booking.buyer,
        targetType: "service",
        targetId: booking.service,
        booking: booking._id,
        rating,
        comment,
        createdAt: new Date(booking.createdAt.getTime() + randInt(1, 3) * 24 * 60 * 60 * 1000),
      });
      reviewDocs.push(r);
    } catch (_) { /* skip duplicate */ }
  }

  // Seller/provider user reviews
  for (let i = 0; i < 12; i++) {
    const author = buyers[i % buyers.length];
    const target = i % 2 === 0 ? sellers[i % sellers.length] : providers[i % providers.length];
    if (author._id.toString() === target._id.toString()) continue;
    const rating = randInt(3, 5);
    try {
      const r = await Review.create({
        author: author._id,
        targetType: "user",
        targetId: target._id,
        rating,
        comment: rating >= 5 ? pick(REVIEW_COMMENTS_GOOD) : pick(REVIEW_COMMENTS_MID),
        createdAt: daysAgo(randInt(1, 45)),
      });
      reviewDocs.push(r);
    } catch (_) { /* skip duplicate */ }
  }

  console.log(`[seed] Created ${reviewDocs.length} reviews`);

  // ------------------------------------------------------------------
  // 9. Wishlists
  // ------------------------------------------------------------------
  const wishlistDocs = [];
  for (let i = 0; i < 25; i++) {
    const user = buyers[i % buyers.length];
    const product = productDocs[(i + 3) % productDocs.length];
    try {
      const w = await Wishlist.create({ user: user._id, product: product._id });
      wishlistDocs.push(w);
    } catch (_) { /* skip duplicate */ }
  }

  console.log(`[seed] Created ${wishlistDocs.length} wishlist entries`);

  // ------------------------------------------------------------------
  // 10. Follows
  // ------------------------------------------------------------------
  const followDocs = [];
  const allSellersProviders = [...sellers, ...providers];
  for (const buyer of buyers) {
    const targets = pickN(allSellersProviders, randInt(2, 5));
    for (const target of targets) {
      try {
        const f = await Follow.create({ follower: buyer._id, following: target._id });
        followDocs.push(f);
      } catch (_) { /* skip duplicate */ }
    }
  }
  // Some sellers follow each other
  for (let i = 0; i < sellers.length - 1; i++) {
    try {
      await Follow.create({ follower: sellers[i]._id, following: sellers[i + 1]._id });
    } catch (_) {}
  }

  console.log(`[seed] Created ${followDocs.length} follows`);

  // ------------------------------------------------------------------
  // 11. Conversations & Messages
  // ------------------------------------------------------------------
  const convoDocs: any[] = [];
  const messageDocs = [];

  const messageTexts = [
    "Hi! I'm interested in your listing. Is it still available?",
    "Yes, absolutely! Feel free to ask any questions.",
    "Could you tell me more about the condition?",
    "It's in excellent condition. Only used a handful of times.",
    "That's great! What's the best price you can do?",
    "For you, I can do 10% off. How does that sound?",
    "Deal! How do I place an order?",
    "Just click Buy Now on the listing page. I'll ship same day.",
    "Perfect. Thank you so much!",
    "My pleasure. Looking forward to doing business with you!",
    "Just wanted to confirm you received the package?",
    "Yes, it arrived today! Exactly as described. Love it!",
    "Wonderful! Please leave a review when you get a chance.",
    "Will do. Thanks again!",
    "Hi, quick question about your service package.",
    "Sure, what would you like to know?",
    "Does the Pro package include source files?",
    "Yes, you get all source files plus the final deliverables.",
    "Excellent. I'll go ahead and book the Pro package.",
    "Great choice! I'll get started right after payment confirms.",
  ];

  // Create conversations between buyers and sellers/providers
  const convoPairs: Array<[Types.ObjectId, Types.ObjectId]> = [
    [buyers[0]._id, sellers[0]._id],
    [buyers[1]._id, sellers[1]._id],
    [buyers[2]._id, providers[0]._id],
    [buyers[3]._id, providers[1]._id],
    [buyers[4]._id, sellers[2]._id],
    [buyers[5]._id, providers[2]._id],
    [buyers[6]._id, sellers[3]._id],
    [buyers[7]._id, providers[3]._id],
    [buyers[0]._id, providers[0]._id],
    [buyers[1]._id, sellers[4]._id],
  ];

  for (const [p1, p2] of convoPairs) {
    const convo = await Conversation.create({
      participants: [p1, p2],
      unreadCounts: { [p2.toString()]: randInt(0, 3) },
      createdAt: daysAgo(randInt(5, 30)),
    });
    convoDocs.push(convo);

    // Generate 4–8 messages per conversation
    const msgCount = randInt(4, 8);
    let lastMsgId: Types.ObjectId | undefined;
    let lastMsgAt: Date | undefined;

    for (let m = 0; m < msgCount; m++) {
      const sender = m % 2 === 0 ? p1 : p2;
      const msgType = m === 2 ? "image" : m === 5 ? "voice" : "text";
      const createdAt = new Date(convo.createdAt.getTime() + m * 3 * 60 * 60 * 1000);
      const msg = await Message.create({
        conversation: convo._id,
        sender,
        type: msgType,
        content: msgType === "text" ? messageTexts[(convoDocs.length * 2 + m) % messageTexts.length] : undefined,
        attachmentUrl: msgType === "image"
          ? `https://picsum.photos/seed/msg-${convoDocs.length}-${m}/400/300`
          : msgType === "voice"
          ? `https://res.cloudinary.com/nexora-demo/video/upload/voice-${convoDocs.length}-${m}.webm`
          : undefined,
        readBy: m < msgCount - 1 ? [p1, p2] : [sender],
        createdAt,
      });
      messageDocs.push(msg);
      lastMsgId = msg._id as Types.ObjectId;
      lastMsgAt = createdAt;
    }

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(convo._id, {
      lastMessage: lastMsgId,
      lastMessageAt: lastMsgAt,
    });
  }

  console.log(`[seed] Created ${convoDocs.length} conversations and ${messageDocs.length} messages`);

  // ------------------------------------------------------------------
  // 12. Notifications
  // ------------------------------------------------------------------
  const notifDocs = [];
  const notifTemplates = [
    ...orderDocs.slice(0, 8).map((o) => ({
      recipient: o.seller,
      type: "order" as const,
      title: "New Order Received",
      body: `You have a new order for ${o.productSnapshot.title}.`,
      targetUrl: `/dashboard/orders`,
    })),
    ...bookingDocs.slice(0, 8).map((b) => ({
      recipient: b.provider,
      type: "order" as const,
      title: "New Booking Request",
      body: `A new booking request has arrived for your service.`,
      targetUrl: `/dashboard/bookings`,
    })),
    ...reviewDocs.slice(0, 6).map((r) => ({
      recipient: r.targetType === "product"
        ? productDocs.find((p) => p._id.toString() === r.targetId.toString())?.seller
        : r.targetType === "service"
        ? serviceDocs.find((s) => s._id.toString() === r.targetId.toString())?.provider
        : r.targetId,
      type: "review" as const,
      title: "New Review Received",
      body: `Someone left you a ${r.rating}-star review.`,
      targetUrl: `/dashboard/reviews`,
    })),
    ...wishlistDocs.slice(0, 5).map((w) => ({
      recipient: productDocs.find((p) => p._id.toString() === w.product.toString())?.seller,
      type: "favorite" as const,
      title: "Item Added to Wishlist",
      body: "Someone added your product to their wishlist.",
      targetUrl: `/dashboard`,
    })),
    ...followDocs.slice(0, 8).map((f) => ({
      recipient: f.following,
      type: "follow" as const,
      title: "New Follower",
      body: "Someone started following you.",
      targetUrl: `/dashboard/activity`,
    })),
    ...messageDocs.filter((_, i) => i % 3 === 0).slice(0, 6).map((m) => ({
      recipient: convoPairs[convoDocs.findIndex((c) => c._id.toString() === m.conversation.toString())]?.[1],
      type: "message" as const,
      title: "New Message",
      body: "You have a new message.",
      targetUrl: `/dashboard/messages`,
    })),
    // System notifications
    ...buyers.slice(0, 3).map((b) => ({
      recipient: b._id,
      type: "system" as const,
      title: "Welcome to Nexora!",
      body: "Your account is set up and ready to use. Start exploring the marketplace.",
      targetUrl: `/`,
    })),
  ];

  for (const n of notifTemplates) {
    if (!n.recipient) continue;
    try {
      const notif = await Notification.create({
        recipient: n.recipient,
        type: n.type,
        title: n.title,
        body: n.body,
        targetUrl: n.targetUrl,
        isRead: Math.random() > 0.4,
        createdAt: daysAgo(randInt(0, 14)),
      });
      notifDocs.push(notif);
    } catch (_) {}
  }

  console.log(`[seed] Created ${notifDocs.length} notifications`);

  // ------------------------------------------------------------------
  // 6. Recalculate Trust Scores natively based on seeded data
  // ------------------------------------------------------------------
  console.log("[seed] Recalculating Trust Scores for all users...");
  await Promise.all(userDocs.map((u) => recomputeTrustScore(u._id)));

  // ------------------------------------------------------------------
  // Done
  // ------------------------------------------------------------------
  console.log("\n[seed] ✅ Demo Data Complete");
  console.log("✔ Created Users");
  console.log("✔ Created Products");
  console.log("✔ Created Services");
  console.log("✔ Created Orders");
  console.log("✔ Created Bookings");
  console.log("✔ Created Reviews");
  console.log("✔ Created Conversations");
  console.log("✔ Created Notifications");
  console.log("✔ Admin Ready");

  console.log("\nAdministrator:");
  console.log("Email: admin@nexora.local");
  console.log("Password: Admin@123");

  console.log("\nDemo Users (Password: Password123):");
  console.log("- John Smith (john@nexora.local) [Seller]");
  console.log("- Emily Chen (emily@nexora.local) [Provider]");
  console.log("- Michael Chang (michael@nexora.local) [Buyer]");
  console.log("- Sarah Jenkins (sarah@nexora.local) [Seller]");
  console.log("- David Rodriguez (david@nexora.local) [Provider]");

  console.log("\nOther background seeded users use password: password123");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] ❌ Failed:", err);
  process.exit(1);
});
