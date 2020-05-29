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
            <!--2.在组件里定义echarts-->
            <div id="main" style="width: 700px;height:400px;"></div>
        </el-card>
    </div>

</template>

<script>
    //1.引入 echarts
    import echarts from 'echarts'
    //引入lodash 模块
    import _ from 'lodash'
    export default {
        name: "Report",
        data() {
            return {
                //需要合并的对象
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        created() {
        },
        async mounted() {
            //3.基于准备好的dom，初始化 echarts 实例
            var myChart = echarts.init(document.getElementById('main'))

            //4.准备数据和配置项
            // var option = {
            //     title: {
            //         text: 'ECharts 入门示例'
            //     },
            //     tooltip: {},
            //     legend: {
            //         data:['销量']
            //     },
            //     xAxis: {
            //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '销量',
            //         type: 'bar',
            //         data: [5, 20, 36, 10, 10, 20]
            //     }]
            // };
            //5.使用刚指定的配置项和数据显示图表。
            const {data: res} =await this.$http.get('reports/type/1')
            if(res.meta.status !==200){
                this.$message.error(res.meta.msg)
            }else {
                //合并
                const result = _.merge(res.data,this.options)
                myChart.setOption(result);
            }
        },
        methods:{

        }
    }
</script>

<style lang="less" scoped>

</style>