<template />

<script>
export default {
  data() {
    return {}
  },
  created() {
    this.$router.replace({
      path: this.$route.query.path
    })
  },
  mounted() {
  },
  methods: {}
}
</script>

<style>

</style>
