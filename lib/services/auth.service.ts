// lib/services/auth.service.ts
import api from "@/lib/api";
import type {
    CurrentUserResponse,
    UpdateProfilePayload,
    UpdateProfileResponse,
} from "@/types/api";
export type { CurrentUserResponse, UpdateProfilePayload, UpdateProfileResponse } from "@/types/api";


// Get current user data
export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await api.get<CurrentUserResponse>("/auth/current");
    return response.data;
}

// Update user profile
export async function updateProfile(
    data: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
    const response = await api.patch<UpdateProfileResponse>("/auth/me", data);
    return response.data;
}
