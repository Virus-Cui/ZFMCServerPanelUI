<script setup>
const h2HURL = 'http://'+window.location.host+'/h2'
</script>

<template>
  <iframe :src="h2HURL" allowfullscreen="true" style="width: 100%;height: 100%"></iframe>
</template>

<style scoped>

</style>