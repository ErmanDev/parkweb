// Server-side parking state machine.
//
// Logic (per the project spec):
//   - A slot becomes OCCUPIED when the TOF sensor reads "near" with a stable
//     distance for several consecutive samples and the PIR reports no motion.
//   - When already OCCUPIED, motion from the PIR opens a 10-second
//     "evaluation" window. If the TOF distance changes by more than the
//     tolerance during that window (or goes out of range), the slot flips to
//     AVAILABLE. Otherwise it remains OCCUPIED.
//   - Out-of-range readings (no object in front of the sensor) immediately
//     count as AVAILABLE.

export type SlotStatus = "available" | "occupied" | "unavailable";
export type SlotType = "car" | "motor";

export interface SensorReading {
    /** TOF distance in millimeters; null if out of range. */
    distance_mm: number | null;
    /** PIR motion state. */
    motion: boolean;
    /** Timestamp (ms since epoch) of the reading. Filled in by the server. */
    receivedAt: number;
}

export interface SlotConfig {
    label: string;
    type: SlotType;
    /** When true, the slot is driven by sensor data with the given sensorId. */
    live: boolean;
    sensorId?: string;
    /** Status to use when `live` is false (mock slots). */
    fallbackStatus?: SlotStatus;
}

export interface SlotState {
    label: string;
    type: SlotType;
    status: SlotStatus;
    live: boolean;
    sensorId?: string;
    /** Last reading received for this slot (live slots only). */
    lastReading?: SensorReading;
    /** True while we are inside a motion-triggered evaluation window. */
    evaluating: boolean;
    /** When the evaluation window ends (ms since epoch). */
    evaluatingUntil?: number;
    updatedAt: number;
}

// ---- Tunables ---------------------------------------------------------------

/** A reading at or below this distance counts as "something is in the slot". */
export const NEAR_THRESHOLD_MM = 800;

/** Two distance readings within this delta are considered "the same". */
export const STABLE_TOLERANCE_MM = 80;

/** How many consecutive stable + near + no-motion reads to flip to OCCUPIED. */
export const REQUIRED_STABLE_READS = 5;

/** Length of the motion-triggered evaluation window. */
export const EVAL_WINDOW_MS = 4_000;

/**
 * A live slot is reported as `unavailable` if no sensor reading has arrived
 * within this many milliseconds (e.g. the Arduino is offline, unplugged, or
 * lost Wi-Fi). ESP boards POST about every 1s — ~2.5s ≈ 2–3 missed reads.
 */
export const STALE_TIMEOUT_MS = 2_500;

// ---- Storage ---------------------------------------------------------------

const SLOT_CONFIG: SlotConfig[] = [
    { label: "SLOT 1", type: "car", live: true, sensorId: "slot1" },
    { label: "SLOT 2", type: "car", live: true, sensorId: "slot2" },
    { label: "SLOT 3", type: "motor", live: true, sensorId: "slot3" },
    { label: "SLOT 4", type: "motor", live: true, sensorId: "slot4" },
];

interface InternalSlot extends SlotState {
    config: SlotConfig;
    /** Counter for consecutive stable + near + no-motion samples. */
    stableNearStreak: number;
    /** Distance used as the baseline for the current stable streak. */
    streakBaselineMm: number | null;
    /** Distance baseline captured at the start of the evaluation window. */
    evalBaselineMm: number | null;
    /** Did the distance deviate during the current evaluation window? */
    evalChanged: boolean;
}

interface ParkingStore {
    slots: Map<string, InternalSlot>;
    /** Subscribers receive a fresh snapshot whenever a slot changes. */
    subscribers: Set<(snapshot: SlotState[]) => void>;
}

// Survive Nitro HMR by stashing on globalThis.
const STORE_KEY = Symbol.for("parkweb.parkingStore");
const globalAny = globalThis as unknown as { [k: symbol]: ParkingStore };

function createStore(): ParkingStore {
    const slots = new Map<string, InternalSlot>();
    const now = Date.now();
    for (const config of SLOT_CONFIG) {
        slots.set(config.label, {
            label: config.label,
            type: config.type,
            live: config.live,
            sensorId: config.sensorId,
            status: config.live
                ? "available"
                : config.fallbackStatus ?? "available",
            evaluating: false,
            updatedAt: now,
            config,
            stableNearStreak: 0,
            streakBaselineMm: null,
            evalBaselineMm: null,
            evalChanged: false,
        });
    }
    return { slots, subscribers: new Set() };
}

const store: ParkingStore = (globalAny[STORE_KEY] ??= createStore());

// ---- Public API ------------------------------------------------------------

export function getSnapshot(): SlotState[] {
    return [...store.slots.values()].map(toPublic);
}

export function subscribe(listener: (snapshot: SlotState[]) => void): () => void {
    store.subscribers.add(listener);
    return () => store.subscribers.delete(listener);
}

