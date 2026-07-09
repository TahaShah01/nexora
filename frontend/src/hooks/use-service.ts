import { useQuery } from "@tanstack/react-query";
import { fetchRelatedServices, fetchServiceBySlug } from "@/lib/api/services.api";

export function useService(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: () => fetchServiceBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedServices(slug: string) {
  return useQuery({
    queryKey: ["service", slug, "related"],
    queryFn: () => fetchRelatedServices(slug),
    enabled: !!slug,
  });
}
