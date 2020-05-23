<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区域-->
        <el-card class="box-card">
            <!--        用户搜索框    -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query"
                              clearable @clear="getUserList" @keyup.enter.native="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUserTanChuangIsShow=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--            用户表格-->
            <el-table :data="userlist" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--                        修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="editUser(scope.row)"></el-button>
                        <!--                        删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteUser(scope.row.id)"></el-button>
                        <!--                        分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="setUserRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2, 4, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalpage">
            </el-pagination>
        </el-card>
        <!--        添加用户弹窗-->
        <el-dialog title="添加用户" :visible.sync="addUserTanChuangIsShow" width="50%" @close="addUserFormClosed">
            <!--            内容主题区域-->
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">  <!--prop是指向校验规则的-->
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
        <el-button @click="addUserTanChuangIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

        <!--        编辑用户弹窗-->
        <el-dialog title="修改用户" :visible.sync="editUserTanChuangIsShow" width="50%">
            <!--内容主题区域-->
            <el-form :model="editUserForm" :rules="addUserFormRules" ref="editUserFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editUsername" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email"><!--prop是指向校验规则的,对应校验规则里的属性-->
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
        <el-button @click="editUserTanChuangIsShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditUser">确 定</el-button>
        </span>
        </el-dialog>

        <!--        分配角色弹框-->
        <el-dialog title="分配角色" :visible.sync="setRoleTanChuangIsShow" width="50%"
                   @close="setRoleTankuangIsClosed">
            <!--内容主题区域-->
            <p>当前用户：{{setRoleForm.currentName}}</p>
            <p>当前角色：{{setRoleForm.currentRole}}</p>
            <p>
                <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </p>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleTanChuangIsShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRole">确 定</el-button>
        </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "Users",
        data() {
            //自定义表单验证规则
            const checkEmail = (rules, value, callback) => {
                //定义验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if (regEmail.test(value)) {
                    return callback()
                } else {
                    callback(new Error('邮箱不合法'))
                }
            }
            const checkMobile = (rules, value, callback) => {
                //定义验证手机号的规则
                const regMobile = /^1[3456789]\d{9}$/
                if (regMobile.test(value)) {
                    return callback()
                } else {
                    callback(new Error('手机号不合法'))
                }
            }

            return {
                queryInfo: {
                    query: '',
                    pagenum: 1, //当前的页码值
                    pagesize: 4 //当前每页显示多少条
                },
                userlist: [], //响应过来的用户列表
                totalpage: 0, // 响应过来的页码总数
                addUserTanChuangIsShow: false,  //添加用户弹窗是否显示
                editUserTanChuangIsShow: false, //修改用户弹窗是否显示
                setRoleTanChuangIsShow: false,  //分配角色弹框是否显示
                //添加用户数据表单
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //添加用户表单验证规则对象
                addUserFormRules: {
                    username: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入电话', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}

                    ]
                },

                editUserForm: {
                    email: '',
                    mobile: ''
                },
                editUsername: '',
                editUserId: 0,

                setRoleForm: {
                    currentName: '',
                    currentRole: ''
                },
                //角色列表
                rolesList: [],
                //以选中的角色id值
                selectRoleId: '',
                setRoleId: ''
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                let {data: res} = await this.$http.get('/users', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取失败')
                }
                this.userlist = res.data.users
                this.totalpage = res.data.total
            },
            handleSizeChange(newSize) {  //点击切换每页显示的条数
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()

            },
            handleCurrentChange(newPage) {  //根据当前的页码值来切换当前的页面
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },

            async userStateChange(userinfo) {
                console.log(userinfo)
                console.log(userinfo.mg_state)
                const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                console.log(res)
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户状态失败')
                } else {
                    return this.$message.success('更新成功')
                }
            },
            //监听添加用户表单是否关闭的事件函数，关闭了就清空表单内容
            addUserFormClosed() {
                this.$refs.addUserFormRef.resetFields()
            },
            //添加用户函数，
            addUser() {
                this.$refs.addUserFormRef.validate(async valid => {
                    // console.log(valid)//true
                    if (valid) {
                        const {data: res} = await this.$http.post('users', this.addUserForm)
                        console.log(res)
                        if (res.meta.status === 201) {
                            this.$message.success('添加用户成功')
                            this.addUserTanChuangIsShow = false
                            this.getUserList()
                        } else {
                            this.$message.error('添加用户失败')
                        }
                    } else {
                        return this.$message.error('验证不通过')
                    }
                })
            },
            async editUser(val) {
                this.editUserTanChuangIsShow = true
                const {data: res} = await this.$http.get('users/' + val.id)
                this.editUserForm.email = res.data.email
                this.editUserForm.mobile = res.data.mobile
                this.editUsername = res.data.username
                this.editUserId = res.data.id
            },
            confirmEditUser() {
                //提交之前的验证
                this.$refs.editUserFormRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.put(`users/${this.editUserId}`, this.editUserForm)
                    console.log(res)
                    if (res.meta.status === 200) {   //返回最新的data数据
                        this.$message.success(res.meta.msg)
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                    this.editUserTanChuangIsShow = false
                })

            },
            // //监听修改用户表单是否关闭的事件函数，关闭了就清空表单内容,
            // editUserFormClosed(){
            //     this.$refs.editUserFormRef.resetFields()
            // },

            // async deleteUser(id){
            //     const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).catch(error=>error);
            //
            //     if(res !== "confirm"){
            //         this.$message.info('取消删除')
            //     }else {
            //         const {data:ret} = await this.$http.delete('users/'+id)
            //         if(ret.meta.status === 200){
            //             this.$message.success('删除成功')
            //             this.getUserList()
            //         }else {
            //             this.$message.error('删除失败')
            //         }
            //     }
            // },
            deleteUser(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: ret} = await this.$http.delete('users/' + id)
                    if (ret.meta.status === 200) {
                        this.$message.success('删除成功')
                        this.getUserList()
                    } else {
                        this.$message.error('删除失败')
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async setUserRole(val) {
                this.setRoleId = val.id
                this.setRoleTanChuangIsShow = true
                this.setRoleForm.currentName = val.username
                this.setRoleForm.currentRole = val.role_name
                //获取用户角色列表
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('角色获取失败')
                }
                this.rolesList = res.data
            },
            async confirmSetRole() {
                if (this.selectRoleId) {
                    const {data: res} = await this.$http.put('users/' + this.setRoleId + '/role',
                        {rid: this.selectRoleId})
                    if (res.meta.status === 200) {
                        this.$message.success('更新成功')
                        this.getUserList();
                        this.setRoleTanChuangIsShow = false
                    } else if (res.meta.status === 400) {
                        this.$message.error(res.meta.msg)
                        this.setRoleTanChuangIsShow = false
                    } else {
                        this.$message.error('更新角色失败')
                    }
                } else {
                    this.$message.error('请设置角色名称')
                }
            },
            setRoleTankuangIsClosed() {
                this.selectRoleId = ''
            }
        }
    }
</script>

<style scoped>

</style>