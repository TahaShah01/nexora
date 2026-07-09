"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { changePasswordRequest } from "@/lib/api/auth.api";
import { getErrorMessage } from "@/lib/api/client";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => toast.success("Password updated"),
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update your password")),
  });
}
