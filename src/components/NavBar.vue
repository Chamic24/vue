<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container-fluid">
      <router-link class="navbar-brand text-primary fw-bold" to="/">
        <el-icon class="me-2"><Location /></el-icon> Travel Ticketing
      </router-link>
      
      <div class="d-flex flex-grow-1 mx-4">
        <div class="input-group">
          <input 
            type="search" 
            class="form-control rounded-pill" 
            placeholder="Search destination..."
            style="color: #333;"
          >
          <button class="btn btn-primary rounded-pill ms-2 px-4">
            <el-icon><Search /></el-icon>
          </button>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <el-dropdown>
          <span class="btn btn-light rounded-circle p-2 mx-2">
            <el-icon><User /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item  @click="isLoggedIn ? handleProfileClick() : handleAuthClick()">
                <el-icon class="me-2"><User /></el-icon>
                
                {{ isLoggedIn ? 'Profile' : 'Login' }}
              </el-dropdown-item>
              
              <el-dropdown-item v-if="isLoggedIn" @click="movetoticket">
                <el-icon class="me-2"><Ticket /></el-icon> My Orders
              </el-dropdown-item>
              <el-dropdown-item v-if="isLoggedIn" @click="handleLogout">
                <el-icon class="me-2"><SwitchButton /></el-icon> Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Location, Search, User, Ticket, SwitchButton } from '@element-plus/icons-vue'
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logout', 'login'])

const handleAuthClick = () => {
  if (!props.isLoggedIn) {
    emit('login')
  }
}
const movetoticket=()=>{
  router.push({ path: '/tickets' })
}
const handleProfileClick=()=>{
  router.push({ path: '/settings' })
}
const handleLogout = () => {
  emit('logout')

}
</script>
