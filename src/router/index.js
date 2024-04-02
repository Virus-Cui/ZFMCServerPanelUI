import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/layout',
      name: 'Layout',
      component: ()=>import("@/views/Layout.vue"),
      children:[
        {
          path: '/',
          name: 'index',
          component: ()=>import("@/views/index.vue"),
          meta: {
            title: '首页',
            keepAlive: false
          }
        },
        {
          path: '/container',
          name: 'container',
          component: ()=>import("@/views/container/Container.vue"),
          meta: {
            title: '应用实例',
            keepAlive: false
          },
        },
        {
          path: '/container/:id',
          name: 'CINFO',
          component: ()=>import("@/views/container/CINFO.vue"),
          meta: {
            title: '实例详情',
            keepAlive: false
          }
        },
        {
          path: '/frp',
          name: 'frp',
          component: ()=>import("@/views/frp/Frp.vue"),
          meta: {
            title: '内网穿透',
            keepAlive: false
          }
        },
        {
          path: '/settings',
          name: 'settings',
          component: ()=>import("@/views/system/Settings.vue"),
          meta: {
            title: '系统设置',
            keepAlive: false
          }
        },
        {
          path: '/files',
          name: 'files',
          component: ()=>import("@/views/file/file.vue"),
          meta: {
            title: '文件管理',
            keepAlive: false
          },
        },
        {
          path: '/h2',
          name: 'h2',
          component: ()=>import("@/views/h2/h2.vue"),
          meta: {
            title: 'H2数据库管理',
            keepAlive: true,
            isIframe: true
          },

        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import("@/views/auth/login.vue"),
      meta: {
        title: '登录'
      }
    }
  ]
})

export default router
