<script setup>
import XUploader from "@/components/XUploader.vue";
import {ref} from "vue";

const percent = ref(0)
const xup = ref()
const percenListener = (per) => {
  percent.value = per
}

const submit = () => {
  xup.value.submit()
}
</script>

<template>
  <div class="file-container">
    <!--    <div class="fastnav">-->

    <!--    </div>-->
    <!--    <div class="filelist">-->
    <!--      <el-table>-->
    <!--        <el-table-column prop="fileName" label="文件名称"></el-table-column>-->
    <!--        <el-table-column prop="fileSize" label="文件大小"></el-table-column>-->
    <!--        <el-table-column prop="fileSize" label="文件大小"></el-table-column>-->
    <!--      </el-table>-->
    <!--    </div>-->

    <XUploader ref="xup" :container-id="'1745813134574202880'" :file-types="['jar']"
               :path="'D:/Code/Java/Project/ZF-MCServerPanel/test'" :percent-event="percenListener">
      <template #trigger>
        <button>sss</button>
      </template>
      <template #default>
        <button @click="submit">上传</button>
      </template>
    </XUploader>
    <el-progress :percentage="percent"/>
  </div>
</template>

<style scoped lang="scss">
.file-container {
  .fastnav {

  }

  .filelist {

  }
}
</style>
