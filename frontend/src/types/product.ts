export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
}

export interface ProductSeller {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  verificationStatus?: "unverified" | "pending" | "verified";
  trustScore?: number;
  responseTimeMinutes?: number;
}

export type ProductCondition = "new" | "like_new" | "used" | "refurbished";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category | string;
  price: number;
  compareAtPrice?: number;
  condition: ProductCondition;
  images: string[];
  location?: string;
  stock: number;
  ratingAvg: number;
  ratingCount: number;
  status: "active" | "draft" | "sold";
  seller: ProductSeller | string;
  createdAt: string;
  isWishlisted?: boolean;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "rating";

export interface ProductListParams {
  category?: string;
  seller?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  location?: string;
  minRating?: number;
  q?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}
