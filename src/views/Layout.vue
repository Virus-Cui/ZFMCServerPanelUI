<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {
  ArrowDown,
  Expand,
  Fold,
  Folder,
  Histogram,
  HomeFilled,
  Location,
  Menu,
  Promotion,
  Setting
} from "@element-plus/icons-vue";
import DBMS from "@/components/DBMS.vue";
import {useDark, useToggle} from '@vueuse/core'

import {Moon, Sunny, Hide, View} from "@element-plus/icons-vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

const openSettings = ref()

const router = useRouter();
const route = useRoute()

const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: 'useDarkKEY',
  // 暗黑class名字
  valueDark: 'dark',
  // 高亮class名字
  valueLight: 'light',
  disableTransition: false
})

const toggleDark = useToggle(isDark)

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

onMounted(()=>{
  window.addEventListener("resize",()=>{
    if(window.innerWidth <= 720){
      collapse.value = true
    }else {
      collapse.value = false
    }
  })
})


const changeTheme = (theme)=>{
  console.log(toggleDark(theme))
}

const opensettingsFun = ()=>{
  console.log(123)
  openSettings.value = true
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
          <el-menu-item :index="'/h2'" route="/h2">
            <template #default>
              <el-icon><Histogram /></el-icon>
              <span>数据库管理</span>
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
            <Breadcrumb></Breadcrumb>

          </div>
          <div class="theme">
<!--           <el-switch
                style="vertical-align: baseline"
                v-model="isDark"
                inline-prompt
                :active-icon="Moon"
                :inactive-icon="Sunny"
            />-->

            <el-dropdown>
              <el-avatar shape="square" :size="50" src="https://csh-test1.oss-cn-beijing.aliyuncs.com/7c7c0cb0138c4d88b4cbc421f6f4a7bb.jpg" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="opensettingsFun">系统设置</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </el-header>
        <el-main>

          <!-- vue3.0配置 -->
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"  v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <component :is="Component"  v-if="!$route.meta.keepAlive"/>
          </router-view>
          <div v-show="$route.path == '/h2'" style="width: 100%;height: 100%">
            <DBMS></DBMS>
          </div>
        </el-main>
        <el-footer>Powered By ZFCloud | Copyright © 2024 mrcsh.com | 津ICP备2024010807号-3</el-footer>
      </el-container>
    </el-container>

    <el-drawer v-model="openSettings">
      <template #header>
        <h3>系统设置</h3>
      </template>
      <template #default>
        <div class="options">
          <div class="option">
            <div class="title">主题颜色</div>
            <div class="desc">
              <div class="dark opt" @click="changeTheme(true)"></div>
              <div class="light opt" @click="changeTheme(false)"></div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
        </div>
      </template>
    </el-drawer>
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
  width: 100%;
  background: #1c1b1b url("../assets/trans-top-darkwool.png");
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: var(--bg-color);
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
.theme{
  display: flex;
  justify-content: right;
  align-items: center;
  column-gap: 10px;
}
.options {
  .option {
    .title{
      margin: .5rem 0;
    }
    .desc {
      display: flex;
      justify-content: left;
      align-items: center;
      column-gap: 20px;
    }
  }
}
.opt{
  width: 40px;
  height: 40px;
  background: cyan;
  border-radius: 8px;
  cursor: pointer;
}
.light{
  background: #fafafa;
}

.dark{
  background: #000;
}
</style>
