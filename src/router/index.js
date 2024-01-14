import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/layout',
      name: 'Layout',
      component: ()=>import("@/views/Layout.vue"),
      children:[
        {
          path: '/',
          name: 'index',
          component: ()=>import("@/views/index.vue")
        },
        {
          path: '/container',
          name: 'container',
          component: ()=>import("@/views/container/Container.vue")
        },
        {
          path: '/container/:id',
          name: 'CINFO',
          component: ()=>import("@/views/container/CINFO.vue"),
        },
        {
          path: '/frp',
          name: 'frp',
          component: ()=>import("@/views/frp/Frp.vue"),
        },
        {
          path: '/settings',
          name: 'settings',
          component: ()=>import("@/views/system/Settings.vue"),
        }
      ]
    }
  ]
})

export default router
