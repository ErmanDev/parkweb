<script>
export default {
  name: 'List',
  props: {
    label: {
      type: String,
      default: 'Slot'
    }
  }
}
</script>

<template>
  <h4 class="m-0 rounded-[0.9rem] bg-slate-100/80 px-4 py-3 font-bold">{{ label }}</h4>
</template>
