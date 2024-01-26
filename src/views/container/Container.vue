<script setup>
import {useRouter} from "vue-router";
import {ref, onMounted} from 'vue'
import {
  getAll,
  createContainer,
  delContainer,
  deleteBatch,
  updateContainer,
  startBatch,
  stopBatch
} from "@/utils/container.js";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import XUploader from "@/components/XUploader.vue";
import {unzip} from "@/utils/upload.js";

const router = useRouter();
const open = ref()
const containerName = ref("")
const style = ref(false)
const selection = ref([])
const disable = ref(true)
const btnStatus = ref(false)
const modul = ref(0)


const rules = ref({
  containerName: [
    {required: true, message: '实例名称不能为空', trigger: 'blur'},
  ],
  cmd: [
    {required: true, message: '启动命令不能为空', trigger: 'blur'},
  ],
  stopCmd: [
    {required: true, message: '停止命令不能为空', trigger: 'blur'}
  ]
})
// 上传文件
// 新实例目录位置
const newContainerPath = ref()
// 实例ID
const containerId = ref()
// 进度条
const percent = ref(0)
// 是否显示进度条
const enableProgres = ref(false)
const pageData = ref({})

const ruleFormRef = ref()
const uploaderRef = ref()
const rowStyle = () => {
  return "height: 60px"
}

onMounted(() => {
  search(1)
})

const search = (page) => {
  getAll(page, containerName.value).then(res => {
    pageData.value = res.data.data
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

const upload = () => {
  uploadRef.value.submit();
}

const submit = () => {
  // 表单验证
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      ElNotification.success({
        message: '成功'
      })

      btnStatus.value = true
      // 生成实例
      createContainer(formdata.value).then(resp => {
        containerId.value = resp.data.data.containerId
        newContainerPath.value = resp.data.data.workdir
        // 上传文件
        if (uploaderRef.value.checkFile()) {
          enableProgres.value = true
          uploaderRef.value.submit()
        } else {
          ElMessage.warning({
            message: '请选择文件'
          })
        }
      })
    } else {

    }
  })

}

const percentLis = (per) => {
  percent.value = per;
  if (per === 100) {
    // 解压文件
    if (formdata.value.model == '上传压缩包') {
      let fileName = uploaderRef.value.getFileName();
      let formData = new FormData();
      formData.append("fileName", fileName.value)
      formData.append("containerId", containerId.value)
      unzip(formData)
    }

  }
}

const delContainerFun = (id) => {
  ElMessageBox.confirm('此操作将会永久删除实例<br/>注意：不会删除实例数据', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true
  }).then(() => {
    delContainer(id).then(resp => {
      search(1)
    })
  }).catch(() => {

  })

}

const uploadSuccess = () => {
  percent.value = 100
  setTimeout(() => {
    enableProgres.value = false
    open.value = false
    formdata.value = {}
    formdata.value.model = '上传单个服务端文件'
    percent.value = 0
    btnStatus.value = false
    search(1);
  }, 1000)
}

const deleteBatchFun = () => {
  let ids = []
  for (let i = 0; i < selection.value.length; i++) {
    ids.push(selection.value[i].containerId)
  }

  // console.log(ids)

  ElMessageBox.confirm('此操作将会永久删除实例<br/>注意：不会删除实例数据', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true
  }).then(() => {
    deleteBatch(ids).then(resp => {
      search(1)
    })
  }).catch(() => {

  })
}

const openUpdate = (data) => {
  modul.value = 1;
  open.value = true
  formdata.value = data
}

const closeDialog = () => {
  modul.value = 0;
  open.value = false
  formdata.value = {}
  formdata.value.model = '上传单个服务端文件'
}

const update = () => {
  updateContainer(formdata.value).then(resp => {
    modul.value = 0
    open.value = false
    search(1)
  }).catch(err => {

  })
}

const startBatchFun = () => {
  let ids = []
  for (let i = 0; i < selection.value.length; i++) {
    ids.push(selection.value[i].containerId)
  }
  startBatch(ids)
}

const stopBatchFun = ()=>{
  let ids = []
  for (let i = 0; i < selection.value.length; i++) {
    ids.push(selection.value[i].containerId)
  }
  stopBatch(ids)
}

