<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-button type="primary" @click="addCate">添加分类</el-button>
            <!--            数据列表展示区-->
            <tree-table class="treetable" :data="cateList" :columns="columns"
                        :selection-type="false" :expand-type="false" show-index
                        border>
                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level ===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="caozuo" slot-scope="scope">
                    <!--编辑按钮-->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑
                    </el-button>

                    <!--删除按钮-->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">
                        删除
                    </el-button>


                </template>

            </tree-table>
            <!--底部页码显示区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <!--        添加用户弹窗-->
            <el-dialog title="添加商品分类" :visible.sync="addCateTankuangIsShow" width="50%"
                       @close="addCateTanKuangIsClosed">
                <!--内容主题区域-->
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">  <!--prop是指向校验规则的-->
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级名称">
                        <!--                        options 是绑定数据源的，props是配置显示项的-->
                        <el-cascader
                                v-model="parentCate"
                                :options="parentCateList"
                                :props="propsSet"
                                :clearable="true"
                                @visible-change="elCascaderOnlick"
                                @expand-change="elCascaderOnlick"
                                @change="parentCateChanged">
                        </el-cascader>
                    </el-form-item>

                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateTankuangIsShow = false">取 消</el-button>
                    <el-button type="primary" @click="confirmCate">确 定</el-button>
                 </span>
            </el-dialog>
            <!--编辑商品分类-->
            <el-dialog title="编辑商品分类" :visible.sync="editCateTankuangIsShow" width="50%"
                       @close="editCateTanKuangIsClosed">
                <!--内容主题区域-->
                <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">  <!--prop是指向校验规则的-->
                        <el-input v-model="editCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <!--底部区域-->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCateTankuangIsShow = false">取 消</el-button>
                    <el-button type="primary" @click="confirmEdit">确 定</el-button>
                 </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data() {
            return {
                //商品分类列表数组，默认为空
                cateList: [],
                //提交数据的参数
                queryInfo: {
                    type: 3,  //查询参数，可以为空
                    pagenum: 1,  //当前页码值
                    pagesize: 5  //每页显示条数
                },
                total: 0,  //获取到的总条数，
                pageNum: 0, //获取到的页码值
                pageSize: 0,  //过去到的每页显示的条数
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        prop: 'cat_deleted',
                        minWidth: '200px',
                        type: 'template',
                        template: 'isOk',
                    },
                    {
                        label: '排序',
                        prop: 'cat_id',
                        minWidth: '200px',
                        type: 'template',
                        template: 'order',
                    },
                    {
                        label: '操作',
                        minWidth: '200px',
                        type: 'template',
                        template: 'caozuo',
                    },
                ],
                addCateTankuangIsShow: false,
                editCateTankuangIsShow: false,
                addCateForm: {
                    cat_pid: 0,
                    cat_name: '',
                    cat_level: 0
                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ]
                },
                parentCate: [],   //选择的父级分类
                parentCateList: [],  //获取到的父级分类列表，默认为空
                propsSet: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly:true  //change-on-select 这个直接添加到标签上，但是现在被淘汰了，效果类似
                },
                editCateForm: {
                    cat_name: ''
                },
                //临时保存被编辑的分类的id
                editId: 0,
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    this.$message.error('获取商品分类列表失败')
                } else {
                    this.cateList = res.data.result
                    this.total = res.data.total
                    this.pageNum = res.data.pagenum
                    this.pageSize = res.data.pagesize
                }
            },
            handleSizeChange(newSize) {  //点击切换每页显示的条数
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage) {  //根据当前的页码值来切换当前的页面
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            addCate() {
                //先获取父级分类的列表
                this.getParentCateList()
                this.addCateTankuangIsShow = true
            },
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})
                if (res.meta.status !== 200) {
                    this.$message.error('获取商品分类列表失败')
                } else {
                    this.parentCateList = res.data
                    // console.log(this.parentCateList);
                }
            },
            //当选项框内的值发生变化时
            parentCateChanged() {
                // 监听父级分类绑定的数组的长度,如果长度为0，说明添加的是一
                // 级分类，如果长度为1，说明添加的事二级分类，如果长度为2，说明添加
                // 的是三级分类
                if (this.parentCate.length > 0) {
                    //需要取出真正父级元素的id，和分类的层级
                    this.addCateForm.cat_pid = this.parentCate[this.parentCate.length - 1]
                    this.addCateForm.cat_level = this.parentCate.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                    //这里要注意了，当创建一级分类是，如果没有改变过级联选择器里的值，那么这个函数不会监听到，所以在addCateForm
                    //里cat_pid和cat_level的初始值设置成0（我在这里调试了好久）
                }
            },
        //*************************解决级联选择器在任意级选择只能点击圆点的问题****************************
            elCascaderOnlick() {
                let that = this;
                setTimeout(function () {
                    document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                        el.onclick = function () {
                            this.previousElementSibling.click();
                            that.$refs.addCateFormRef.dropDownVisible = false;
                        };
                    });
                    document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
                            el.onclick = function () {
                                that.$refs.addCateFormRef.dropDownVisible = false;
                            };
                        });
                }, 100);
            },


            confirmCate() {
                console.log(this);
                this.$refs.addCateFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.post('categories', this.addCateForm)
                        if (res.meta.status === 201) {
                            this.$message.success('添加分类成功')
                            this.addCateTankuangIsShow = false
                            this.getCateList()
                        } else {
                            this.$message.error(res.meta.msg)
                        }
                    } else {
                        this.$message.error('请输入正确格式')
                    }
                })
            },

            addCateTanKuangIsClosed() {
                this.addCateForm.cat_name = ''
                this.parentCate = [];
            },

            async editCate(cateId) {
                // console.log(typeof cateId);
                this.editId = cateId
                const {data: res} = await this.$http.get('categories/' + cateId)
                if (res.meta.status === 200) {
                    this.editCateForm.cat_name = res.data.cat_name
                    this.editCateTankuangIsShow = true
                } else {
                    this.$message.error(res.meta.msg)
                }
            },
            confirmEdit() {
                this.$refs.editCateFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.put('categories/' + this.editId,
                            this.editCateForm)
                        console.log(res);
                        if (res.meta.status === 200) {
                            this.$message.success('编辑分类成功')
                            this.editCateTankuangIsShow = false
                            this.getCateList()
                        } else {
                            this.$message.error(res.meta.msg)
                        }
                    } else {
                        this.$message.error('请输入正确格式')
                    }
                })
            },
            editCateTanKuangIsClosed() {
                this.editCateForm.cat_name = ''
            },

            deleteCate(deleteId) {
                this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete('categories/' + deleteId)
                    if (res.meta.status === 200) {
                        this.$message.success('删除成功')
                        this.getCateList()
                    } else {
                        this.$message.error('删除失败')
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .treetable {
        margin-top: 15px;
        font-size: 12px;
    }
    .el-cascader {
        width: 100%;
    }
</style>