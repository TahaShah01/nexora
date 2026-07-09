import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api/users.api";

export function useProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username),
    enabled: !!username,
  });
}
