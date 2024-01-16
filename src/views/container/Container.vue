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
const uploadRef = ref()

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

const formdata = ref({
  model: '上传单个服务端文件'
})

const upload = ()=>{
  uploadRef.value.submit();
}

const submit = ()=>{
  // 生成实例

  // 上传文件
  uploadRef.value.submit()
}


</script>

<template>
  <div class="container-box">
    <div class="topbtn">
      <el-button type="primary" plain @click="open=true">新建实例</el-button>
      <el-button type="primary" plain :disabled="disable" @click="openContainers">开启实例</el-button>
      <el-button type="danger" plain :disabled="disable" @click="delContainer">删除实例</el-button>
    </div>
    <div class="table">
      <el-table :data="pageData.pageData" height="65vh" @selectionChange="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="containerId" label="实例ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="containerName" label="实例名称"></el-table-column>
        <el-table-column prop="workdir" label="工作目录" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cmd" label="启动命令" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stopCmd" label="停止命令" show-overflow-tooltip></el-table-column>
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
        <el-table-column label="操作" width="300">
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
          title="新建实例"
          width="30%"
      >
        <template #default>
          <el-form>
            <el-form-item>
              <el-radio-group v-model="formdata.model" size="large">
                <el-radio-button label="上传单个服务端文件"/>
                <el-radio-button label="上传压缩包"/>
                <el-radio-button label="文件已存在"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实例名称">
              <el-input v-model="formdata.containerName" placeholder="请输入实例名称"></el-input>
            </el-form-item>
            <el-form-item label="启动命令">
              <el-input v-model="formdata.cmd" placeholder="请输入启动命令"></el-input>
            </el-form-item>
            <el-form-item label="上传文件(.jar/.exe)" v-if="formdata.model === '上传单个服务端文件'">
              <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  action="http://127.0.0.1:5200/container/uploadFile/1"
                  :limit="1"
                  :auto-upload="false"
              >
                <template #trigger>
                  <el-button plain type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传文件(.zip/.rar)" v-if="formdata.model === '上传压缩包'">
              <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  action="http://127.0.0.1:5200/container/uploadFile/2"
                  :limit="1"
                  :auto-upload="false"
              >
                <template #trigger>
                  <el-button plain type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="文件目录" v-if="formdata.model === '文件已存在'">
              <el-input placeholder="请输入实例文件目录"></el-input>
            </el-form-item>


          </el-form>
        </template>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="" plain>取消</el-button>
        <el-button type="primary" @click="submit" plain>
          创建
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