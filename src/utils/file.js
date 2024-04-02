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

export const readFile = (path) => {
    return new Promise((resolve, reject) => {
        let data = new FormData()
        data.append("path", path)
        server.post("/file/readFile",data).then(resp=>{
            if(resp.data.data === 'error'){
                reject(resp)
            }
            resolve(resp)
        }).catch(err=>{
            reject(err)
        })
    })
}

export const updateFile = (filePath,content)=>{
    return new Promise((resolve, reject) => {
        let formdata = new FormData();
        formdata.append("filePath",filePath)
        formdata.append("fileContent", content)
        server.post("/file/updateFile",formdata).then(resp=>{
            resolve(resp)
        }).catch(err=>{
            reject(err)
        })
    })
}