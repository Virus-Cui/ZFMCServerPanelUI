<script setup>
import {login} from "@/utils/auth.js";
import {ref} from "vue";

const formdata =ref({})

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
}

const doLogin = ()=>{
  login(formdata.value).then(resp=>{

  })
}



</script>

<template>
  <div class="container">

    <div class="login-box">
      <div class="logo">
      </div>
      <div class="title">ZFMCPanel</div>
      <div class="form-container">
        <el-form :model="formdata" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="formdata.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formdata.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox>
              记住我
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="doLogin">登录 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("@/assets/bg.jpeg") center no-repeat;
  background-size: cover;
}
.login-box {
  width: 30rem;
  //background: white;
  border: 1px solid gray;
  padding: 1rem;
  backdrop-filter: blur(8px);
}
.title{
  text-align: center;
  line-height: 2rem;
}
</style>