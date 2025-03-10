import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
// import store  from './store';
import { ElIcon } from 'element-plus';



const app = createApp(App);
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';


app.use(ElementPlus);
app.use(ElIcon);
app.use(router);
// app.use(store)
app.mount('#app');
import axios from 'axios'

// 添加请求拦截器（用于携带 token）
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// 添加响应拦截器（处理 401 未授权）
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
      // 这里可以跳转到登录页
    }
    return Promise.reject(error)
  }
)