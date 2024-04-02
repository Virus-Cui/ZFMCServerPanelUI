<script setup>
import XUploader from "@/components/XUploader.vue";
import {getRoots, getChildrenFile, getParentFile, readFile, updateFile} from "@/utils/file.js";
import {ref, onMounted} from "vue";
import MonacoEditor from "monaco-editor-vue3";
import message from '@/utils/message.js'

const tbData = ref()
const nowFolder = ref([])
const code = ref()
const tags = ref([])
const filePath = ref('')

const updateCache = ()=>{

  localStorage.setItem("folder", nowFolder.value[nowFolder.value.length-1] === undefined ? '':nowFolder.value[nowFolder.value.length-1])
}

const initFolder = ()=>{
  let folder = localStorage.getItem("folder")
  if(folder == ''){
    getRoots().then(resp => {
      tbData.value = resp.data.data
    })
  }else {
    nowFolder.value.push(folder)
    getChildrenFile(folder).then(resp => {
      tbData.value = resp.data.data
    })
    try {
      tags.value = folder.split("\\")
      if(tags.value.length<=1){
        tags.value = folder.split("/")
      }
    }catch (e){
      tags.value = []
    }
  }
  if(tags.value[tags.value.length-1] == ''){
    tags.value.pop()
  }
}

const keyEvent = async (event)=>{
  switch (event.keyCode){
    case 83:
      console.log('ctrl + s')
        // 保存
      updateFile(filePath.value, code.value).then(resp=>{
        message.success("保存成功")
      })
      event.preventDefault()
      event.returnValue = false // 阻止直接保存网页
      break
  }
}

const initKeyMode = ()=>{
  window.addEventListener('keydown', keyEvent)
}

const disableKeyMode = ()=>{
  window.removeEventListener('keydown', keyEvent)
}

onMounted(() => {
  initFolder()
})

const closeFun = () => {
  editorOpen.value = false
  open.value = false
  disableKeyMode()
}
const openFun = () => {
  open.value = true
  setTimeout(() => {
    editorOpen.value = true
    initKeyMode()
  }, 100)
}

const readFileFun = (row)=>{
  if(row.fileType === 'FOLDER'){
    message.error("文件夹无法读取")
    return
  }

  let fileType = row.filePath.substring(row.filePath.lastIndexOf(".")+1, row.filePath.length)
  type.value = fileType
  readFile(row.filePath).then(resp => {
    code.value = resp.data.data
    filePath.value = row.filePath
    openFun()
  }).catch(err=>{
    message.error(err.data.msg)
  });
}

const getChildrenFileFun = (row, column, event) => {
  if (row.fileType === 'FOLDER') {
    console.log(row.filePath)
    console.log(row.filePath.split("\\"))
    tags.value = row.filePath.split("\\")
    if(tags.value.length<=1){
      tags.value = nowFolder.value[nowFolder.value.length - 1].split("/")
    }
    if(tags.value[tags.value.length-1] == ''){
      tags.value.pop()
    }
    nowFolder.value.push(row.filePath)
    localStorage.setItem("nowFolder", row.filePath)
    getChildrenFile(row.filePath).then(resp => {
      updateCache()
      tbData.value = resp.data.data
    })
  } else {
    readFileFun(row)
  }

}
const navigateToRoot = ()=>{
  getRoots().then(resp => {
    tbData.value = resp.data.data
    nowFolder.value = []
    tags.value = []
    updateCache()
  })
}

const getPrevious = () => {
  if (nowFolder.value.length === 0) {
    message.error('没有父级')
    return
  }
  getParentFile(nowFolder.value[nowFolder.value.length - 1]).then(resp => {
    try {
      tags.value = nowFolder.value[nowFolder.value.length - 1].split("\\")
      if(tags.value.length<=1){
        tags.value = nowFolder.value[nowFolder.value.length - 1].split("/")
      }
    }catch (e){
      tags.value = []
    }
    tbData.value = resp.data.data
    if(tags.value.length === 0){
      navigateToRoot()
    }
    updateCache()
  })
  nowFolder.value.pop();
}
const open = ref(false)
const editorOpen = ref(false)
const type = ref("")

