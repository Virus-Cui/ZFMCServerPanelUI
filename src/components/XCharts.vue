<script setup>
import {ref, onMounted} from 'vue'
import * as echarts from 'echarts';

const props = defineProps([
  'width',
  'height',
  'bk-color',
  'darkMode',
  'legend',
  'xaxis',
  'data',
  'id',
  'title'
])

const initChart = () => {
  var chartDom = document.getElementById(props.id);
  var myChart = echarts.init(chartDom, 'dark');
  window.addEventListener("resize",()=>{
    setTimeout(()=>{
      myChart.resize();
    },200)
  })
  var option;
  option = {
    backgroundColor: '',
    title: {
      text: props.title
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: props.legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xaxis
    },
    yAxis: {
      type: 'value'
    },
    series: props.data
  };
  option && myChart.setOption(option);
}

defineExpose({initChart})


</script>

<template>
  <div class="chart" :id="props.id"></div>
</template>

<style scoped>
.chart {
  width: v-bind(props ['width']);
  height: v-bind(props ['height']);
  background-color: v-bind(props ['bk-color']);
}
</style>
