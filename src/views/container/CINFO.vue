<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import {useRoute} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {wsURL} from "@/utils/request.js";
import {sendCommand, startContainer, stopContainer, getOne} from "@/utils/container.js";

const msg = ref([])
const cmd = ref()
const interval = ref()
const loading = ref(false)
const containerId = ref()
const wss = ref()
const commands = ref(['stop', 'gamemode 1'])
const open = ref(false)
const btn1 = ref()
const containerInfo = ref({})

const btnStatus = ref({
  start: true,
  restart: true,
  stop: true
})

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
      nextTick(() => {
        updateContainerStatus()
      })
      break;
  }
  setTimeout(() => {
    let doc = document.getElementById("cmd")
    doc.scrollTop = doc.scrollHeight
  }, 50)

}

const onOpen = () => {
  startKeepAlive()
  loading.value = false
}

const onClose = () => {
  clearInterval(interval.value)
  loading.value = true
  // 重连
  setTimeout(() => {
    wss.value = new WebSocket(wsURL() + "log/" + containerId.value)
    wss.value.onmessage = onWebSocketMessage
    wss.value.onclose = onClose
    wss.value.onopen = onOpen
  }, 1000)

}

const updateContainerStatus = () => {
  getOne(containerId.value).then(resp => {
    containerInfo.value = resp.data.data
    console.log(containerInfo.value)
    if (containerInfo.value.status === 'RUNNING' || containerInfo.value.status === 'STARTING') {
      btnStatus.value.start = true
      btnStatus.value.stop = false
      btnStatus.value.restart = false
    } else if (containerInfo.value.status === 'STOP' || containerInfo.value.status === 'STOPING') {
      btnStatus.value.start = false
      btnStatus.value.stop = true
      btnStatus.value.restart = true
    }
  })
}

onMounted(() => {

  containerId.value = useRoute().params.id
  wss.value = new WebSocket(wsURL() + "log/" + containerId.value)
  wss.value.onmessage = onWebSocketMessage
  wss.value.onclose = onClose
  wss.value.onopen = onOpen
  commands.value = localStorage.getItem("commands")
  open.value = true
  updateContainerStatus()
})

onUnmounted(() => {
  wss.value.close()
})


const stop = () => {
  btnStatus.value.stop = true
  btnStatus.value.restart = true
  stopContainer(containerId.value).then(resp => {
    ElMessage.success({
      message: '关闭成功'
    })
  })
}

const start = () => {
  btnStatus.value.start = true
  startContainer(containerId.value).then(resp => {
    updateContainerStatus()
    ElMessage.success({
      message: '开启成功'
    })
  })
}

const send = () => {
  msg.value.push(">" + cmd.value)

  sendCommand(containerId.value, cmd.value).then(resp => {
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
            <div class="tag">基础信息</div>
            <ul>
              <li>实例名称：<el-tag>{{ containerInfo.containerName }}</el-tag></li>
              <li>实例状态：<el-tag v-if="containerInfo.status === 'RUNNING'" type="success">
                  正在运行
                </el-tag>
                <el-tag v-if="containerInfo.status === 'STARTING'" type="warning">
                  正在启动
                </el-tag>
                <el-tag v-if="containerInfo.status === 'STOP'" type="danger">
                  停止
                </el-tag>
                <el-tag v-if="containerInfo.status === 'STOPING'" type="warning">
                  正在停止
                </el-tag>
              </li>
            </ul>
          </div>
          <div class="btns">
            <el-button ref="btn1" :disabled="btnStatus.start" style="width: 100%;margin-bottom: .5rem;" type="primary"
                       plain @click="start">开启实例
            </el-button>
            <br>
            <el-button ref="btn2" :disabled="btnStatus.restart" style="width: 100%;margin-bottom: .5rem;" type="warning"
                       plain @click="">重新启动
            </el-button>
            <br>
            <el-button ref="btn3" :disabled="btnStatus.stop" style="width: 100%;margin-bottom: .5rem;" type="danger"
                       plain @click="stop">
              停止实例
            </el-button>
            <br>
            <el-button ref="btn4" style="width: 100%;margin-bottom: .5rem;" plain @click="">文件列表</el-button>
          </div>
          <div class="text" style="height: 340px">

          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="17" :lg="19" :xl="19">
        <div v-loading="loading">
          <div class="cmdview-container">
            <div class="tag">控制台</div>

            <div class="cmdview" id="cmd">
              <div class="line" v-for="item in msg"
                   :class="item.includes('INFO]')?'info': item.includes('WARN]')?'warning':'error'" v-html="item"></div>
            </div>
          </div>
          <el-form-item style="margin-top: 1rem;">
            <el-input style="width: 100%;" v-model="cmd" @keydown.enter="send"
                      placeholder="命令（按下enter键发送）"></el-input>
          </el-form-item>
          <el-form-item>
            <!--            <el-tag v-if="commands.length === 0">空</el-tag>-->
            <el-tag style="margin-right: .2rem;cursor: pointer;user-select: none" v-for="item in commands"
                    @click="cmd = item; send()">{{ item }}
            </el-tag>
          </el-form-item>
        </div>
      </el-col>
    </el-row>
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
  //height: 200px;
  margin-bottom: .5rem;
  border-radius: 4px;
  border: 1px solid #4c4d4f;
  box-shadow: 0 0 10px rgba(28 27 27 / 1);
  background: #1c1b1b;
  //backdrop-filter: blur(8px);
  padding: .4rem;
  ul{
    li{
      list-style: none;
      font-size: .8rem;
      margin-bottom: 0.2rem;
    }
  }
}

.cmdview-container {
  background: #1c1b1b;
  border-radius: 8px;
  padding: 1rem;
}

.info {
  color: green;
}

.warning {
  color: #e6a23c;
}

.error {
  color: red;
}

.nomal {

}

.tag{
  position: relative;
  text-indent: 0.5em;
  display: flex;
  align-items: center;
  line-height: 140%;
  margin-bottom: .6rem;
  &::after{
    content: '';
    position: absolute;
    width: 5px;
    height: 100%;
    background: #5eadff;
    left: 0;
    border-radius: 16px;
  }
}
</style>