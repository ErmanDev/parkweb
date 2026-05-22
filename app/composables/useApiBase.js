/**
 * Base URL for API requests. Empty in local dev (same origin as Nuxt).
 * On Vercel, set NUXT_PUBLIC_API_BASE=https://stunbning.onrender.com
 */
export function useApiBase() {
    const config = useRuntimeConfig();
    const apiBase = computed(() => {
        const raw = config.public.apiBase || "";
        return typeof raw === "string" ? raw.replace(/\/$/, "") : "";
    });

    function apiUrl(path) {
        const normalized = path.startsWith("/") ? path : `/${path}`;
        return apiBase.value ? `${apiBase.value}${normalized}` : normalized;
    }

    return { apiBase, apiUrl };
}
