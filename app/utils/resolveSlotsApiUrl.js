/** Production backend (Render Web Service). */
export const RENDER_API_ORIGIN = "https://parkweb.onrender.com";

/**
 * Where the browser should poll slot state.
 * - localhost → same-origin Nuxt /api
 * - *.onrender.com → same-origin (full stack on Render)
 * - Vercel / other → Render directly (avoids Vercel Nitro /api shadowing the proxy)
 */
export function resolveSlotsApiUrl() {
    const config = useRuntimeConfig();
    const explicit = (config.public.apiBase || "").replace(/\/$/, "");
    if (explicit) {
        return `${explicit}/api/slots`;
    }

    if (import.meta.client) {
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
            return "/api/slots";
        }
        if (host.endsWith(".onrender.com")) {
            return "/api/slots";
        }
        return `${RENDER_API_ORIGIN}/api/slots`;
    }

    return "/api/slots";
}
