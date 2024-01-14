<script setup>
import {useRouter} from "vue-router";
import {ref, onMounted} from 'vue'
import {getAll} from "@/utils/container.js";

const router = useRouter();
const open = ref()
const containerName = ref("")
const style = ref(false)
const selection = ref([])
const disable = ref(true)

const jump = () => {
  router.push({
    path: "/container/1745813134574202880"
  })
}
const pageData = ref({})

onMounted(() => {
  search(1)
})

const search = (page) => {
  getAll(page, containerName.value).then(res => {
    pageData.value = res.data.data
    console.log(pageData)
  })
}

const naviToControl = (id) => {
  router.push({
    path: `/container/${id}`
  })
}

const handleSelectionChange = (val) => {
  selection.value = val
  disable.value = val.length === 0;
}

const openContainers = () => {
  selection.value
}


</script>

<template>
  <div class="container-box">
    <div class="topbtn">
      <el-button type="primary" plain>新建实例</el-button>
      <el-button type="primary" plain :disabled="disable" @click="openContainers">开启实例</el-button>
      <el-button type="danger" plain :disabled="disable" @click="delContainer">删除实例</el-button>
    </div>
    <div class="table">
      <el-table :data="pageData.pageData" height="730" @selectionChange="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="containerId" label="实例ID"></el-table-column>
        <el-table-column prop="containerName" label="实例名称"></el-table-column>
        <el-table-column prop="workdir" label="工作目录"></el-table-column>
        <el-table-column prop="cmd" label="启动命令"></el-table-column>
        <el-table-column prop="stopCmd" label="停止命令"></el-table-column>
        <el-table-column prop="pid" label="PID"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'RUNNING'" type="success">
              正在运行
            </el-tag>
            <el-tag v-if="scope.row.status === 'STARTING'" type="warning">
              正在启动
            </el-tag>
            <el-tag v-if="scope.row.status === 'STOP'" type="danger">
              停止
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #header>
            <el-input size="small" v-model="containerName" @blur="search(1)" @keydown.enter="search(1)"
                      placeholder="请输入实例名称(按下Enter搜索)"></el-input>
          </template>
          <template #default="scope">
            <el-button type="warning" plain size="small">修改</el-button>
            <el-button type="danger" plain size="small">删除</el-button>
            <el-button type="primary" plain size="small" @click="naviToControl(scope.row.containerId)">控制面板
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination layout="prev, pager, next" :total="pageData.total" page-size="10" @current-change="search"/>
    </div>

    <div class="newContainerDialog">
      <el-dialog
          v-model="open"
          title="Tips"
          width="30%"
      >
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="">取消</el-button>
        <el-button type="primary" @click="">
          确定
        </el-button>
      </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.table {
  margin-top: 1rem;
}

.page {
  display: flex;
  justify-content: right;
}
</style>