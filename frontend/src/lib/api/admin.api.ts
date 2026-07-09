import { apiClient, getErrorMessage } from "./client";

export async function getDashboardStats() {
  try {
    const { data } = await apiClient.get("/admin/stats");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch dashboard stats"));
  }
}

export async function getUsers(page = 1, limit = 20) {
  try {
    const { data } = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch users"));
  }
}

export async function updateUserStatus(id: string, status: "active" | "suspended" | "deleted") {
  try {
    const { data } = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update user status"));
  }
}

export async function updateUserRole(id: string, role: string) {
  try {
    const { data } = await apiClient.patch(`/admin/users/${id}/role`, { role });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update user role"));
  }
}

export async function updateUserVerification(id: string, status: "unverified" | "pending" | "verified") {
  try {
    const { data } = await apiClient.patch(`/admin/users/${id}/verification`, { status });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update verification status"));
  }
}

export async function getListings(type: "product" | "service", page = 1, limit = 20) {
  try {
    const { data } = await apiClient.get(`/admin/listings?type=${type}&page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch listings"));
  }
}

export async function updateListingStatus(id: string, type: "product" | "service", status: "active" | "archived") {
  try {
    const { data } = await apiClient.patch(`/admin/listings/${id}/status`, { type, status });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update listing status"));
  }
}

export async function getCategories(type: "product" | "service") {
  try {
    const { data } = await apiClient.get(`/admin/categories?type=${type}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch categories"));
  }
}

export async function createCategory(payload: any) {
  try {
    const { data } = await apiClient.post("/admin/categories", payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create category"));
  }
}

export async function deleteCategory(id: string, type: "product" | "service") {
  try {
    await apiClient.delete(`/admin/categories/${id}?type=${type}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete category"));
  }
}

export async function getReports(page = 1, limit = 20) {
  try {
    const { data } = await apiClient.get(`/admin/reports?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch reports"));
  }
}

export async function updateReportStatus(id: string, status: "pending" | "resolved" | "dismissed", adminNotes?: string) {
  try {
    const { data } = await apiClient.patch(`/admin/reports/${id}/status`, { status, adminNotes });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update report status"));
  }
}
