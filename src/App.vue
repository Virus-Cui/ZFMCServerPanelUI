<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

  <RouterView />
</template>

<style scoped>
::-webkit-scrollbar-thumb {
  background-color: #acbdc9;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 1);
}

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background-color: #ebeef5;
}
</style>
