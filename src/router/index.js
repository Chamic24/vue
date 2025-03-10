import { createRouter, createWebHistory } from 'vue-router'


// 配置路由
const routes = [
  {
    path: '/',
   
    component: ()=>import("../views/HomeNew.vue")
  },
  
  {
    path: '/attraction/:id',
    // name: 'AttractionDetail',
    component: () => import('../views/AttractionDetail.vue'),
    props: true
  },
  {
    path: '/tickets',
    component: ()=>import("../views/MyTicket.vue")
  },
  {
    path: '/categories',
    component: ()=>import("../views/RecommendPage.vue")
  },
  {
    path: '/settings',
    component: ()=>import("../views/SettingInfo.vue"),
   
  },
  {
    path: '/destinations',
    component: ()=>import("../views/WorldMap.vue")
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