const options = {
  colorDecorators: true,
  lineHeight: 24,
  tabSize: 2,
  readonly: false
}

const navigateToPath = (index)=>{
  let pathPart = []
  for (let i = 0; i < index+1; i++) {
    pathPart.push(tags.value[i])
  }
  tags.value = pathPart
  let path = pathPart.join("/");
  if(path.split('')[path.split('').length-1] !== '/' || path.split('')[path.split('').length-1] !== '\\'){
    path+='/'
  }
  getChildrenFile(path).then(resp => {
    updateCache()
    tbData.value = resp.data.data
  })
}

const updateFileFun = ()=>{
  updateFile(filePath.value, code.value).then(resp=>{
    console.log(resp)
    closeFun()
    message.success("保存成功")
  })
}







</script>

<template>
  <div class="file-container">
    <div class="explorer">
      <div class="top-bar">
        <div class="left">
          <div class="item" @click="getPrevious"><i class="iconfont icon-arrowleft"></i></div>
        </div>
        <div class="right">
          <div>
            <div class="item border" @click="navigateToRoot"><i class="iconfont icon-server"></i></div>
            <div class="item">></div>
          </div>
          <div>
            <div class="item border" @click="navigateToRoot">根目录</div>
            <div class="item" v-if="tags.length !== 0">></div>
          </div>
          <div v-for="(item,index) in tags">
            <div class="item border" @click="navigateToPath(index)">{{ item }}</div>
            <div class="item" v-if="index !== tags.length-1">></div>
          </div>
        </div>
      </div>
      <div class="file-desc">
        <el-table :data="tbData" @row-click="getChildrenFileFun" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column show-overflow-tooltip label="文件名称" prop="fileName">
            <template #default="scope">
              <span> {{ scope.row.fileName }} </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="文件位置" prop="filePath"/>
          <el-table-column label="文件大小" prop="fileSize"/>
          <el-table-column label="文件类型" prop="fileType"/>
          <el-table-column label="权限" prop="filePermissions"/>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button plain size="small" type="primary" @click.stop="readFileFun(scope.row)">编辑</el-button>
              <el-button plain size="small" type="success">下载</el-button>
              <el-button plain size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
        draggable
        v-model="open" @open="openFun" title="修改文件" @close="closeFun">
      <template #default>
        <MonacoEditor
            v-if="editorOpen"
            theme="auto"
            :options="options"
            :language="type==='yml'?'yaml':type"
            :width="'100%'"
            :height="500"
            v-model:value="code"
        ></MonacoEditor>
      </template>
      <template #footer>
        <el-button type="primary" plain @click="updateFileFun">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.file-container {
  width: 100%;
  height: 100%;

  .explorer {
    border: 1px solid #484753;
    height: 100%;
    overflow-y: auto;

    .top-bar {
      z-index: 999;
      width: calc(100% - 233px);
      height: 1.8rem;
      display: flex;
      padding: .2rem;
      position: fixed;
      background: #1f2020;

      .left {
        display: flex;

        .item {
          border-radius: 4px;
          cursor: pointer;
          transition: all .2s;

          &:hover {
            background: #2B2B2C;
          }
        }
      }

      .right {
        border: 1px solid #484753;
        width: 100%;
        display: flex;

        div {
          display: flex;
        }
      }

      .item {
        padding: .2rem;
        height: 100%;
        font-size: .8rem;
        //background: red;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: .5rem;
      }
    }

    .file-desc {
      position: relative;
      top: 1.8rem;
      width: 100%;
      padding: .2rem;
      //background: red;
    }
  }
}

.border{
  transition: all .2s;
  cursor: pointer;
  &:hover{
    border-radius: 4px;
    background: rgba(95, 96, 96, 0.2);
  }
}
</style>
