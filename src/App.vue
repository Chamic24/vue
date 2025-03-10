<template>
  <div class="container-fluid">
    <NavBar 
      :isLoggedIn="isLoggedIn" 
      @login="handleLogin"
      @logout="handleLogout"
    />
    <AuthModal ref="authModal" @success="handleAuthSuccess" />
    <div class="main-container">
      <Sidebar />
      <router-view :message="parentMessage" ></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref ,provide  } from 'vue'
import NavBar from './components/NavBar.vue'
import Sidebar from './components/SideBar.vue'
import AuthModal from './components/AuthModal.vue'
import{ElMessage}from 'element-plus'
const isLoggedIn = ref(false)
const authModal = ref(null)


let username=ref("");
let email=ref("");
const handleLogin = () => {
  authModal.value.open() // 直接调用AuthModal的open方法
}
const handleLogout = () => {
  isLoggedIn.value = false
  ElMessage.success('Exit successfully')

}
const handleAuthSuccess=(e)=>{
  isLoggedIn.value = true
  username.value=e.user.username
  email.value=e.user.email
  console.log("=======",e.user.username)
  console.log("=========",e.user.email)
}
provide('username', username)
provide('email', email)
</script>

<style>
.main-container {
  display: flex;
  min-height: calc(100vh - 72px);
}

/* 全局样式 */
.btn-primary {
  background-color: #409eff;
  border-color: #409eff;
}

.btn-primary:hover {
  background-color: #337ecc;
  border-color: #337ecc;
}

.el-carousel {
  margin-top: 20px;
}

.container-fluid {
  padding: 0;
}
/* 全局覆盖弹窗样式 */
.el-dialog {
  border-radius: 8px !important;
}

.el-dialog__header {
  border-bottom: 1px solid #eee;
  margin-right: 0;
}

.el-tabs__nav-wrap::after {
  height: 1px !important;
}
</style>