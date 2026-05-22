/** Allow the Vercel-hosted dashboard to call /api/* on Render. */
export default defineEventHandler((event) => {
    setResponseHeaders(event, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });

    if (getMethod(event) === "OPTIONS") {
        setResponseStatus(event, 204);
        return "";
    }
});
