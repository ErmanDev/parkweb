<script setup>
import { useParkingSlots } from "~/composables/useParkingSlots";

definePageMeta({ layout: "default" });

const {
    slots,
    formatDistance,
    formatTime,
    statusLabel,
    statusBadgeClass,
    motionLabel,
} = useParkingSlots();

const liveSlots = computed(() => slots.value.filter((slot) => slot.live));

function lastUpdated(slot) {
    return slot?.lastReading?.receivedAt ?? slot?.updatedAt ?? null;
}

function typeLabel(type) {
    return type === "motor" ? "Motorcycle" : "Car";
}
</script>

<template>
    <main class="px-4 py-8 md:px-12">
        <div class="mb-6">
            <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-600 xl:text-sm">
                Real-time telemetry
            </p>
            <h2 class="mt-1 text-[clamp(1.5rem,3vw,2rem)] text-slate-900 xl:text-4xl">
                Live sensor slots
            </h2>
            <p class="mt-2 max-w-2xl text-slate-600 xl:text-lg">
                Distance and motion from each TOF + PIR pair. Updates every second while sensors are online.
            </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
            <section
                v-for="slot in liveSlots"
                :key="slot.sensorId || slot.label"
                class="rounded-[1.25rem] border border-slate-400/20 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px]">
                <div class="flex flex-wrap items-start justify-between gap-2">
                    <div>
                        <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-600">
                            {{ slot.label }}
                        </p>
                        <p class="mt-0.5 text-sm text-slate-500">
                            {{ typeLabel(slot.type) }} · {{ slot.sensorId }}
                        </p>
                    </div>
                    <span class="text-xs text-slate-500">
                        {{ formatTime(lastUpdated(slot)) }}
                    </span>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        :class="[
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider',
                            statusBadgeClass(slot),
                        ]">
                        {{ statusLabel(slot) }}
                    </span>
                    <span
                        v-if="slot.evaluating"
                        class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Evaluating
                    </span>
                </div>

                <dl class="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt class="text-slate-500">Distance</dt>
                        <dd class="mt-0.5 font-semibold text-slate-900 xl:text-base">
                            {{ formatDistance(slot) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-slate-500">Motion</dt>
                        <dd class="mt-0.5 font-semibold text-slate-900 xl:text-base">
                            {{ motionLabel(slot) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-slate-500">Raw (mm)</dt>
                        <dd class="mt-0.5 font-mono text-sm text-slate-800">
                            {{
                                slot.lastReading?.distance_mm != null
                                    ? slot.lastReading.distance_mm
                                    : "—"
                            }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-slate-500">Slot state</dt>
                        <dd class="mt-0.5 font-semibold capitalize text-slate-900">
                            {{ slot.status }}
                        </dd>
                    </div>
                </dl>

                <p
                    v-if="slot.status === 'unavailable'"
                    class="mt-4 text-xs italic text-slate-500">
                    No readings in the last 30 seconds. Check power and Wi-Fi on the Arduino for
                    {{ slot.sensorId }}.
                </p>
            </section>
        </div>

        <p
            v-if="!liveSlots.length"
            class="mt-6 text-sm italic text-slate-500">
            No live sensors configured.
        </p>
    </main>
</template>