</script>

<template>
  <div class="container-box">
    <div class="topbtn">
      <el-button type="primary" plain @click="open=true">新建实例</el-button>
      <el-button type="danger" plain :disabled="disable" @click="deleteBatchFun">删除实例</el-button>
      <el-button type="primary" plain :disabled="disable" @click="startBatchFun">开启实例</el-button>
      <el-button type="danger" plain :disabled="disable" @click="stopBatchFun">关闭实例</el-button>
    </div>
    <div class="table">
      <el-table :data="pageData.pageData" height="65vh" @selectionChange="handleSelectionChange" :row-style="rowStyle">
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
            <el-tag v-if="scope.row.status === 'STOPING'" type="warning">
              正在停止
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #header>
            <el-input size="small" v-model="containerName" @blur="search(1)" @keydown.enter="search(1)"
                      placeholder="请输入实例名称(按下Enter搜索)"></el-input>
          </template>
          <template #default="scope">
            <el-button type="warning" plain size="small" @click="openUpdate(scope.row)">修改</el-button>
            <el-button type="danger" plain size="small" @click="delContainerFun(scope.row.containerId)">删除</el-button>
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
          draggable
          @close="closeDialog"
      >
        <template #default>
          <el-form label-width="80px" :model="formdata" :rules="rules" status-icon ref="ruleFormRef">
            <el-form-item v-if="modul !== 0" label="实例ID">
              <el-input disabled v-model="formdata.containerId"></el-input>
            </el-form-item>
            <el-form-item label="模式" v-if="modul === 0">
              <el-radio-group v-model="formdata.model" size="large">
                <el-radio-button label="上传单个服务端文件"/>
                <el-radio-button label="上传压缩包"/>
                <el-radio-button label="文件已存在"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实例名称" prop="containerName">
              <el-input v-model="formdata.containerName" placeholder="请输入实例名称"></el-input>
            </el-form-item>
            <el-form-item label="启动命令" prop="cmd">
              <el-input v-model="formdata.cmd" placeholder="请输入启动命令"></el-input>
            </el-form-item>
            <el-form-item label="终止命令" prop="stopCmd">
              <el-input v-model="formdata.stopCmd" placeholder="请输入终止命令"></el-input>
            </el-form-item>
            <el-form-item label="上传文件(.jar/.exe)" v-if="formdata.model === '上传单个服务端文件' && modul === 0">
              <XUploader ref="uploaderRef" :path="newContainerPath" :percent-event="percentLis" :auto-upload="false"
                         :file-types="['jar','exe']" :container-id="containerId"
                         :upload-success-event="uploadSuccess"
              >
                <template #trigger>
                  <el-button id="button" type="primary" plain>选择文件</el-button>
                </template>
              </XUploader>
            </el-form-item>
            <el-form-item label="上传文件(.zip/.rar)" v-if="formdata.model === '上传压缩包' && modul === 0">
              <XUploader ref="uploaderRef" :path="newContainerPath" :percent-event="percentLis" :auto-upload="false"
                         :file-types="['zip','tar','gz','7z','rar']" :container-id="containerId"
                         :upload-success-event="uploadSuccess"
              >
                <template #trigger>
                  <el-button id="button" type="primary" plain>选择文件</el-button>
                </template>
              </XUploader>
            </el-form-item>
            <el-form-item label="文件目录" v-if="formdata.model === '文件已存在'">
              <el-input v-model="formdata.workdir" placeholder="请输入实例文件目录"></el-input>
            </el-form-item>
            <el-form-item label="配置项" v-if="modul === 0">
              <el-checkbox label="自动启动" v-model="formdata.autoStart"></el-checkbox>
            </el-form-item>
          </el-form>
          <el-progress v-show="enableProgres" :percentage="percent"></el-progress>
        </template>
        <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="btnStatus" @click="closeDialog" plain>取消</el-button>
        <el-button :disabled="btnStatus" type="primary" @click="submit" plain v-if="modul === 0">
          创建
        </el-button>
        <el-button :disabled="btnStatus" type="primary" @click="update" plain v-else>
          修改
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

::v-deep .el-dialog {
  min-width: 600px;
}
</style>
