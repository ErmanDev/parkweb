import { ingestReading, type IngestPayload } from "~~/server/utils/parkingState";

export default defineEventHandler(async (event) => {
    const body = await readBody<Partial<IngestPayload> & {
        // Convenience aliases so the Arduino sketch stays simple.
        distance?: number | null;
        distanceMm?: number | null;
        in_range?: boolean;
        inRange?: boolean;
        sensor?: string;
        sensor_id?: string;
    }>(event);

    if (!body || typeof body !== "object") {
        throw createError({ statusCode: 400, statusMessage: "Body required" });
    }

    const distance =
        typeof body.distance_mm === "number"
            ? body.distance_mm
            : typeof body.distanceMm === "number"
                ? body.distanceMm
                : typeof body.distance === "number"
                    ? body.distance
                    : null;

    const inRange = body.in_range ?? body.inRange;
    const reportedDistance = inRange === false ? null : distance;

    const sensorId = body.sensorId || body.sensor_id || body.sensor || "main";

    const result = ingestReading({
        sensorId,
        distance_mm: reportedDistance,
        motion: !!body.motion,
    });

    if (!result) {
        throw createError({
            statusCode: 404,
            statusMessage: `No live slot is bound to sensor "${sensorId}".`,
        });
    }

    return result;
});
