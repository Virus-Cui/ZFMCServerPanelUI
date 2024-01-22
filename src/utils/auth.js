import server from "@/utils/request.js";

import router from '@/router/index.js'

export const login = (formdata) => {
    return new Promise((resolve, reject) => {
        server.post("/auth/login",formdata).then(resp=>{
            localStorage.setItem("token", resp.data.data)
            router.push({
                path: '/'
            })
            resolve(resp)
        }).catch(err=>{
            reject(err)
        })
    })
}