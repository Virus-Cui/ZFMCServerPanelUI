import server from "./request.js"

export const uploadFun = (containerId, data) => {
    return new Promise((resolve, reject) => {
        server.post(`/file/uploadChunk/${containerId}`,data).then(resp=>{
            resolve(resp)
        }).catch(err=>{
            reject(err)
        })
    })
}
