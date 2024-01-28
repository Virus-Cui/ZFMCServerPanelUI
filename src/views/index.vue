<script setup>
import {ref, onMounted} from 'vue'
import {getAPISpir} from "@/utils/index.js";
import XCharts from "@/components/XCharts.vue";
import MonacoEditor from 'monaco-editor-vue3'


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
    setTimeout(() => {
      chartRef.value.initChart()
    }, 100)
  })
})


const code = ref("package cn.mrcsh.zfmcserverpanelapi.entity.vo;\n" +
    "\n" +
    "import lombok.Data;\n" +
    "\n" +
    "import java.util.Collection;\n" +
    "import java.util.List;\n" +
    "import java.util.Queue;\n" +
    "\n" +
    "@Data\n" +
    "public class EchartsVo {\n" +
    "\n" +
    "    private List<String> xAxis;\n" +
    "    private List<String> types;\n" +
    "    private List<DataStructure> data;\n" +
    "\n" +
    "    @Data\n" +
    "    public static class DataStructure {\n" +
    "        private String name;\n" +
    "        private String type;\n" +
    "        private String areaStyle = \"\";\n" +
    "        private Queue<Integer> data;\n" +
    "    }\n" +
    "}\n")
const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  readonly: false
}

const open = ref(false)
const editorOpen = ref(false)

const openFun = ()=>{
  open.value = true
  setTimeout(()=>{
    editorOpen.value = true
  },100)
}

const type = ref("java")
const closeFun = ()=>{
  editorOpen.value = false
}

</script>

<template>
  <XCharts :title="'接口监控'" ref="chartRef" :data="data" :xaxis="xaxis" :legend="legend" :id="'aaa'" :width="'800px'"
           :height="'400px'" :dark-mode="true"></XCharts>
  <el-button @click="openFun">open</el-button>
  <el-dialog
  v-model="open" @open="openFun" title="修改文件" @close="closeFun">
    <template #default>
      <el-form inline>
        <el-form-item label="语言">
          <el-select style="width: 200px" v-model="type" placeholder="选择语言">
            <el-option value="java">java</el-option>
            <el-option value="python">python</el-option>
            <el-option value="go">go</el-option>
            <el-option value="vue">vue</el-option>
            <el-option value="javascript">javascript</el-option>
            <el-option value="typescript">typescript</el-option>
            <el-option value="css">css</el-option>
            <el-option value="jsx">jsx</el-option>
            <el-option value="tsx">tsx</el-option>
            <el-option value="yaml">yaml</el-option>
            <el-option value="toml">toml</el-option>
            <el-option value="text">text</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <MonacoEditor
          v-if="editorOpen"
          theme="auto"
          :options="options"
          :language="type"
          :width="'100%'"
          :height="500"
          v-model:value="code"
      ></MonacoEditor>
    </template>
  </el-dialog>


</template>

<style scoped>
</style>
