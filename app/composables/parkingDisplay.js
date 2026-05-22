export const FALLBACK_SLOTS = [
    { label: "SLOT 1", type: "car", status: "unavailable", live: true, sensorId: "slot1" },
    { label: "SLOT 2", type: "car", status: "unavailable", live: true, sensorId: "slot2" },
    { label: "SLOT 3", type: "motor", status: "unavailable", live: true, sensorId: "slot3" },
    { label: "SLOT 4", type: "motor", status: "unavailable", live: true, sensorId: "slot4" },
];

/** Keep in sync with server STALE_TIMEOUT_MS (parkingState.ts). */
export const SENSOR_STALE_MS = 2_500;

export function isSensorStale(slot) {
    if (!slot?.live) return false;
    const ts = slot.lastReading?.receivedAt ?? slot.updatedAt;
    if (!ts) return true;
    return Date.now() - ts > SENSOR_STALE_MS;
}

export function mapSnapshotSlots(payload) {
    if (!payload || !Array.isArray(payload.slots)) return null;
    return payload.slots.map((slot) => {
        const mapped = {
            label: slot.label,
            type: slot.type,
            status: slot.status,
            live: !!slot.live,
            sensorId: slot.sensorId,
            lastReading: slot.lastReading || null,
            evaluating: !!slot.evaluating,
            evaluatingUntil: slot.evaluatingUntil || null,
            updatedAt: slot.updatedAt || null,
        };
        if (mapped.live && isSensorStale(mapped)) {
            mapped.status = "unavailable";
        }
        return mapped;
    });
}

export function formatDistance(slot) {
    if (!slot || slot.status === "unavailable" || isSensorStale(slot)) {
        return "sensor offline";
    }
    const reading = slot.lastReading;
    if (!reading || reading.distance_mm === null || reading.distance_mm === undefined) {
        return "out of range";
    }
    const inches = reading.distance_mm / 25.4;
    const cm = reading.distance_mm / 10;
    return `${cm.toFixed(1)} cm (${inches.toFixed(1)} in)`;
}

export function formatTime(ts) {
    if (!ts) return "--";
    try {
        return new Date(ts).toLocaleTimeString();
    } catch {
        return "--";
    }
}

export function statusLabel(slot) {
    if (!slot) return "";
    if (slot.status === "occupied") return "Occupied";
    if (slot.status === "unavailable") return "Offline";
    return "Available";
}

export function statusBadgeClass(slot) {
    if (!slot) return "";
    if (slot.status === "occupied") return "bg-rose-100 text-rose-700";
    if (slot.status === "unavailable") return "bg-slate-200 text-slate-600";
    return "bg-emerald-100 text-emerald-700";
}

export function motionLabel(slot) {
    if (!slot || slot.status === "unavailable" || isSensorStale(slot)) {
        return "Offline";
    }
    return slot.lastReading?.motion ? "Detected" : "None";
}
