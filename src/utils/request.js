import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
import router from "@/router/index.js";

const env = "dev";
const devBaseURL = "http://127.0.0.1:5200/";
const devWsAddress = "ws://127.0.0.1:5200/";
const baseURL = env === "dev" ? devBaseURL: '/';

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
            path: `/login?redirect=${window.location}`
        })
    }
    loading.close()
    return res;
})


export default server;

export const wsURL = ()=>{
    if(env === 'dev'){
        return devWsAddress;
    }
    let loc = window.location, new_uri;
    if(loc.protocol === 'https'){
        new_uri = 'wss';
    }else {
        new_uri = 'ws'
    }
    new_uri += '://'+loc.host+"/"
    return new_uri;
};
