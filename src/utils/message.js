import {ElMessage, ElMessageBox} from "element-plus";

const closeAllMessageBox = () => {
    ElMessage.closeAll()
}

export const success = (msg) => {
    closeAllMessageBox()
    ElMessage.success({
        message: msg
    })
}

export const error = (msg) => {
    closeAllMessageBox()
    ElMessage.error({
        message: msg
    })
}

export const warn = (msg) => {
    closeAllMessageBox()
    ElMessage.warning({
        message: msg
    })
}