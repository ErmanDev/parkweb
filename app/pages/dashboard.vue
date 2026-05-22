<script setup>
import Slot from "~/assets/slots.vue";
import List from "~/assets/list.vue";
import { useParkingSlots } from "~/composables/useParkingSlots";

definePageMeta({ layout: "default" });

const { slots } = useParkingSlots();

const availableSlots = computed(() =>
    slots.value.filter((slot) => slot.status === "available"),
);
const occupiedSlots = computed(() =>
    slots.value.filter((slot) => slot.status === "occupied"),
);
const unavailableSlots = computed(() =>
    slots.value.filter((slot) => slot.status === "unavailable"),
);
</script>

<template>
    <main class="grid gap-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section id="overview" class="px-4 pt-8 md:px-12">
            <div class="flex items-center justify-center w-full">
                <img src="/images/aclc-logo.png" class="w-full max-w-80 md:max-w-[30rem] pb-6" alt="ACLC logo" />
            </div>

            <section
                id="location"
                class="relative overflow-hidden rounded-[1.5rem] border border-slate-400/20 bg-transparent shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px]">
                <div class="campus-map min-h-[15rem] bg-cover bg-center md:min-h-[18rem] xl:min-h-[450px]"></div>
                <div
                    class="absolute bottom-0 w-full bg-[linear-gradient(180deg,rgba(15,23,42,0.68),rgba(30,41,59,0.2))] px-4 py-4 pb-5">
                    <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-400 xl:text-2xl">
                        Location
                    </p>
                    <p class="mt-1 text-[1.15rem] text-white xl:text-xl">
                        TS Building
                    </p>
                    <p class="mt-2 text-[1rem] leading-6 text-slate-200/90 xl:text-xl">
                        3535 Sayre Hwy, Hangkol,<br />
                        Valencia City, 8709 Bukidnon
                    </p>
                </div>
            </section>

            <section
                class="mt-4 rounded-[1.25rem] border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px]">
                <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-600 xl:text-sm">
                    Sensor telemetry
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600 xl:text-base">
                    View real-time distance and motion for all four slots.
                </p>
                <NuxtLink
                    to="/sensors"
                    class="mt-3 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-blue-700">
                    Open live sensors
                </NuxtLink>
            </section>
        </section>

        <section
            id="board"
            class="grid w-full gap-5 overflow-x-auto border border-slate-400/20 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] lg:p-6">
            <div class="flex flex-col gap-2">
                <div>
                    <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-600 xl:text-xl">
                        Slot overview
                    </p>
                    <h3 class="mt-1 text-[clamp(1.5rem,3vw,2rem)] text-slate-900 xl:text-5xl">
                        Live parking board
                    </h3>
                </div>
                <p class="m-0 leading-6 text-slate-600 xl:text-xl">
                    Updated for both car and motorcycle parking spaces.
                </p>
            </div>

            <div
                class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 xl:h-[400px] xl:text-2xl">
                <Slot
                    v-for="slot in slots"
                    :key="slot.label"
                    :type="slot.type"
                    :label="slot.label"
                    :status="slot.status" />
            </div>

            <div class="flex flex-col gap-4 lg:flex-row">
                <section
                    class="w-full border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] lg:w-1/3">
                    <div class="flex items-center gap-3.5">
                        <img src="/images/check.png" class="h-8 w-8" alt="available" />
                        <div>
                            <h4 class="text-[1.15rem] text-slate-900 xl:text-2xl">
                                Available Slots
                            </h4>
                            <p class="m-0 leading-6 text-slate-600 xl:text-lg">
                                Open spaces ready for entry.
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex w-full flex-col gap-[0.55rem] xl:text-xl">
                        <List
                            v-for="slot in availableSlots"
                            :key="slot.label"
                            :label="slot.label"
                            class="text-blue-950" />
                        <p v-if="!availableSlots.length" class="m-0 text-sm italic text-slate-500">
                            None right now.
                        </p>
                    </div>
                </section>

                <section
                    class="w-full border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] lg:w-1/3">
                    <div class="flex items-center gap-3.5">
                        <img src="/images/occupied.png" class="h-8 w-8" alt="occupied" />
                        <div>
                            <h4 class="text-[1.15rem] text-slate-900 xl:text-2xl">
                                Occupied Slots
                            </h4>
                            <p class="m-0 leading-6 text-slate-600 xl:text-lg">
                                Currently in use and unavailable.
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex w-full flex-col gap-[0.55rem] xl:text-xl">
                        <List
                            v-for="slot in occupiedSlots"
                            :key="slot.label"
                            :label="slot.label"
                            class="text-slate-700" />
                        <p v-if="!occupiedSlots.length" class="m-0 text-sm italic text-slate-500">
                            None right now.
                        </p>
                    </div>
                </section>

                <section
                    class="w-full border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] lg:w-1/3">
                    <div class="flex items-center gap-3.5">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500">
                            !
                        </div>
                        <div>
                            <h4 class="text-[1.15rem] text-slate-900 xl:text-2xl">
                                Unavailable Slots
                            </h4>
                            <p class="m-0 leading-6 text-slate-600 xl:text-lg">
                                Sensor offline or not yet deployed.
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 flex w-full flex-col gap-[0.55rem] xl:text-xl">
                        <List
                            v-for="slot in unavailableSlots"
                            :key="slot.label"
                            :label="slot.label"
                            class="text-slate-500" />
                        <p v-if="!unavailableSlots.length" class="m-0 text-sm italic text-slate-500">
                            All sensors are reporting.
                        </p>
                    </div>
                </section>
            </div>
        </section>
    </main>
</template>
