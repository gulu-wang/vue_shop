<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card class="box-card">
            <el-button type="primary" @click="addRolesTanKuangIsShow=true">添加角色</el-button>
            <!--列表展示-->
            <el-table :data="roleList" border stripe>
                <!--                展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['ycenter','boderbuttom', i1===0 ? 'bordertop':'']"
                                v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!--                            一级权限列-->
                            <el-col :span="5">
                                <el-tag closable @close="deleteRightsTagById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--                            二,三级权限列-->
                            <el-col :span="19">
                                <el-row :class="['ycenter',i2 === 0?'':'bordertop']"
                                        v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable
                                                @close="deleteRightsTagById(scope.row,item2.id)">{{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                                                closable @close="deleteRightsTagById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre>
<!--                            {{scope.row}}-->
                        </pre>

                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--编辑按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row.id)">编辑
                        </el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">
                            删除
                        </el-button>
                        <!--分配角色按钮-->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRolesRights(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--        编辑弹框-->
        <el-dialog
                title="添加角色"
                :visible.sync="addRolesTanKuangIsShow"
                width="50%">
            <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addRolesTanKuangIsShow = false">取 消</el-button>
            <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!--        编辑弹框-->
        <el-dialog
                title="修改角色信息"
                :visible.sync="editRolesTanKuangIsShow"
                width="50%">
            <el-form :model="editRolesForm" :rules="addRolesFormRules" ref="editRolesFormRef" label-width="100px">
                <el-form-item label="角色ID">
                    <el-input v-model="editRolesForm.roleId" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editRolesTanKuangIsShow = false">取 消</el-button>
            <el-button type="primary" @click="confirmEditRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!--        分配权限弹框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightsTanKuangIsShow"
                width="50%"
                @close="setRightsTankuangIsClosed">
            <!--            树形控件-->
            <el-tree :data="rightsList" :props="defaultProps" ref="setRightsTree" show-checkbox
                     node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setRightsTanKuangIsShow = false">取 消</el-button>
            <el-button type="primary" @click="confirmSetRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                roleList: [],
                addRolesTanKuangIsShow: false,
                editRolesTanKuangIsShow: false,
                setRightsTanKuangIsShow: false,
                addRolesForm: {
                    roleName: '',
                    roleDesc: ''
                },
                addRolesFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 5, max: 15, message: '长度在 5 到 15个字符', trigger: 'blur'}

                    ]
                },
                editRolesForm: {
                    roleId: '',
                    roleName: '',
                    roleDesc: ''
                },
                rightsList: [], //所有权限的数据
                //树形控件的属性绑定对象
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                //默认勾选的节点id数组
                defKeys: [],
                //设置权限的角色id
                setRolesRightsId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('角色获取失败')
                }
                this.roleList = res.data
                // console.log(res)
            },
            addRoles() {
                //添加之前验证表单,返回值为布尔值
                this.$refs.addRolesFormRef.validate(async valid => {
                    // console.log(valid)
                    if (!valid) {
                        return this.$message.error('验证不通过')
                    } else {
                        const {data: res} = await this.$http.post('roles', this.addRolesForm)
                        // console.log(res);
                        if (res.meta.status === 201) {
                            this.$message.success(res.meta.msg)
                            this.addRolesTanKuangIsShow = false
                            this.getRolesList()
                        } else {
                            this.$message.error('添加失败')
                        }
                    }
                })

            },
            async editRole(val) {
                this.editRolesTanKuangIsShow = true
                const {data: res} = await this.$http.get('roles/' + val)
                this.editRolesForm.roleId = res.data.roleId
                this.editRolesForm.roleName = res.data.roleName
                this.editRolesForm.roleDesc = res.data.roleDesc

            },
            confirmEditRoles() {
                //提交之前验证表单,返回值为布尔值
                this.$refs.editRolesFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.put('roles/' + this.editRolesForm.roleId, this.editRolesForm)
                        if (res.meta.status === 200) {
                            this.$message.success('修改成功')
                            this.getRolesList()
                            this.editRolesTanKuangIsShow = false
                        } else {
                            this.$message.error(res.meta.msg())
                        }
                    } else {
                        this.$message.error('验证失败')
                    }
                })
            },
            deleteRole(id) {
                this.$confirm('此操作将永久删除该角色, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete('roles/' + id)
                    if (res.meta.status === 200) {
                        this.getRolesList()
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(res.meta.msg())
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteRightsTagById(role, rightsId) {
                console.log(role)
                this.$confirm('此操作将永久删除该权限, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete('roles/' + role.id + '/rights/' + rightsId)
                    if (res.meta.status === 200) {
                        // this.getRolesList() //不可取

                        //************************************************************
                        role.children = res.data   //直接给原数据赋值，就能局部更新数据

                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(res.meta.msg())
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async setRolesRights(role) {
                this.setRolesRightsId = role.id
                const {data: res} = await this.$http.get('rights/tree')
                this.rightsList = res.data;
                //执行递归函数，获取三级节点的id值
                this.getLeafKeys(role, this.defKeys)
                this.setRightsTanKuangIsShow = true

            },
            //清空默认权限数组
            setRightsTankuangIsClosed() {
                this.defKeys = []
            },

            //通过递归函数，循环出三级节点的id
            getLeafKeys(node, array) {
                //判断，如果当前节点没有children属性，那么他就是三级节点
                if (!node.children) {
                    return array.push(node.id)
                } else {
                    node.children.forEach(item => {
                        return this.getLeafKeys(item, array)
                    })
                }
            },

            async confirmSetRights() {
                let keysArr = [
                    ...this.$refs.setRightsTree.getCheckedKeys(),
                    ...this.$refs.setRightsTree.getHalfCheckedKeys()
                ]
                // let keyStr = keysArr.join(',')
                let keyStr = keysArr.toString()
                // console.log(keyStr);
                const {data: res} = await this.$http.post('roles/' + this.setRolesRightsId + '/rights', {rids: keyStr})
                if (res.meta.status === 200) {
                    this.$message.success('更新成功')
                    this.getRolesList()
                    this.setRightsTanKuangIsShow = false
                } else {
                    this.$message.error(res.data.msg)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .boderbuttom {
        border-bottom: 1px solid pink;
    }

    .bordertop {
        border-top: 1px solid pink;
    }

    /*纵向居中对起*/
    .ycenter {
        display: flex;
        align-items: center;
    }
</style>