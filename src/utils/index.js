import server from "@/utils/request.js";

export const getAPISpir = () => {
    return new Promise((resolve, reject) => {
        server.get("/supervisory/load").then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getServerInfo = () => {
    return new Promise((resolve, reject) => {
        server.get("/sys/info").then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}