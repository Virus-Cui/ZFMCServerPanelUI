<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import {useRoute} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";


const msg = ref([])
const cmd = ref()
const interval = ref()
const loading = ref(false)
const containerId = ref()
const wss = ref()



const startKeepAlive = () => {
  interval.value = setInterval(() => {
    wss.value.send("keepalive")
  }, 1000)
}

const onWebSocketMessage = (event) => {
  let data = JSON.parse(event.data);
  switch (data.type) {
    case 0:
      msg.value.push(data.data)
      break;
    case 2:
      ElMessage.closeAll()
      ElMessage.warning({
        message: data.data
      })
      break;
  }
  setTimeout(() => {
    let doc = document.getElementById("cmd")
    console.log(doc.scrollHeight)
    doc.scrollTop = doc.scrollHeight
  }, 50)

}

const onOpen = () => {
  startKeepAlive()
  loading.value = false
}

const onClose = () => {
  console.log("关闭连接")
  clearInterval(interval.value)
  loading.value = true
  // 重连
  setTimeout(() => {
    wss.value = new WebSocket("ws://127.0.0.1:5200/log/" + containerId.value)
    wss.value.onmessage = onWebSocketMessage
    wss.value.onclose = onClose
    wss.value.onopen = onOpen
  }, 1000)

}

onMounted(() => {
  containerId.value = useRoute().params.id
  console.log(containerId.value)
  wss.value = new WebSocket("ws://127.0.0.1:5200/log/" + containerId.value)
  wss.value.onmessage = onWebSocketMessage
  wss.value.onclose = onClose
  wss.value.onopen = onOpen
})

onUnmounted(()=>{
  wss.value.close()
  console.log("测试销毁")
})



const stop = () => {
  msg.value.push(">"+"stop")
  axios.post("http://127.0.0.1:5200/container/cmd/" + containerId.value, {
    cmd: "stop"
  }).then(resp => {
    ElMessage.error({
      message: '停止成功'
    })
  })
}

const start = () => {
  axios.get("http://127.0.0.1:5200/container/start/" + containerId.value).then(resp => {
    ElMessage.success({
      message: '开启成功'
    })
  })
}

const send = () => {
  msg.value.push(">"+cmd.value)
  axios.post("http://127.0.0.1:5200/container/cmd/" + containerId.value, {
    cmd: cmd.value
  }).then(resp => {
    ElMessage.closeAll("success")
    ElMessage.success({
      message: `发送指令${cmd.value}成功`
    })
  })
}


</script>

<template>

  <div v-loading="loading">
    <el-button type="danger" plain @click="stop">停止实例</el-button>
    <el-button type="primary" plain @click="start">开启实例</el-button>
    <div class="cmdview" id="cmd">
      <div class="line" v-for="item in msg">{{ item }}</div>
    </div>
    <el-form-item style="margin-top: 1rem;">
      <el-input style="width: 200px;margin-right: 1rem" v-model="cmd" placeholder="命令"></el-input>
      <el-button type="warning" @click="send">发送指令</el-button>
    </el-form-item>
  </div>

</template>

<style scoped>
.cmdview {
  color: #FFF;
  width: 1000px;
  height: 400px;
  background: black;
  overflow: auto;
  margin-top: 1rem;
}
</style>