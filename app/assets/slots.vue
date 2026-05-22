<script>
    export default {
        name: 'Slot',
        props: {
            type: {
                type: String,
                default: 'car' // or 'motor'
            },
            label: {
                type: String,
                default: 'Slot'
            },
            status: {
                type: String,
                default: 'available' // 'available' | 'occupied' | 'unavailable'
            }
        },
        computed: {
            isMotor() {
                return this.type === 'motor'
            },
            image() {
                return this.isMotor ? '/images/motor-logo1.png' : '/images/car-logo1.png'
            },
            isOccupied() {
                return this.status === 'occupied'
            },
            isUnavailable() {
                return this.status === 'unavailable'
            },
            cardClass() {
                if (this.isUnavailable) {
                    return 'bg-[linear-gradient(180deg,rgba(241,245,249,0.95),rgba(203,213,225,0.92))]'
                }
                if (this.isOccupied) {
                    return 'bg-[linear-gradient(180deg,rgba(254,226,226,0.95),rgba(248,113,113,0.92))]'
                }
                return 'bg-[linear-gradient(180deg,rgba(240,253,244,0.95),rgba(255,255,255,0.92))]'
            },
            frameClass() {
                if (this.isUnavailable) return 'slot-unavailable'
                if (this.isOccupied) return 'slot-occupied'
                return 'slot-available'
            },
            statusLabel() {
                if (this.isUnavailable) return 'Unavailable'
                if (this.isOccupied) return 'Occupied'
                return 'Available'
            }
        }
    }

</script>

<template>
    <div class="h-full min-w-[140px]">
        <div
            :class="[
                'flex flex-col gap-4 rounded-[1.5rem] border border-slate-400/20 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] xl:min-h-[320px]',
                cardClass,
                isUnavailable ? 'opacity-90' : ''
            ]"
            >
            <div :class="['slot-frame', frameClass]">
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <img
                    :class="[
                        'h-[3.75rem] w-[3.75rem] md:h-[4.8rem] md:w-[4.8rem] xl:h-[4rem] xl:w-[4rem]',
                        isUnavailable ? 'grayscale opacity-60' : ''
                    ]"
                    :src="image"
                    :alt="type + ' slot'"
                />
            </div>

            <div class="flex h-full flex-col justify-between gap-1">
                <h4 class="m-0 text-center text-base font-extrabold text-slate-900">{{ label }}</h4>
                <p
                    :class="[
                        'm-0 text-center text-xs font-semibold uppercase tracking-[0.14em]',
                        isUnavailable ? 'text-slate-500' : isOccupied ? 'text-rose-700' : 'text-emerald-700'
                    ]"
                >{{ statusLabel }}</p>
            </div>
        </div>
    </div>
</template>
