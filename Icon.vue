<template>
  <i :class="`ui-icon-${name}`" @click="handleClick"></i>
</template>

<script>
  export default {
    name: 'UiIcon',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    methods: {
      handleClick (e) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style>
</style>