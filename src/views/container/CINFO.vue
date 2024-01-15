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
const commands = ref(['stop', 'gamemode 1'])
const open = ref(false)
const btn1 = ref()

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
  commands.value = localStorage.getItem("commands")
  open.value = true
})

onUnmounted(() => {
  wss.value.close()
  console.log("测试销毁")
})


const stop = () => {
  msg.value.push(">" + "stop")
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
  msg.value.push(">" + cmd.value)
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
  <div class="info-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="7" :lg="5" :xl="5">
        <div class="left">
          <div class="text">

          </div>

            <div class="btns">
              <el-button ref="btn1" style="width: 100%;margin-bottom: .5rem;" type="primary" plain @click="start">开启实例
              </el-button>
              <br>
              <el-button ref="btn2" style="width: 100%;margin-bottom: .5rem;" type="warning" plain @click="start">重新启动
              </el-button>
              <br>
              <el-button ref="btn3" style="width: 100%;margin-bottom: .5rem;" type="danger" plain @click="stop">
                停止实例
              </el-button>
              <br>
              <el-button ref="btn4" style="width: 100%;margin-bottom: .5rem;" plain @click="start">文件列表</el-button>
            </div>
          <div class="text" style="height: 340px">

          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="17" :lg="19" :xl="19">
        <div v-loading="loading">
          <div class="cmdview-container">
            <div class="cmdview" id="cmd">
              <div class="line" v-for="item in msg" :class="item.includes('INFO]')?'info': item.includes('WARN]')?'warning':'error'" v-html="item"></div>
            </div>
          </div>
          <el-form-item style="margin-top: 1rem;">
            <el-input style="width: 100%;" v-model="cmd" @keydown.enter="send"
                      placeholder="命令（按下enter键发送）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tag v-if="commands.length === 0">空</el-tag>
            <el-tag style="margin-right: .2rem;cursor: pointer;user-select: none" v-for="item in commands"
                    @click="cmd = item; send()">{{ item }}
            </el-tag>
          </el-form-item>
        </div>
      </el-col>
    </el-row>

<!--    <el-tour v-model="open">-->
<!--      <el-tour-step :target="btn1?.$el" title="Upload File">-->
<!--        <div>Put you files here.</div>-->
<!--      </el-tour-step>-->
<!--    </el-tour>-->
  </div>


</template>

<style scoped>
.info-container {
  height: 100%;

}

.cmdview {
  color: #FFF;
  width: 100%;
  height: 600px;
  background: #131212;
  overflow: auto;

}

::-webkit-scrollbar-thumb {
  background-color: #6c6f72;
}

::-webkit-scrollbar-track {
  background: #4c4d4f;
}

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
  background-color: #4c4d4f;
}

.left {
  //background: red;
  height: 100%;
}

.text {
  width: 100%;
  height: 200px;
  margin-bottom: .5rem;
  border-radius: 4px;
  border: 1px solid #4c4d4f;
  box-shadow: 0 0 10px rgba(28 27 27 / 1);
  background: #1c1b1b;
  //backdrop-filter: blur(8px);
}

.cmdview-container {
  background: #1c1b1b;
  border-radius: 8px;
  padding: 1rem;
}
.info{
  color: green;
}

.warning{
  color: #e6a23c;
}

.error{
  color: red;
}
.nomal{

}
</style>