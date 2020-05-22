<template>
    <el-container>
<!--        头部区域-->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商管理系统</span>
            </div>

            <el-button type="info" @click="logout">点击退出</el-button>
        </el-header>
<!--        页面主题区域-->
        <el-container>
<!--            侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
<!--                侧边栏折叠展开按钮-->
                <div class="toggleAside" @click="toggleCollapse">{{isCollapse?'>>>':'<<<'}}</div>

                <el-menu background-color="#333744" text-color="#fff" active-text-color="#09A1FF"
                         :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
                         :router="true" :default-active="navStatus">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!--一级菜单的模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconFont[item.id]"></i>
                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>

                            <!--二级菜单-->
                            <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children"
                                          :key="subItem.id" @click="saveNavStatus('/' + subItem.path)">

                                <template slot="title">
                                    <!--图标-->
                                    <i class="el-icon-menu"></i>
                                    <!--文本-->
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右边窗口-->
            <el-main>
            <!--路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return{
                menuList:[],
                iconFont:{
                    '125':"iconfont icon-user",
                    '103':"iconfont icon-tijikongjian",
                    '101':"iconfont icon-shangpin",
                    '102':"iconfont icon-danju",
                    '145':"iconfont icon-baobiao",
                },
                isCollapse:false,
                navStatus:'',
            }
        },
        //生命周期函数
        created() {
            this.getMenuList();
            this.navStatus = window.sessionStorage.getItem('navStatus')
        },
        methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            async getMenuList(){
                const ret = await this.$http.get('menus')
                const data = ret.data
                if (data.meta.status !== 200) return this.$message.error(date.meta.msg)
                this.menuList = data.data
                // console.log(this.menuList)
            },
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            },
            saveNavStatus(val){
                window.sessionStorage.setItem('navStatus',val)
                this.navStatus = val
            }

        }
    }
</script>

<style lang="less" scoped>
.el-container{
    height: 100%;
}
.el-header{
    background-color: #353C3E;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fffdef;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        >span{
            margin-left: 15px;
        }
    }

};
.el-aside{
    background-color: #333744;
    >ul{
        border-right: none;
    }
}
.el-main{
    background-color:#E8ECEF ;
}
    .iconfont{
        margin-right: 15px;
    }
    .toggleAside{
        background-color: #475061;
        font-size: 15px;
        font-weight: bold;
        line-height: 24px;
        color: white;
        text-align: center;
        letter-spacing: 0.2em; //设置文本间距
        cursor: pointer;
    }
</style>