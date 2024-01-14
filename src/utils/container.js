import server from '@/utils/request.js'

export const getAll = (page, name)=>{
    return new Promise((resolve, reject) => {
        server.get(`/container/all/${page}?containerName=${name}`).then(resp=>{
            resolve(resp)
        }).catch(err=>{
            reject(err)
        })
    })
}