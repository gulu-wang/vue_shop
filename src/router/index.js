import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from "../components/goods/Params";
import Goods from "../components/goods/Goods";
import Addgoods from  "../components/goods/Add"
import Order from "../components/order/Order";

Vue.use(VueRouter)

const routes = [
  { path: '/',component: Login },
  { path: '/login',component: Login },
  { path: '/home',
    component: Home,
    redirect:'./welcome',
    children:[
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component:Rights },
        { path: '/roles', component:Roles },
        { path: '/categories', component:Cate },
        { path: '/params',component: Params },
        { path: '/goods',component: Goods },
        { path: '/goods/add',component: Addgoods },
        { path: '/orders',component: Order }

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
