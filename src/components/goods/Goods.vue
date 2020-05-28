<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <!--商品搜索框    -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              clearable v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column label="序号" type="index" ></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="90px" ></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="50px" ></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="150px" >
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row.goods_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
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
                    :total="total">
            </el-pagination>
        </el-card>
<!--        添加商品弹框-->
<!--        <el-dialog-->
<!--                title="添加商品"-->
<!--                :visible.sync="addGoodsTanKuangIsShow"-->
<!--                width="50%">-->
<!--            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" >-->
<!--                <el-form-item label="商品名称" prop="goods_name">-->
<!--                    <el-input v-model="addGoodsForm.goods_name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品分类" prop="goods_cat">-->
<!--                    <el-input v-model="addGoodsForm.goods_cat"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品价格" prop="goods_price">-->
<!--                    <el-input v-model="addGoodsForm.goods_price"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品数量" prop="goods_number">-->
<!--                    <el-input v-model="addGoodsForm.goods_number"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品重量" prop="goods_weight">-->
<!--                    <el-input v-model="addGoodsForm.goods_weight"></el-input>-->
<!--                </el-form-item>-->

<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="addGoodsTanKuangIsShow = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="addGoodsTanKuangIsShow = false">确 定</el-button>-->
<!--  </span>-->
<!--        </el-dialog>-->


<!--        编辑商品弹框-->
<!--        <el-dialog-->
<!--                title="编辑商品"-->
<!--                :visible.sync="editGoodsTanKuangIsShow"-->
<!--                width="50%">-->
<!--            <el-form :model="editGoodsForm" :rules="addGoodsFormRules" ref="editGoodsFormRef" label-width="100px" >-->
<!--                <el-form-item label="商品名称" prop="goods_name">-->
<!--                    <el-input v-model="editGoodsForm.goods_name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品价格" prop="goods_price">-->
<!--                    <el-input v-model="editGoodsForm.goods_price"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品数量" prop="goods_number">-->
<!--                    <el-input v-model="editGoodsForm.goods_number"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="商品重量" prop="goods_weight">-->
<!--                    <el-input v-model="editGoodsForm.goods_weight"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="editGoodsTanKuangIsShow = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="editGoodsTanKuangIsShow = false">确 定</el-button>-->
<!--  </span>-->
<!--        </el-dialog>-->

    </div>
</template>

<script>
    export default {
        name: "Goods",
        data() {
            return{
                //查询参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                //商品列表
                goodsList:[],
                //总数据条数
                total:0,
                addGoodsTanKuangIsShow:false,
                editGoodsTanKuangIsShow:false,
                //添加商品的表单验证规则
                addGoodsFormRules: {},
                
                editGoodsForm:{
                    goods_name:'',
                    goods_price:'',
                    goods_number:'',
                    goods_weight:'',
                    goods_introduce:'',
                    pics:'',
                    attrs:''
                }


            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{
            //获取商品列表数据
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods',{params:this.queryInfo})
                if(res.meta.status !==200){
                    this.$message.error(res.meta.msg)
                }else {
                    this.goodsList = res.data.goods
                    this.total = res.data.total
                }

            },
            handleSizeChange(newSize) {  //点击切换每页显示的条数
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getGoodsList()

            },
            handleCurrentChange(newPage) {  //根据当前的页码值来切换当前的页面
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            addGoods() {
                // this.addGoodsTanKuangIsShow = true
                this.$router.push('/goods/add')  //定向跳转到添加商品组件
            },

            editGoods(goodsId) {
                //获取数据添加到编辑表单栏中
                console.log(goods_id);

                this.editGoodsTanKuangIsShow = true
            },
            deleteGoods(goods_id) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data: res} = await this.$http.delete('goods/'+goods_id)
                    if(res.meta.status !== 200){
                        this.$message.error(res.meta.msg)
                    }else {
                        this.getGoodsList()
                        this.$message.success('商品删除成功')
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

</style>