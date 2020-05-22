import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',component: Login },
  { path: '/login',component: Login },
  { path: '/home',
    component: Home,
    redirect:'./welcome',
    children:[
        {path: '/welcome',component: Welcome},
        {path: '/users',component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫,防止没有登录就访问
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行， next（）放行，next('/login') 强制跳转
  if(to.path === '/login') return next()
  //不是访问登录页
  const tokenStr = window.sessionStorage.getItem('token')
  if( !tokenStr )  return next('/login')
  next()
})

export default router
