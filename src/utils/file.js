import server from './request.js'

export const getRoots = () => {
    return new Promise((resolve, reject) => {
        server.get("/file/roots").then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getChildrenFile = (parent) => {
    return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append("path", parent)
        server.post("/file/files", data).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getParentFile = (file) => {
    return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append("path", file)
        server.post("/file/previousFile", data).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}

export const readFile = (file) => {
    return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append("path", file)
        server.post("/file/readFile", data).then(resp => {
            resolve(resp)
        }).catch(err => {
            reject(err)
        })
    })
}