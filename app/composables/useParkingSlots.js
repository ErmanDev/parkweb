import {
    FALLBACK_SLOTS,
    mapSnapshotSlots,
    formatDistance,
    formatTime,
    statusLabel,
    statusBadgeClass,
    motionLabel,
} from "~/composables/parkingDisplay";
import { resolveSlotsApiUrl } from "~/utils/resolveSlotsApiUrl";

const slots = ref([...FALLBACK_SLOTS]);
const connectionState = ref("connecting");
let pollTimer = null;
let pollStarted = false;
let slotsApiUrl = "/api/slots";

async function pollOnce() {
    try {
        const data = await $fetch(slotsApiUrl, {
            timeout: 25_000,
            retry: 0,
        });
        const mapped = mapSnapshotSlots(data);
        if (!mapped) {
            connectionState.value = "offline";
            console.warn("[parking] invalid /api/slots payload from", slotsApiUrl);
            return;
        }
        slots.value = mapped;
        connectionState.value = "live";
    } catch (err) {
        connectionState.value = "offline";
        console.warn("[parking] slots poll failed:", slotsApiUrl, err);
    }
}

function startPolling() {
    if (import.meta.server || pollStarted) return;
    pollStarted = true;
    slotsApiUrl = resolveSlotsApiUrl();
    teardown();
    pollOnce();
    pollTimer = window.setInterval(pollOnce, 500);
}

function teardown() {
    if (pollTimer) {
        window.clearInterval(pollTimer);
        pollTimer = null;
    }
}

const connectionLabel = computed(() => {
    switch (connectionState.value) {
        case "live":
            return "Live";
        case "offline":
            return "Offline";
        default:
            return "Connecting";
    }
});

const connectionDotClass = computed(() => {
    switch (connectionState.value) {
        case "live":
            return "bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.25)]";
        case "offline":
            return "bg-rose-400 shadow-[0_0_0_4px_rgba(244,63,94,0.25)]";
        default:
            return "bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.25)]";
    }
});

export function useParkingSlots() {
    return {
        slots,
        connectionState,
        connectionLabel,
        connectionDotClass,
        formatDistance,
        formatTime,
        statusLabel,
        statusBadgeClass,
        motionLabel,
    };
}

export function useParkingSlotsPolling() {
    if (import.meta.client) {
        onMounted(startPolling);
        onUnmounted(() => {
            teardown();
            pollStarted = false;
        });
    }
}
