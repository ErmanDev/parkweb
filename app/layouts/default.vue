<script setup>
import { useParkingSlots, useParkingSlotsPolling } from "~/composables/useParkingSlots";

const route = useRoute();
const { connectionLabel, connectionDotClass } = useParkingSlots();

useParkingSlotsPolling();

const navTabs = [
    { label: "Parking board", to: "/dashboard" },
    { label: "Live sensors", to: "/sensors" },
];

function isActiveTab(path) {
    return route.path === path || route.path.startsWith(path + "/");
}
</script>

<template>
    <div
        class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(62,99,255,0.12),transparent_34%),linear-gradient(180deg,#eef4ff_0%,#f8fafc_42%,#eef2ff_100%)] text-slate-900">
        <header
            class="flex flex-col gap-4 bg-[length:160%_160%] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] px-4 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] animate-[gradientMove_12s_ease_infinite] md:px-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/70 xl:text-lg">
                        ACLC Campus
                    </p>
                    <h1 class="m-0 text-[clamp(1.75rem,4vw,2.6rem)] leading-[0.95] text-white">
                        Parking Slots
                    </h1>
                </div>

                <div class="flex flex-wrap items-center justify-end gap-3">
                    <span
                        class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur xl:text-sm">
                        <span :class="['h-2.5 w-2.5 rounded-full transition', connectionDotClass]"></span>
                        {{ connectionLabel }}
                    </span>
                </div>
            </div>

            <nav
                class="flex flex-wrap gap-2"
                aria-label="Main navigation">
                <NuxtLink
                    v-for="tab in navTabs"
                    :key="tab.to"
                    :to="tab.to"
                    :class="[
                        'rounded-full px-4 py-2 text-sm font-semibold tracking-[0.04em] no-underline transition xl:text-base',
                        isActiveTab(tab.to)
                            ? 'bg-white text-slate-900 shadow-md'
                            : 'bg-white/15 text-white/90 hover:bg-white/25',
                    ]">
                    {{ tab.label }}
                </NuxtLink>
            </nav>
        </header>

        <slot />
    </div>
</template>
