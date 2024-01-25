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

export const delContainer = (id) => {
    return new Promise((resolve, reject) => {
        server.get(`/container/del/${id}`).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const sendCommand = (containerId, cmd) => {
    return new Promise((resolve, reject) => {
        server.post(`/container/cmd/${containerId}`, {
            cmd: cmd
        }).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const startContainer = (containerId) => {
    return new Promise((resolve, reject) => {
        server.get(`/container/start/${containerId}`).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const stopContainer = (containerId) => {
    return new Promise((resolve, reject) => {
        server.get(`/container/stop/${containerId}`).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getOne = (id) => {
    return new Promise((resolve, reject) => {
        server.get(`/container/one/${id}`).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const deleteBatch = (ids) => {
    return new Promise((resolve, reject) => {

        server.post("/container/delBatch", ids).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const updateContainer = (formdata) => {
    return new Promise((resolve, reject) => {
        server.post("/container/update", formdata).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const startBatch = (ids) => {
    return new Promise((resolve, reject) => {
        server.post("/container/startBatch", ids).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const stopBatch = (ids) => {
    return new Promise((resolve, reject) => {
        server.post("/container/stopBatch", ids).then(resp => resolve(resp)).catch(err => reject(err))
    })
}