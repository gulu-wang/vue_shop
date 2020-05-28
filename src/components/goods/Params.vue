<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-alert show-icon type="warning" :closable="false" title="注意：只允许为第三级分类设置相关参数"></el-alert>
            <el-row>
                <el-col>
                    <span>商品选择分类：</span>
                    <!--级联选择框-->
                    <el-cascader
                            v-model="selectedCatekeys"
                            :options="cateList"
                            :props="props"
                            @change="cascaderChanged">
                    </el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                               @click="addParamsTanKuangIsShow=true">动态参数
                    </el-button>
                    <!--                    动态数据表格-->
                    <el-table :data="manyData" border stripe>
                        <el-table-column type="expand">
                            <templete slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                        @close="deleteTag(index,scope.row)"> {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </templete>
                        </el-table-column>
                        <el-table-column label="序号" type="index"></el-table-column>
                        <el-table-column label="参数名称" type="" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!--修改按钮-->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="editParams(scope.row.attr_id)">编辑
                                </el-button>
                                <!--删除按钮-->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="deleteParams(scope.row.attr_id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                               @click="addParamsTanKuangIsShow=true"> 静态属性
                    </el-button>
                    <el-table :data="onlyData" border stripe>
                        <el-table-column type="expand">
                            <templete slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                        @close="deleteTag(index,scope.row)"> {{item}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </templete>
                        </el-table-column>
                        <el-table-column label="序号" type="index"></el-table-column>
                        <el-table-column label="属性名称" type="" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!--修改按钮-->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="">编辑
                                </el-button>
                                <!--删除按钮-->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!--添加参数弹框-->
            <el-dialog :title="'添加'+title" :visible.sync="addParamsTanKuangIsShow" width="50%"
                       @close="addParamsTanKuangIsClosed">
                <!--内容主题区域-->
                <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="80px">
                    <el-form-item :label="title" prop="attr_name">  <!--prop是指向校验规则的-->
                        <el-input v-model="addParamsForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addParamsTanKuangIsShow = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddParams">确 定</el-button>
                 </span>
            </el-dialog>

            <!--修改参数弹框-->
            <el-dialog title="编辑参数名称" :visible.sync="editParamsTanKuangIsShow" width="50%"
                       @close="editParamsTanKuangIsClosed">
                <!--内容主题区域-->
                <el-form :model="editParamsForm" :rules="addParamsFormRules" ref="editParamsFormRef" label-width="80px">
                    <el-form-item label="参数名称" prop="attr_name">  <!--prop是指向校验规则的-->
                        <el-input v-model="editParamsForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editParamsTanKuangIsShow = false">取 消</el-button>
                    <el-button type="primary" @click="confirmEdit">确 定</el-button>
                 </span>
            </el-dialog>
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                cateList: [], //默认分类列表
                props: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedCatekeys: [],    //这是级联选择器选中的分类
                activeName: 'many',  //动态绑定到tabs标签页，存储对应标签页的name属性值,默认绑定到第一个
                manyData: [],     //存放获取到的动态数据
                onlyData: [],     //存放获取到的静态数据
                addParamsTanKuangIsShow: false, //添加动态参数和静态属性弹框是否显示
                editParamsTanKuangIsShow: false,
                addParamsForm: {
                    attr_name: ''
                },
                addParamsFormRules: {
                    attr_name: [
                        {required: true, message: '请输入名称或属性', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ]
                },
                editParamsForm: {
                    attr_name: '',
                },
                editId: '',  //临时保存被编辑参数的id
                inputVisible: false,
                inputValue: '',

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status === 200) {
                    this.cateList = res.data
                } else {
                    this.$message.error('获取列表失败')
                }
            },
            //监听级联选择器的改变状态
            cascaderChanged() {
                this.getParamsdata()
            },
            handleTabsClick() {
                this.getParamsdata()
            },
            async getParamsdata() {
                //如果选中的不是三级分类，不往下执行
                if (this.selectedCatekeys.length !== 3) {
                    this.selectedCatekeys = []
                    this.manyData = []
                    this.onlyData = []
                }

                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                    {params: {sel: this.activeName}})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                } else {
                    //提前把data里的数据处理了，给每项添加两项属性，一项是控制文本框的显示，一项是绑定文本框的值
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        // 控制文本框的显示与隐藏
                        item.inputVisible = false
                        // 文本框中输入的值
                        item.inputValue = ''
                    })

                    //判断返回值的是动态参数还是静态属性，赋给相应的值存放起来
                    if (this.activeName === 'many') {
                        this.manyData = res.data
                    } else {
                        this.onlyData = res.data
                    }
                }
            },
            addParamsTanKuangIsClosed() {
                //清空表单信息
                this.$refs.addParamsFormRef.resetFields()
            },
            confirmAddParams() {
                this.$refs.addParamsFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                            attr_name: this.addParamsForm.attr_name,
                            attr_sel: this.activeName,
                        })
                        console.log(res);
                        if (res.meta.status !== 201) {
                            this.$message.error(res.meta.msg)
                        } else {

                            this.$message.success('添加成功')
                            this.addParamsTanKuangIsShow = false
                            this.getParamsdata();
                        }
                    } else {
                        this.$message.error('请注意格式')
                    }
                })
            },
            async editParams(attrId) {
                //先获取数据
                this.editId = attrId
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`)
                if (res.meta.status === 200) {
                    this.editParamsForm.attr_name = res.data.attr_name
                } else {
                    this.$message.error(res.meta.msg)
                }

                this.editParamsTanKuangIsShow = true
            },
            confirmEdit() {
                this.$refs.editParamsFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editId}`, {
                            attr_name: this.editParamsForm.attr_name,
                            attr_sel: this.activeName,
                        })
                        if (res.meta.status === 200) {
                            this.$message.success('编辑成功')
                            this.editParamsTanKuangIsShow = false
                            this.getParamsdata()
                        } else {
                            this.$message.error(res.meta.msg)
                        }
                    } else {
                        this.$message.error('请注意格式')
                    }
                })
            },
            //判断编辑弹框是否关闭  //清空表单信息
            editParamsTanKuangIsClosed() {
                this.$refs.editParamsFormRef.resetFields()
            },

            deleteParams(deleteId) {
                this.$confirm('此操作将永久删除该参数, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${deleteId}`)
                    if (res.meta.status === 200) {
                        this.$message.success('删除成功')
                        this.getParamsdata()
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //当文本框enter按下，或者失去焦点是执行
            handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return null
                } else {
                    row.attr_vals.push(row.inputValue.trim())
                    row.inputValue = ''
                    row.inputVisible = false
                    this.saveAttrvals(row)
                }
            },
            showInput(row) {
                row.inputVisible = true
                //$nextTick函数的意思是，当页面渲染完成后才调用回调函数里的方法
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },


            async saveAttrvals(row) {
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    this.$message.success('修改参数成功')
                }
            },

            deleteTag(index, row) {
                row.attr_vals.splice(index, 1)
                this.saveAttrvals(row)

            }
        },


        computed: {
            isBtnDisabled() {
                if (this.selectedCatekeys.length !== 3) {
                    return true
                } else {
                    return false
                }
            },
            cateId() {
                if (this.selectedCatekeys.length === 3) {
                    return this.selectedCatekeys[2]
                } else {
                    return null
                }
            },
            //计算 添加参数的时候弹框标题的动态变化的
            title() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }

        }
    }
</script>

<style lang="less" scoped>
    .el-row {
        margin-bottom: 15px;
        margin-top: 15px;
    }

    .el-tag {
        margin: 10px;
    }

    .el-input {
        width: 150px;
    }

</style>