<template>
  <div 
    class="sidebar" 
    @mouseenter="expandSidebar" 
    @mouseleave="collapseSidebar"
    :style="{ width: sidebarWidth }"
  >
    <div class="sidebar-content">
      <router-link 
        v-for="(item, index) in menuItems" 
        :key="index" 
        :to="item.path"
        class="sidebar-item" 
        :class="{ 'active': activeMenu === index }"
        @click="activeMenu = index"
      >
        <component :is="item.icon" class="sidebar-icon" />
        <span class="menu-text">{{ item.text }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  House, 
  // Star, 
  MapLocation, 
  Ticket as TicketIcon,
  CollectionTag, 
  Setting 
} from '@element-plus/icons-vue'

const activeMenu = ref(0)
const sidebarExpanded = ref(false)

const menuItems = [
  { icon: House, text: 'Home', path: '/' },
  // { icon: Star, text: 'Featured', path: '/featured' },
  { icon: CollectionTag, text: 'Categories', path: '/categories' },
  { icon: MapLocation, text: 'Destinations', path: '/destinations' },
  { icon: TicketIcon, text: 'My Tickets', path: '/tickets' },
  
  { icon: Setting, text: 'Settings', path: '/settings' }
]

const sidebarWidth = computed(() => sidebarExpanded.value ? '220px' : '60px')

const expandSidebar = () => {
  sidebarExpanded.value = true
}

const collapseSidebar = () => {
  sidebarExpanded.value = false
}
</script>

<style scoped>
.sidebar {
  background: white;
  border-right: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
  height: calc(100vh - 72px);
}

.sidebar-content {
  padding: 20px 0;
  overflow: hidden;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
}

.sidebar-item:hover {
  background: #f8f9fa;
  color: #409eff;
}

.sidebar-item.active {
  background: #ecf5ff;
  color: #409eff;
  border-right: 3px solid #409eff;
}

.sidebar-icon {
  width: 1.2em;
  height: 1.2em;
  margin-right: 15px;
  flex-shrink: 0;
}

.menu-text {
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 14px;
}

.sidebar:hover .menu-text {
  opacity: 1;
}
</style>
