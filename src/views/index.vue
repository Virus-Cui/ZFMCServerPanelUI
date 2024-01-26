<script setup>
import {ref, onMounted} from 'vue'
import {getAPISpir} from "@/utils/index.js";
import XCharts from "@/components/XCharts.vue";

const data = ref([])
const xaxis = ref([])
const legend = ref([])
const chartRef = ref()

onMounted(() => {
  getAPISpir().then(resp => {
    console.log(resp)
    data.value = resp.data.data.data
    xaxis.value = resp.data.data.xaxis
    legend.value = resp.data.data.types
    setTimeout(()=>{
      chartRef.value.initChart()
    },100)
  })
})

</script>

<template>
  <XCharts ref="chartRef" :data="data" :xaxis="xaxis" :legend="legend" :id="'aaa'" :width="'800px'" :height="'400px'" :dark-mode="true"></XCharts>
</template>

<style scoped>
</style>