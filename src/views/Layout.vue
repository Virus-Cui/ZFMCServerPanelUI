<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {Expand, Fold, Folder, HomeFilled, Location, Menu, Promotion, Setting} from "@element-plus/icons-vue";

const router = useRouter();
const navigateToIndex = ()=>{
  router.push({
    path: '/'
  })
}

const collapse = ref(false)
const collapseMenu = ()=>{
  collapse.value = true
}

const uncollapseMenu = ()=>{
  collapse.value = false
  document.screen = true
}



</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <el-menu
            active-text-color="#409eff"
            background-color="#1f2020"
            text-color="#fff"
            router
            :default-active="router.currentRoute.value.fullPath"
            :collapse="collapse"
        >
          <el-menu-item @click="navigateToIndex">
            <template #default>
              <el-icon>
                <img src="@/assets/logo-256px.png" width="28">
              </el-icon>
              <span>&nbsp;ZFMCServerPanel</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/'" route="/">
            <template #default>
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/container'" route="/container">
            <template #default>
              <el-icon><Menu /></el-icon>
              <span>应用实例</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/frp'" route="/frp">
            <template #default>
              <el-icon><Promotion /></el-icon>
              <span>FRP</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/files'" route="/files">
            <template #default>
              <el-icon><Folder /></el-icon>
              <span>资源管理器</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/settings'" route="/settings">
            <template #default>
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </template>
          </el-menu-item>

        </el-menu>

      </el-aside>
      <el-container>
        <el-header>
          <div class="icon">
            <el-icon @click="collapseMenu" v-if="!collapse"><Fold /></el-icon>
            <el-icon @click="uncollapseMenu" v-if="collapse"><Expand /></el-icon>
          </div>
        </el-header>
        <el-main>

          <router-view />
        </el-main>
        <el-footer>Powered By ZFCloud | Copyright © 2024 mrcsh.com | 陇ICP备2023002619号</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.common-layout{
  width: 100vw;
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-header,
.el-footer {
  color: #FFF;
}
.el-header {
  background: #1c1b1b url("../assets/trans-top-darkwool.png");
}

.el-footer{
  display: flex;
  align-items: center;
  background: #1c1b1b;
}

.el-aside {
  color: #FFF;
  background: #1c1b1b url("../assets/bg-wool-dark.png") repeat;
}

.el-main {
  background-color: #1f2020;
  color: #FFF;
  position: relative;
  //background: url("@/assets/bg.jpeg") no-repeat center;
  //background-size: cover;
}

.el-menu {
  background-color: transparent;
  border: none;
}

.icon{
  width: 10rem;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 1.8rem;
}


</style>
