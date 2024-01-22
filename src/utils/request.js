import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
import router from "@/router/index.js";


const baseURL = "http://127.0.0.1:5200";

const server = axios.create({
    baseURL: baseURL
})

export let loading = null;

server.interceptors.request.use(config=>{
    loading = ElLoading.service({
        lock: true,
        text: '正在加载',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    config.headers["Authorization"] = localStorage.getItem("token");

    return config;
})

server.interceptors.response.use(res => {
    let code = res.data.code
    if(code === 5001){
        router.push({
            path: `/login?redirect=${window.href}`
        })
    }
    loading.close()
    return res;
})


export default server;
