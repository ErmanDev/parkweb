import { handleCorsPreflight } from "~~/server/utils/cors";
import { getSnapshot } from "~~/server/utils/parkingState";

export default defineEventHandler((event) => {
    const preflight = handleCorsPreflight(event);
    if (preflight !== undefined) return preflight;

    return { slots: getSnapshot() };
});
