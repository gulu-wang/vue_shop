<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区-->
            <div class="touxiang_box"><img src="../assets/logo.gif" alt=""></div>
            <!--登录表单区-->
            <div>
                <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form" >
<!--                    账号区域-->
                    <el-form-item  prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                    </el-form-item>
<!--                    密码区域-->
                    <el-form-item  prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                    </el-form-item>
<!--                    登录按钮区域-->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                //登录表单的数据绑定对象
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                //表单验证规则对象
                loginFormRules:{
                    username:[
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            resetLoginForm(){
                // console.log(this)  //this就是form表单的实例对象
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(async (ret)=>{
                    if ( !ret ) return;
                    // console.log(this)
                    let result = await this.$http.post('login',this.loginForm);
                    let data = result.data
                    if(data.meta.status == 200){
                        this.$message.success(data.meta.msg)
                        //登录成功，保存token到sessionStorage中
                        //   因为项目中除了登录页面的其他接口，都需要在登录成功才能访问
                        //   token 只应该在打开网页期间有效，所以将token保存在sessionStorage中

                        window.sessionStorage.setItem('token',data.data.token)
                        //登陆成功，通过编程式跳转到后台主页，酷游地址是 /home
                        this.$router.push("home");
                    }else{
                        this.$message.error('登录失败')
                    }

                });
            }
        }
    }
</script>

<style lang="less" scoped>
.login_container{
    background-color:#2b4b6b;
    height: 100%;
}

.login_box{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 450px;
    height: 300px;
    background-color: #eee;
    border-radius: 3px;
}
.touxiang_box{
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 130px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing:border-box ;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>