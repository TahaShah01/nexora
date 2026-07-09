export interface AnalyticsSummary {
  totalOrders: number;
  totalBookings: number;
  totalSpent: number;
  wishlistCount: number;
  unreadNotifications: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface TopListing {
  id: string;
  title: string;
  slug: string;
  orderCount?: number;
  bookingCount?: number;
  revenue: number;
}

export interface DashboardAnalytics {
  summary: AnalyticsSummary;
  revenueByDay: RevenuePoint[];
  ordersByStatus: StatusCount[];
  topProducts: TopListing[];
  bookingRevenueByDay: RevenuePoint[];
  bookingsByStatus: StatusCount[];
  topServices: TopListing[];
}
