import server from '@/utils/request.js'
import {ElLoading, ElMessage} from "element-plus";
import {loading} from "@/utils/request.js";

export const getAll = (page, name) => {
    return new Promise((resolve, reject) => {
        server.get(`/container/all/${page}?containerName=${name}`).then(resp => {
            resolve(resp)
        }).catch(err => {
            loading.close()
            ElMessage.error({
                message: `查询实例信息失败: ${err}`
            })
            reject(err)
        })
    })
}

export const createContainer = (obj) => {
    return new Promise((resolve, reject) => {
        server.post("/container/createNewContainer", obj).then(resp => {
            resolve(resp)
        }).catch(err => {
            ElMessage.error({
                message: `创建实例出错: ${err}`
            })
            reject(err)
        })
    })
}