function broadcast() {
    const snapshot = getSnapshot();
    for (const listener of store.subscribers) {
        try {
            listener(snapshot);
        } catch {
            // ignore broken subscribers
        }
    }
}

function toPublic(slot: InternalSlot): SlotState {
    let status: SlotStatus = slot.status;
    if (slot.live) {
        const ageMs = slot.lastReading
            ? Date.now() - slot.lastReading.receivedAt
            : Infinity;
        if (ageMs > STALE_TIMEOUT_MS) {
            status = "unavailable";
        }
    }
    return {
        label: slot.label,
        type: slot.type,
        status,
        live: slot.live,
        sensorId: slot.sensorId,
        lastReading: slot.lastReading,
        evaluating: slot.evaluating,
        evaluatingUntil: slot.evaluatingUntil,
        updatedAt: slot.updatedAt,
    };
}

/** Find the live slot bound to the given sensorId. */
function findSlotForSensor(sensorId: string): InternalSlot | undefined {
    for (const slot of store.slots.values()) {
        if (slot.live && slot.sensorId === sensorId) return slot;
    }
    return undefined;
}

// ---- State machine ---------------------------------------------------------

export interface IngestPayload {
    sensorId?: string;
    /** Distance in millimeters. Use null/undefined for "out of range". */
    distance_mm?: number | null;
    motion?: boolean;
}

export interface IngestResult {
    ok: true;
    slot: SlotState;
}

export function ingestReading(payload: IngestPayload): IngestResult | null {
    const sensorId = payload.sensorId || "main";
    const slot = findSlotForSensor(sensorId);
    if (!slot) return null;

    const reading: SensorReading = {
        distance_mm:
            typeof payload.distance_mm === "number" ? payload.distance_mm : null,
        motion: !!payload.motion,
        receivedAt: Date.now(),
    };

    const previousStatus = slot.status;
    applyReading(slot, reading);
    slot.lastReading = reading;
    slot.updatedAt = reading.receivedAt;

    if (slot.status !== previousStatus) {
        // Reset transient counters on a state flip so the next phase starts
        // from a clean slate.
        slot.stableNearStreak = 0;
        slot.streakBaselineMm = null;
        slot.evalBaselineMm = null;
        slot.evalChanged = false;
        slot.evaluating = false;
        slot.evaluatingUntil = undefined;
    }

    broadcast();
    return { ok: true, slot: toPublic(slot) };
}

function applyReading(slot: InternalSlot, reading: SensorReading) {
    const isNear =
        reading.distance_mm !== null &&
        reading.distance_mm <= NEAR_THRESHOLD_MM;

    if (slot.status === "available") {
        evaluateAvailable(slot, reading, isNear);
    } else {
        evaluateOccupied(slot, reading, isNear);
    }
}

function evaluateAvailable(
    slot: InternalSlot,
    reading: SensorReading,
    isNear: boolean,
) {
    if (!isNear || reading.motion) {
        slot.stableNearStreak = 0;
        slot.streakBaselineMm = null;
        return;
    }

    const distance = reading.distance_mm as number;

    if (slot.streakBaselineMm === null) {
        slot.streakBaselineMm = distance;
        slot.stableNearStreak = 1;
    } else if (Math.abs(distance - slot.streakBaselineMm) <= STABLE_TOLERANCE_MM) {
        slot.stableNearStreak += 1;
        // Drift the baseline a little so a slowly settling reading still counts.
        slot.streakBaselineMm =
            (slot.streakBaselineMm * 3 + distance) / 4;
    } else {
        slot.streakBaselineMm = distance;
        slot.stableNearStreak = 1;
    }

    if (slot.stableNearStreak >= REQUIRED_STABLE_READS) {
        slot.status = "occupied";
    }
}

function evaluateOccupied(
    slot: InternalSlot,
    reading: SensorReading,
    isNear: boolean,
) {
    const distance = reading.distance_mm;

    // Motion opens (or extends) an evaluation window.
    if (reading.motion && !slot.evaluating) {
        slot.evaluating = true;
        slot.evaluatingUntil = reading.receivedAt + EVAL_WINDOW_MS;
        slot.evalBaselineMm = distance;
        slot.evalChanged = false;
    }

    if (slot.evaluating) {
        if (distance === null || !isNear) {
            slot.evalChanged = true;
        } else if (
            slot.evalBaselineMm !== null &&
            Math.abs(distance - slot.evalBaselineMm) > STABLE_TOLERANCE_MM
        ) {
            slot.evalChanged = true;
        }

        const windowExpired =
            slot.evaluatingUntil !== undefined &&
            reading.receivedAt >= slot.evaluatingUntil;

        if (windowExpired) {
            if (slot.evalChanged) {
                slot.status = "available";
            }
            // Either way, close the window. If still occupied, the next motion
            // event will open a fresh window.
            slot.evaluating = false;
            slot.evaluatingUntil = undefined;
            slot.evalBaselineMm = null;
            slot.evalChanged = false;
        }
    }
}
