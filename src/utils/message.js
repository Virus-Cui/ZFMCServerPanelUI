import {ElMessage, ElMessageBox} from "element-plus";

const closeAllMessage = ()=>{
    ElMessage.closeAll("success")
    ElMessage.closeAll("error")
}

const success = (msg)=>{
    closeAllMessage()
    ElMessage.success({
        message: msg
    })
}

const error = (msg)=>{
    closeAllMessage()
    ElMessage.error({
        message: msg
    })
}

const mb = (msg, successCall, cancelCall)=>{
    ElMessageBox({
        message: msg,
    }).then(()=>{
        successCall()
    }).catch(()=>{
        cancelCall()
    })
}

export default {
    success,
    error,
    mb
}