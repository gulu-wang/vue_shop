<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-alert title="添加商品信息" type="info" center></el-alert>
<!--            步骤条-->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef"
                     label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'"
                         :before-leave="beforeLeaveTab" @tab-click="tabClick" >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!--级联选择框-->
                            <el-cascader
                                    v-model="selectedCatekeys"
                                    :options="cateList"
                                    :props="props"
                                    @change="cascaderChanged">
                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item1.attr_name" prop="" v-for="(item1,index) in manyData" :key="index">
                            <el-checkbox-group v-model="item1.attr_vals">
                                <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name"  v-for="(item,index) in onlyData" :key="index">
                            <el-input v-model="item.attr_vals" ></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                                :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture"
                                :headers="headers"
                                :on-success="loadSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
<!--        图片预览弹框-->
        <el-dialog
                title="图片预览"
                :visible.sync="picYuLanTanKuangIsShow"
                width="50%"
                center>
            <img :src="prevPath" alt="" class="prevpic">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Add",
        data() {
            return{
                activeIndex:'0',

                addGoodsForm:{
                    goods_name:'',
                    goods_cat:'',
                    goods_price:'',
                    goods_number:'',
                    goods_weight:'',
                    goods_introduce:'',
                    pics:[],
                    attrs:[]

                },
                addGoodsFormRules:{
                    goods_name:[
                        { required:true,message:'请输入商品名称',trigger:'blur' }
                    ],
                    goods_cat:[
                        { required:true,message:'请选择商品分类',trigger:'blur' }
                    ],
                    goods_price:[
                        { required:true,message:'请输入商品价格',trigger:'blur' }
                    ],
                    goods_number:[
                        { required:true,message:'请输入商品数量',trigger:'blur' }
                    ],
                    goods_weight:[
                        { required:true,message:'请输入商品重量',trigger:'blur' }
                    ],
                },
                //存放级联选择器中选择的分类值
                selectedCatekeys:[],
                //获取来的分类参数
                cateList:[],
                props:{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                manyData:[],  //存放获取来的动态参数
                onlyData:[],  //存放获取来的静态属性
                // 图片上传地址
                uploadURL : 'http://127.0.0.1:8888/api/private/v1/upload',
                //配置图片上传请求头对象
                headers:{
                    Authorization : window.sessionStorage.getItem('token')
                },
                //商品图片的绝对路径
                prevPath:'',
                picYuLanTanKuangIsShow:false //图片预览弹框是否显示。默认隐藏
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if(res.meta.status !== 200){
                    this.$message.error(res.meta.msg)
                }else {
                    this.cateList = res.data
                }
            },
            cascaderChanged() {

            },
            beforeLeaveTab(activeName,oldActiveName) {
                if(oldActiveName === '0' && this.selectedCatekeys.length !==3){
                    this.$message.error('请选择商品分类')
                    return false
                }else {
                    return true
                }
            },
            async tabClick() {
                //动态参数
                if(this.activeIndex ==='1'){
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                        params:{sel:'many'}
                    })
                    // console.log(res);
                    if(res.meta.status !== 200){
                        this.$message.error(res.meta.msg)
                    }else {
                        res.data.forEach(item=>{
                            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        })
                        this.manyData = res.data
                    }
                }
                //静态属性
                if(this.activeIndex === '2'){
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                        params:{sel:'only'}
                    })
                    // console.log(res.data);
                    if(res.meta.status !== 200){
                        this.$message.error(res.meta.msg)
                    }else {
                        this.onlyData = res.data
                    }
                }
                if(this.activeIndex === '3'){
                    
                }


            },
            //点击预览图片,返回一个对象
            handlePreview(obj) {
                console.log(obj);
                this.prevPath = obj.response.data.url
                this.picYuLanTanKuangIsShow = true
            },
            //监听图片删除操作
            handleRemove(obj) {
                //删除成功返回一个对象
                // console.log(obj);
                let picPath = obj.response.data.tmp_path
                let index = this.addGoodsForm.pics.findIndex(item=>{
                    return item.pic === picPath
                })
                this.addGoodsForm.pics.splice(index,1)
                // console.log(this.addGoodsForm.pics)
            },
            //上传成功后的回调函数
            loadSuccess(response) {
                //将返回的图片临时路径保存添加到添加商品表单
                // console.log(response);
                //1.先拼接成一个图片信息对象
                let obj = {pic: response.data.tmp_path}
                //2.再将对象插到上传表单的pics数组中
                this.addGoodsForm.pics.push(obj)

            },
            addGoods() {
                this.addGoodsForm.goods_cat = this.selectedCatekeys.join(',')
                //处理动态参数
                console.log(this.manyData)
                this.manyData.forEach(item1=>{
                    const manyInfo = {
                        attr_id: item1.attr_id,
                        attr_value: item1.attr_vals.join(' ')
                    }
                    this.addGoodsForm.attrs.push(manyInfo)
                })
                //处理静态属性
                console.log(this.onlyData);
                this.onlyData.forEach(item2=>{
                    const onlyInfo = {
                        attr_id: item2.attr_id,
                        attr_value: item2.attr_vals
                    }
                    this.addGoodsForm.attrs.push(onlyInfo)
                })
                console.log(this.addGoodsForm);
                this.$refs.addGoodsFormRef.validate(async valid=>{
                    if(valid){
                        const {data: res} = await this.$http.post('goods',this.addGoodsForm)
                        console.log(res);
                        if(res.meta.status !==201){
                            this.$message.error(res.meta.msg)
                        }else {
                            this.$message.success('商品添加成功')
                            this.$router.push('/goods')
                        }
                    }else {
                        this.$message.error('请输入正确的格式')
                    }
                })
            }
        },
        computed:{
            cateId() {
                if(this.selectedCatekeys.length !==3){
                    return null
                }else {
                    return this.selectedCatekeys[2]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-steps {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .el-cascader {
        width: 30%;
    }
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .prevpic{
        width: 100%;
    }

</style>