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

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入nprogress 插件  作用是展现加载进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器，将请求预处理
axios.interceptors.request.use(config=>{
  Nprogress.start()   //显示进度条
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
//响应拦截器
axios.interceptors.response.use(config=>{
  Nprogress.done()   //隐藏进度条
  return config
})
//将 axios 挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.component('tree-table',treeTable)

//将富文本编辑器注册到vue全局中
Vue.use(VueQuillEditor)

//在全局注册一个时间过滤器
Vue.filter('dateFormat',function (origin) {
  const date = new Date(origin)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2,'0')
  const d = (date.getDate() + '').padStart(2,'0')

  const h = (date.getHours() + '').padStart(2,'0')
  const mm = (date.getMinutes() + '').padStart(2,'0')
  const s = (date.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

Vue.config.productionTip = false
// console.log(Vue)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
