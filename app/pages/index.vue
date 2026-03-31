<script>
    import Slot from '~/assets/slots.vue'
    import List from '~/assets/list.vue'

    export default {
        components: {
            Slot,
            List
        },
        data() {
            return {
                profileMenuOpen: false,
                slots: [
                    { label: 'SLOT 1', type: 'car', status: 'available' },
                    { label: 'SLOT 2', type: 'car', status: 'occupied' },
                    { label: 'SLOT 3', type: 'motor', status: 'available' },
                    { label: 'SLOT 4', type: 'motor', status: 'occupied' }
                ]
            }
        },
        computed: {
            availableSlots() {
                return this.slots.filter((slot) => slot.status === 'available')
            },
            occupiedSlots() {
                return this.slots.filter((slot) => slot.status === 'occupied')
            }
        },
        methods: {
            toggleProfileMenu() {
                this.profileMenuOpen = !this.profileMenuOpen
            },
            closeProfileMenu() {
                this.profileMenuOpen = false
            }
        }
    }
</script>

<template>
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(62,99,255,0.12),transparent_34%),linear-gradient(180deg,#eef4ff_0%,#f8fafc_42%,#eef2ff_100%)] text-slate-900 ">
        <header class="flex flex-col gap-4 bg-[length:160%_160%] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] px-4 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] animate-[gradientMove_12s_ease_infinite] md:px-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/70 xl:text-lg">ACLC Campus</p>
                    <h1 class="m-0 text-[clamp(1.75rem,4vw,2.6rem)] leading-[0.95] text-white">Parking Slots</h1>
                </div>

                <div class="flex flex-wrap items-center justify-end gap-3">
                    <h2 class="m-0 cursor-default text-[0.95rem] tracking-[0.08em] text-white xl:text-2xl">USERNAME</h2>
                    <div class="relative">
                        <div
                            type="button"
                            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-2 py-1 pl-1"
                            :aria-expanded="profileMenuOpen ? 'true' : 'false'"
                            aria-label="Toggle profile menu"
                            @click="toggleProfileMenu"
                        >
                            <img src="/images/user-pfp.png" class="block h-8 w-8 shrink-0 rounded-full object-cover xl:min-w-16 xl:min-h-16" alt="profile">
                            <span
                                :class="[
                                    'h-2 w-2 border-b-2 border-r-2 border-white/90 transition-transform duration-150 xl:h-5 xl:w-5 xl:border-b-[5px] xl:border-r-[5px] xl:p-3',
                                    profileMenuOpen ? '-rotate-[135deg] -translate-y-px' : 'rotate-45 -translate-y-px'
                                ]"
                            ></span>
                        </div>

                        <div
                            v-if="profileMenuOpen"
                            class="absolute right-0 top-[calc(100%+0.5rem)] z-20 grid min-w-[11rem] gap-1.5 rounded-md border border-slate-200 bg-slate-100 p-2 xl:p-5 text-left shadow-[0_18px_40px_rgba(15,23,42,0.32)]"
                        >
                            <a href="#" class="block rounded-sm px-3 py-2.5 text-sm xl:text-xl font-semibold tracking-[0.03em] text-slate-950 no-underline transition hover:bg-black/10" @click="closeProfileMenu">Profile</a>
                            <a href="#" class="block rounded-sm px-3 py-2.5 text-sm xl:text-xl font-semibold tracking-[0.03em] text-slate-950 no-underline transition hover:bg-black/10" @click="closeProfileMenu">Settings</a>
                            <a href="#" class="block rounded-sm px-3 py-2.5 text-sm xl:text-xl font-semibold tracking-[0.03em] text-rose-500 no-underline transition hover:bg-black/10" @click="closeProfileMenu">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="grid gap-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <section id="overview" class="px-4 pt-8 md:px-12">
                <div class="flex items-center justify-center w-full">
                    <img src="/images/aclc-logo.png" class="w-full max-w-80 md:max-w-[30rem] pb-6" alt="ACLC logo">
                </div>

                <section id="location" class="relative overflow-hidden rounded-[1.5rem] border border-slate-400/20 bg-transparent shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px]">
                    <div class="campus-map min-h-[15rem] bg-cover bg-center md:min-h-[18rem] xl:min-h-[450px]"></div>
                    <div class="absolute bottom-0 w-full bg-[linear-gradient(180deg,rgba(15,23,42,0.68),rgba(30,41,59,0.2))] px-4 py-4 pb-5">
                        <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-400 xl:text-2xl">Location</p>
                        <p class="mt-1 text-[1.15rem] text-white xl:text-xl">TS Building</p>
                        <p class="mt-2 text-[1rem] leading-6 text-slate-200/90 xl:text-xl">
                            3535 Sayre Hwy, Hangkol,<br>
                            Valencia City, 8709 Bukidnon
                        </p>
                    </div>
                </section>
            </section>

            <section id="board" class="grid w-full gap-5 overflow-x-auto border border-slate-400/20 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] lg:p-6">
                <div class="flex flex-col gap-2">
                    <div>
                        <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-blue-600 xl:text-xl">Slot overview</p>
                        <h3 class="mt-1 text-[clamp(1.5rem,3vw,2rem)] text-slate-900 xl:text-5xl">Live parking board</h3>
                    </div>
                    <p class="m-0 leading-6 text-slate-600 xl:text-xl">Updated for both car and motorcycle parking spaces.</p>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:h-[400px] xl:text-2xl">
                    <Slot
                        v-for="slot in slots"
                        :key="slot.label"
                        :type="slot.type"
                        :label="slot.label"
                        :status="slot.status"
                    />
                </div>

                <div class="flex flex-col lg:flex-row gap-4">
                    <section class="border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] w-full lg:w-1/2">
                        <div class="flex items-center gap-3.5">
                            <img src="/images/check.png" class="h-8 w-8" alt="available">
                            <div>
                                <h4 class="text-[1.15rem] text-slate-900 xl:text-2xl">Available Slots</h4>
                                <p class="m-0 leading-6 text-slate-600 xl:text-lg">Open spaces ready for entry.</p>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-col w-full gap-[0.55rem] xl:text-xl">
                            <List
                                v-for="slot in availableSlots"
                                :key="slot.label"
                                :label="slot.label"
                                class="text-blue-950"
                            />
                        </div>
                    </section>

                    <section class="border border-slate-400/20 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] w-full lg:w-1/2">
                        <div class="flex items-center gap-3.5">
                            <img src="/images/occupied.png" class="h-8 w-8" alt="occupied">
                            <div>
                                <h4 class="text-[1.15rem] text-slate-900 xl:text-2xl">Occupied Slots</h4>
                                <p class="m-0 leading-6 text-slate-600 xl:text-lg">Currently in use and unavailable.</p>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-col w-full gap-[0.55rem] xl:text-xl">
                            <List
                                v-for="slot in occupiedSlots"
                                :key="slot.label"
                                :label="slot.label"
                                class="text-slate-700"
                            />
                        </div>
                    </section>
                </div>
            </section>
        </main>
    </div>
</template>
