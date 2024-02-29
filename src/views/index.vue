<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import {getAPISpir,getSysInfo} from "@/utils/index.js";
import XCharts from "@/components/XCharts.vue";
import MonacoEditor from 'monaco-editor-vue3'
import {wsURL} from "@/utils/request.js";
import axios from 'axios'


const apis = ref({})
const cpu = ref({})
const mem = ref({})
const container = ref({})
const chartRef = ref()
const chartRef1 = ref()
const chartRef2 = ref()
const chartRef3 = ref()
const destroy = ref(false)
const sysInfo = ref({})

// websocket
const wss = ref()
const interval = ref()
const loading = ref()

const initSip = () => {
  getAPISpir().then(resp => {
    console.log(resp)
    apis.value = resp.data.data.apis
    cpu.value = resp.data.data.cpu
    mem.value = resp.data.data.mem
    container.value = resp.data.data.container
    setTimeout(() => {
      chartRef.value.initChart()
      chartRef1.value.initChart()
      chartRef2.value.initChart()
      chartRef3.value.initChart()
    }, 100)
  })
}

const startKeepAlive = () => {
  interval.value = setInterval(() => {
    wss.value.send("keepalive")
  }, 1000)
}


const onOpen = () => {
  loading.value = false
  startKeepAlive()
  initSip()
}

const onMessage = (event) => {
  switch (JSON.parse(event.data).data) {
    case "UPDATE_CHART":
      initSip()
  }
}

const onClose = () => {
  clearInterval(interval.value)
  loading.value = true
  // 重连
  setTimeout(() => {
    if(destroy.value === false){
      console.log("重连")
      wss.value = new WebSocket(wsURL() + "message")
      wss.value.onmessage = onMessage
      wss.value.onclose = onClose
      wss.value.onopen = onOpen
    }
  }, 1000)
}

onMounted(() => {
  getSysInfo().then(res=>{
    console.log(res)
    sysInfo.value = res.data.data
  })
  destroy.value = false
  wss.value = new WebSocket(wsURL() + "message")
  wss.value.onmessage = onMessage
  wss.value.onopen = onOpen
  wss.value.onclose = onClose

  let formdata = new FormData();
  formdata.append("fileFolder","C:/ZFMCPanel/instanceData/1752133205585764352")
  formdata.append("fileName","frpc.ini")
  axios.post("http://127.0.0.1:5200/file/readFile",formdata).then(resp=>{
    code.value = resp.data.data
  })

})

onUnmounted(() => {
  destroy.value = true
  clearInterval(interval.value)
  console.log("关闭ws")
  wss.value.close()
})


const code = ref("")
const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  readonly: false
}

const open = ref(false)
const editorOpen = ref(false)

const openFun = () => {
  open.value = true
  setTimeout(() => {
    editorOpen.value = true
  }, 100)
}

const type = ref("java")
const closeFun = () => {
  editorOpen.value = false
}


</script>

<template>
  <el-row>
    <el-col :xl="24">
      <div class="tag">系统概况</div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :xl="24">
      <div class="sys-info">
        <el-descriptions>
          <el-descriptions-item label="系统类型">{{ sysInfo.sysType }}</el-descriptions-item>
          <el-descriptions-item label="系统架构">{{ sysInfo.sysArch }}</el-descriptions-item>
          <el-descriptions-item label="运行用户">{{ sysInfo.runUser }}</el-descriptions-item>
          <el-descriptions-item label="内存总量">{{ sysInfo.memTotal }}</el-descriptions-item>
          <el-descriptions-item label="Java运行时版本">{{ sysInfo.jdkVersion }}</el-descriptions-item>
          <el-descriptions-item label="Java路径">{{ sysInfo.javaHome }}</el-descriptions-item>
          <el-descriptions-item label="面板版本">{{ sysInfo.dashboardVersion }}</el-descriptions-item>

        </el-descriptions>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :xl="24">
      <div class="tag">系统监控</div>
    </el-col>
  </el-row>
  <el-row justify="center" align="center">
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <XCharts v-loading="loading" :title="'接口监控'" ref="chartRef" :data="apis.data" :xaxis="apis.xaxis" :legend="apis.legend"
               :id="'aaa'" :width="'100%'"
               :height="'200px'" :dark-mode="true"></XCharts>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <XCharts v-loading="loading" :title="'在线实例'" ref="chartRef3" :data="container.data" :xaxis="container.xaxis" :legend="container.legend"
               :id="'ddd'" :width="'100%'"
               :height="'200px'" :dark-mode="true"></XCharts>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <XCharts v-loading="loading" :title="'CPU占用率'" ref="chartRef1" :data="cpu.data" :xaxis="cpu.xaxis" :legend="cpu.legend"
               :id="'bbb'" :width="'100%'"
               :height="'200px'" :dark-mode="true"></XCharts>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
      <XCharts v-loading="loading" :title="'内存占用率'" ref="chartRef2" :data="mem.data" :xaxis="mem.xaxis" :legend="mem.legend"
               :id="'ccc'" :width="'100%'"
               :height="'200px'" :dark-mode="true"></XCharts>
    </el-col>

  </el-row>


  <el-button @click="openFun">open</el-button>
  <el-dialog
      v-model="open" @open="openFun" title="修改文件" @close="closeFun">
    <template #default>
      <el-form inline>
        <el-form-item label="语言">
          <el-select style="width: 200px" v-model="type" placeholder="选择语言">
            <el-option value="xml">xml</el-option>
            <el-option value="java">java</el-option>
            <el-option value="txt">txt</el-option>
            <el-option value="vue">vue</el-option>
            <el-option value="js">js</el-option>
            <el-option value="ts">ts</el-option>
            <el-option value="properties">properties</el-option>
            <el-option value="yml">yml</el-option>
            <el-option value="yaml">yaml</el-option>
            <el-option value="toml">toml</el-option>
            <el-option value="py">py</el-option>
            <el-option value="cpp">cpp</el-option>
            <el-option value="c">c</el-option>
            <el-option value="h">h</el-option>
            <el-option value="sh">sh</el-option>
            <el-option value="cmd">cmd</el-option>
            <el-option value="bat">bat</el-option>
            <el-option value="json">json</el-option>
            <el-option value="html">html</el-option>
            <el-option value="css">css</el-option>
            <el-option value="sql">sql</el-option>
            <el-option value="config">config</el-option>
            <el-option value="ini">ini</el-option>
            <el-option value="log">log</el-option>
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

<style scoped lang="scss">
.tag{
  width: 100%;
  height: 2.5rem;
  //background: red;
  border-radius: 8px;
  background: #272828;
  display: flex;
  align-items: center;
  text-indent: 1em;
  margin-bottom: 1rem;
  border: 1px solid #484753;
  &:hover {

  }
}
.sys-info{
  height: 200px;
  border: 1px solid #484753;
  margin-bottom: 1rem;
  padding: 1rem;
}
</style>
