<script setup>
import {nextTick, ref} from 'vue'
import {ElMessage} from "element-plus";
import {uploadFun} from "@/utils/upload.js";

const props = defineProps(["path", "containerId", "fileTypes", "percentEvent", "autoUpload"])

const uploader = ref()
const percent = ref(0)

const status = ref(false)
const fileName = ref("")


const checkMirrorFile = (file) => {
  const fileType = file.file.name.split('.')
  if (props.fileTypes.indexOf(fileType[fileType.length - 1])) {
    ElMessage.error("文件不正确")
    return false;
  }
  return true
}

const uploadFileSilce = (files, index) => {
  const {name} = files
  const {size} = files;
  const shardSize = 1024 * 1024 * 50;
  const shardTotal = Math.ceil(size / shardSize)

  fileName.value = name;

  if (index >= shardTotal) {
    props.percentEvent(100)
  }

  const start = index * shardSize;
  const end = Math.min(start + shardSize, size)
  const packet = files.slice(start, end);

  const formData = new FormData();
  formData.append("file", packet)
  formData.append("chunkNumber", index)
  formData.append('chunkSize', shardSize)
  formData.append('totalSize', size)
  formData.append('totalChunk', shardTotal)
  formData.append("fileName", name)
  formData.append("path", props.path)

  if (index < shardTotal) {
    props.percentEvent(Number((index / shardTotal) * 100).toFixed(0) * 1)
    console.log("上传")
    // 调用
    uploadFun(props.containerId, formData).then(resp => {
      index++;
      uploadFileSilce(files, index)
    })
  }

}

const upload = (file) => {
  if (checkMirrorFile(file)) {
    const files = file.file
    const shardIndex = 0;
    console.log("upload")
    uploadFileSilce(files, shardIndex);
  }
}


const submit = () => {
  console.log("发送")
  uploader.value.submit()
}

const change = (uploadFile) => {
  const fileType = uploadFile.name.split('.')
  if (props.fileTypes.indexOf(fileType[fileType.length - 1])) {
    ElMessage.error("文件类型不正确")
    uploader.value.clearFiles()
    status.value = false
  } else {
    status.value = true
  }
}

const exceed = (files) => {
  uploader.value.clearFiles()
  status.value = false
  nextTick(() => {
    uploader.value.handleStart(files[0])
    status.value = true
  })
}

const remove = () => {
  status.value = false
}

const checkFile = () => {
  return status;
}

const getFileName = () => {
  return fileName;
}

defineExpose({submit, checkFile, getFileName})

</script>

<template>
  <el-upload

      style="width: 100%"
      ref="uploader"
      :limit="1"
      :auto-upload="autoUpload"
      :http-request="upload"
      :on-change="change"
      :on-exceed="exceed"
      :on-remove="remove"
  >
    <template #trigger>
      <slot id="uploader" name="trigger"/>
    </template>
    <slot name="default"/>
  </el-upload>
</template>

<style scoped>

</style>
