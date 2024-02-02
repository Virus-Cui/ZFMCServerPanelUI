<script setup>
import XUploader from "@/components/XUploader.vue";
import {getRoots, getChildrenFile, getParentFile} from "@/utils/file.js";
import {ref, onMounted} from "vue";
import {ElMessage} from "element-plus";

const tbData = ref()
const nowFolder = ref([])

onMounted(() => {
  getRoots().then(resp => {
    console.log(resp.data)
    tbData.value = resp.data.data
  })
})

const getChildrenFileFun = (row, column, event) => {
  nowFolder.value.push(row.filePath)
  getChildrenFile(row.filePath).then(resp => {
    console.log(resp.data.data)
    tbData.value = resp.data.data
  })
}

const getPrevious = ()=>{
  if(nowFolder == undefined){
    ElMessage.error({
      message: '没有父级'
    })
  }
  getParentFile(nowFolder.value[nowFolder.value.length-1]).then(resp=>{
    tbData.value = resp.data.data
  })
  nowFolder.value.pop();
}



</script>

<template>
  <div class="file-container">
    <div class="explorer">
      <div class="top-bar">
        <div class="left">
          <div class="item" @click="getPrevious"><i class="iconfont icon-arrowleft"></i></div>
          <div class="item"><i class="iconfont icon-arrowright"></i></div>
          <div class="item"><i class="iconfont icon-arrowup"></i></div>
          <div class="item"><i class="iconfont icon-reload"></i></div>
        </div>
        <div class="right">
          <div>
            <div class="item"><i class="iconfont icon-server"></i></div>
            <div class="item">></div>
          </div>
          <div>
            <div class="item">根目录</div>
            <div class="item">></div>
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
          <el-table-column label="操作">
            <template #default="scope">
              <el-button plain size="small" type="primary">编辑</el-button>
              <el-button plain size="small" type="success">下载</el-button>
              <el-button plain size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
        div{
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
</style>
