export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  order: number;
}

export interface ServicePackage {
  name: string;
  price: number;
  deliveryDays: number;
  features: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  verificationStatus?: "unverified" | "pending" | "verified";
  trustScore?: number;
  responseTimeMinutes?: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ServiceCategory | string;
  packages: ServicePackage[];
  startingPrice: number;
  images: string[];
  location?: string;
  ratingAvg: number;
  ratingCount: number;
  status: "active" | "draft";
  provider: ServiceProvider | string;
  createdAt: string;
}

export interface ServiceListResponse {
  items: Service[];
  page: number;
  totalPages: number;
  total: number;
}

export type ServiceSort = "newest" | "price_asc" | "price_desc" | "rating";

export interface ServiceListParams {
  category?: string;
  provider?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  minRating?: number;
  maxDeliveryDays?: number;
  q?: string;
  sort?: ServiceSort;
  page?: number;
  limit?: number;
}
