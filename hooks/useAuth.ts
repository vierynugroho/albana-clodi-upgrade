// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCurrentUser,
    updateProfile,
    UpdateProfilePayload,
    CurrentUserResponse,
} from "@/lib/services/auth.service";

// Query key for current user
export const authKeys = {
    currentUser: ["currentUser"] as const,
};

// Hook to get current user data
export function useCurrentUser() {
    return useQuery<CurrentUserResponse, Error>({
        queryKey: authKeys.currentUser,
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

// Hook to update user profile
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfilePayload) => updateProfile(data),
        onSuccess: () => {
            // Invalidate current user query to refetch updated data
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
        },
    });
}

// Alias for convenience
export { useCurrentUser as useUser };
