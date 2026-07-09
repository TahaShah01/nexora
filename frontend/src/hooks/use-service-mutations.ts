"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import {
  createService,
  deleteService,
  updateService,
  type ServiceInput,
} from "@/lib/api/services.api";

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceInput) => createService(payload),
    onSuccess: () => {
      toast.success("Service listed");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't create that service")),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: Partial<ServiceInput> }) => updateService(slug, payload),
    onSuccess: () => {
      toast.success("Service updated");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update that service")),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteService(slug),
    onSuccess: () => {
      toast.success("Service removed");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't remove that service")),
  });
}
