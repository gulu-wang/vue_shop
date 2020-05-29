<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <!--商品搜索框    -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              clearable v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAddress"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location"
                                   @click="queryExpress(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="修改地址"
                :visible.sync="editOrdersTanKuangIsShow"
                width="50%" @close="editOrdersTanKuangIsClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市县/区" prop="address1">
                    <el-cascader
                            v-model="selectAdressKeys"
                            :options="cityData"
                            :props="{ expandTrigger: 'hover' }"
                            @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOrdersTanKuangIsShow = false">取 消</el-button>
                <el-button type="primary" @click="editOrdersTanKuangIsShow = false">确 定</el-button>
          </span>
        </el-dialog>

        <!--        查询物流信息弹框-->
        <el-dialog
                title="物流信息"
                :visible.sync="queryExpressTanKuangIsShow"
                width="50%" @close="queryExpressTanKuangIsClosed">

            <el-timeline>
                <el-timeline-item
                        v-for="(item, index) in ExpressInfo"
                        :key="index"
                        :timestamp="item.time">
                    {{item.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import cityData from './citydata.js'

    export default {
        name: "Order",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5,
                },
                total: 0,
                goodsList: [],
                editOrdersTanKuangIsShow: false,
                queryExpressTanKuangIsShow: false,
                addressForm: {
                    address1: [],
                    address2: ''
                },
                addressFormRules: {
                    address1: [
                        {required: true, message: '请选择地址', trigger: 'blur'},
                    ],
                    address2: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
                    ]
                },
                selectAdressKeys: [],//级联选择器的选中的地址
                cityData,
                ExpressInfo: [], //物流信息数组对象

            }
        },
        created() {
            this.getOrdersList()
        },
        methods: {
            async getOrdersList() {
                const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
                // console.log(res)
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    this.total = res.data.total
                    this.goodsList = res.data.goods
                }
            },
            searchGoods() {
                this.getOrdersList();
            },
            handleSizeChange(newPageSize) {
                this.queryInfo.pagesize = newPageSize
                this.getOrdersList()
            },
            handleCurrentChange(newPageNum) {
                this.queryInfo.pagenum = newPageNum
                this.getOrdersList()
            },
            editAddress() {
                this.editOrdersTanKuangIsShow = true

            },
            handleChange() {

            },
            editOrdersTanKuangIsClosed() {
                this.$refs.addressFormRef.resetFields()
            },
            async queryExpress(orderId) {
                //先获取物流信息
                const {data: res} = await this.$http.get('/kuaidi/1106975712662')
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                } else {
                    // console.log(res.data);
                    this.ExpressInfo = res.data
                }
                this.queryExpressTanKuangIsShow = true
            },
            queryExpressTanKuangIsClosed() {
                // this.$refs.addressFormRef.resetFields()
            }

        }
    }
</script>

<style lang="less" scoped>

</style>