import type { Service, ServiceListParams, ServiceListResponse } from "@/types/service";
import { apiClient } from "./client";

export async function fetchServices(params: ServiceListParams = {}): Promise<ServiceListResponse> {
  const { data } = await apiClient.get<ServiceListResponse>("/services", { params });
  return data;
}

export async function fetchServiceBySlug(slug: string): Promise<Service> {
  const { data } = await apiClient.get<{ service: Service }>(`/services/${slug}`);
  return data.service;
}

export async function fetchRelatedServices(slug: string): Promise<Service[]> {
  const { data } = await apiClient.get<{ items: Service[] }>(`/services/${slug}/related`);
  return data.items;
}

export interface ServicePackageInput {
  name: string;
  price: number;
  deliveryDays: number;
  features: string[];
}

export interface ServiceInput {
  title: string;
  description: string;
  category: string;
  packages: ServicePackageInput[];
  images: string[];
  location?: string;
  status?: string;
}

export async function createService(payload: ServiceInput): Promise<Service> {
  const { data } = await apiClient.post<{ service: Service }>("/services", payload);
  return data.service;
}

export async function updateService(slug: string, payload: Partial<ServiceInput>): Promise<Service> {
  const { data } = await apiClient.patch<{ service: Service }>(`/services/${slug}`, payload);
  return data.service;
}

export async function deleteService(slug: string): Promise<void> {
  await apiClient.delete(`/services/${slug}`);
}
