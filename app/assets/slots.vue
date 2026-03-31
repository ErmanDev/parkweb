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
                default: 'available'
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
            }
        }
    }

</script>

<template>
    <div class="h-full min-w-[140px]">
        <div
            :class="[
                'flex flex-col gap-4 rounded-[1.5rem] border border-slate-400/20 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-[14px] xl:min-h-[320px]',
                isOccupied
                    ? 'bg-[linear-gradient(180deg,rgba(254,226,226,0.95),rgba(248,113,113,0.92))]'
                    : 'bg-[linear-gradient(180deg,rgba(240,253,244,0.95),rgba(255,255,255,0.92))]'
                ]"
            >
            <div :class="['slot-frame', isOccupied ? 'slot-occupied' : 'slot-available']">
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <img
                    class="h-[3.75rem] w-[3.75rem] md:h-[4.8rem] md:w-[4.8rem] xl:h-[4rem] xl:w-[4rem]"
                    :src="image"
                    :alt="type + ' slot'"
                />
            </div>

            <div class="flex h-full flex-col justify-between gap-4">
                <h4 class="m-0 text-center text-base font-extrabold text-slate-900">{{ label }}</h4>
            </div>
        </div>
    </div>
</template>
