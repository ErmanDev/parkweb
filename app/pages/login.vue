<script>
    export default {
        data() {
            return {
                isLogin: true,
                username: "",
                password: "",
                confirmPassword: ""
            }
        },

        methods: {
            submit() {
                if(this.isLogin) {
                    alert(`Login:\n${this.username} / ${this.password}`)
                } else {
                    if (this.password !== this.confirmPassword) {
                        alert("Password do not match")
                        return
                    }
                    alert(`Registered:\n${this.username}`)
                }
            }
        }
    }
</script>

<template>
    <header class="flex flex-col gap-1 bg-[length:160%_160%] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] px-4 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] animate-[gradientMove_12s_ease_infinite] md:px-6">
            <p class="m-0 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/70 xl:text-lg">ACLC Campus</p>
            <h1 class="m-0 text-[clamp(1.75rem,4vw,2.6rem)] leading-[0.95] text-white">Parking Slots</h1>
    </header>

    <div class="flex flex-col md:flex-row items-center gap-5 md:gap-20 mt-2 md:mt-[60px] md:px-10 justify-center">
        <img src="/images/aclc-logo.png" class="w-full max-w-30 md:max-w-[40rem] md:mb-16 p-5 pb-0" alt="ACLC logo">

        <div class="w-full max-w-sm bg-white p-6 md:pb-10 rounded-2xl shadow-lg">

            <h2 class="text-xl md:text-3xl font-bold text-center mb-4 text-blue-800">
                {{ isLogin ? 'Login' : 'Register' }}
            </h2>

            <div class="flex mb-6 border rounded-lg overflow-hidden">
                <button
                    @click="isLogin = true"
                    :class="[
                        'w-1/2 py-2 font-semibold',
                        isLogin ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                    ]"
                >Login</button>

                <button
                    @click="isLogin = false"
                    :class="[
                        'w-1/2 py-2 font-semibold',
                        !isLogin ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'
                    ]"
                >Register</button>
            </div>

            <form @submit.prevent="submit" class="flex flex-col gap-3">
                <!-- USERNAME -->
                <input 
                    v-model="username"
                    type="text" 
                    placeholder="Username" 
                    class="px-3 py-2 border rounded-lg"
                />
                <!-- PASSWORD -->
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    class="px-3 py-2 border rounded-lg"
                />

                <!-- Only for register -->
                <input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    class="px-3 py-2 border rounded-lg"
                    :class="!isLogin ? 'visible' : 'invisible'"
                />

                <button
                    type="submit"
                    class="mt-2 md:mt-10 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                    {{ isLogin ? 'Login' : 'Register' }}
                </button>
            </form>
        </div>
    </div>
</template>