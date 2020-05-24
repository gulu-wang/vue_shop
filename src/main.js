import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入 axios 模块
import axios from 'axios'
//导入vue-table-with-tree-grid树形模块
import treeTable from 'vue-table-with-tree-grid'

//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//将请求预处理
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
//将 axios 挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.component('tree-table',treeTable)

Vue.config.productionTip = false
// console.log(Vue)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
