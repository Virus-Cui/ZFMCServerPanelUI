import server from '@/utils/request.js'
import {ElLoading, ElMessage} from "element-plus";
import {loading} from "@/utils/request.js";

export const getAll = (page, name)=>{
    return new Promise((resolve, reject) => {
        server.get(`/container/all/${page}?containerName=${name}`).then(resp=>{
            resolve(resp)
        }).catch(err=>{
            loading.close()
            ElMessage.error({
                message: `错误:${err}`
            })
            reject(err)
        })
    })
}