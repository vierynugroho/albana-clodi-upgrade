// lib/auth.ts
export function saveToken(token: string) {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function removeToken() {
    if (typeof window !== "undefined") localStorage.removeItem("token");
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
    const t = getToken();
    if (!t) return false;
    try {
        // cek expiry sederhana: decode jwt, cek exp jika tersedia
        const payload = JSON.parse(atob(t.split('.')[1]));
        const exp = payload?.exp;
        if (exp && typeof exp === "number") {
            return Date.now() / 1000 < exp;
        }
        return true;
    } catch {
        return true;
    }
}

export interface UserInfo {
    id: string;
    email?: string;
    name?: string;
    role?: string;
}

export function getUserFromToken(): UserInfo | null {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload?.id || "",
            email: payload?.email || "",
            name: payload?.name || payload?.username || "User",
            role: payload?.roles,
        };
    } catch {
        return null;
    }
}

