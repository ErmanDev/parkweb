import type { H3Event } from "h3";

export function applyCors(event: H3Event) {
    setResponseHeaders(event, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
}

export function handleCorsPreflight(event: H3Event): "" | undefined {
    applyCors(event);
    if (getMethod(event) === "OPTIONS") {
        setResponseStatus(event, 204);
        return "";
    }
    return undefined;
}
