import "@/assets/base.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/iconfont/iconfont.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const app = createApp(App)

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
    NProgress.start();
    document.querySelector("title").innerText = to.meta.title
    next();
})

router.afterEach(() => {
    NProgress.done();
})
app.use(router)
app.use(ElementPlus)
app.mount('#app')
