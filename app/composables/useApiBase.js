import { RENDER_API_ORIGIN } from "~/utils/resolveSlotsApiUrl";

/**
 * Base URL for API requests. See resolveSlotsApiUrl.js for defaults.
 */
export function useApiBase() {
    const config = useRuntimeConfig();
    const apiBase = computed(() => {
        const raw = config.public.apiBase || "";
        const trimmed = typeof raw === "string" ? raw.replace(/\/$/, "") : "";
        if (trimmed) return trimmed;
        if (import.meta.client && !window.location.hostname.endsWith(".onrender.com")) {
            const host = window.location.hostname;
            if (host !== "localhost" && host !== "127.0.0.1") {
                return RENDER_API_ORIGIN;
            }
        }
        return "";
    });

    function apiUrl(path) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return apiBase.value ? `${apiBase.value}${normalized}` : normalized;
    }

    return { apiBase, apiUrl };
}
