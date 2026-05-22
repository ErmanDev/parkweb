export const FALLBACK_SLOTS = [
    { label: "SLOT 1", type: "car", status: "unavailable", live: true, sensorId: "slot1" },
    { label: "SLOT 2", type: "car", status: "unavailable", live: true, sensorId: "slot2" },
    { label: "SLOT 3", type: "motor", status: "unavailable", live: true, sensorId: "slot3" },
    { label: "SLOT 4", type: "motor", status: "unavailable", live: true, sensorId: "slot4" },
];

export function mapSnapshotSlots(payload) {
    if (!payload || !Array.isArray(payload.slots)) return null;
    return payload.slots.map((slot) => ({
        label: slot.label,
        type: slot.type,
        status: slot.status,
        live: !!slot.live,
        sensorId: slot.sensorId,
        lastReading: slot.lastReading || null,
        evaluating: !!slot.evaluating,
        evaluatingUntil: slot.evaluatingUntil || null,
        updatedAt: slot.updatedAt || null,
    }));
}

export function formatDistance(slot) {
    const reading = slot && slot.lastReading;
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
    return slot?.lastReading?.motion ? "Detected" : "None";
}
