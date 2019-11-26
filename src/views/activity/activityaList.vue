<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-time"></i> 活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form class="demo-form-inline" inline @submit.native.prevent>
                <el-input v-model="key_word" placeholder="请输入活动名称或活动id" @keyup.enter.native="search" class="handle-input mr10" />
                <!-- <el-select v-model="country" class="mr10" placeholder="活动场馆" @change="changeStatus">
                    <el-option :value="item.value" :label="item.name" v-for="(item,index) in cityList" :key="index"> </el-option>
                </el-select> -->
                <!-- <el-select v-model="sort" placeholder="状态" class="mr10" @change="changeStatus">
                    <el-option value="0" label="排序值正序"></el-option>
                    <el-option value="1" label="创建时间倒序"></el-option>
                </el-select> -->
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handletoCreate">创建新活动</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table align="center" :data="tableData" border class="table" v-loading="loading_activity" ref="multipleTable">
                    <el-table-column prop="act_id" label="活动ID" align="center" />
                    <el-table-column prop="title" label="活动名称" align="center" />
                    <el-table-column prop="logo_url" label="活动图片" align="center" width="310">
                        <template slot-scope="scope" v-if="scope.row.logo_url">
                            <img :src="cdn06+scope.row.logo_url" width="240">
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="country" label="活动国家" align="center">
                        <template slot-scope="scope">
                            <el-tag>{{scope.row.country}}</el-tag>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="type" label="活动类型" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.type" :underline="false" type="success">{{scope.row.type}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sale_count" label="销售数量" align="center">
                        <template slot-scope="scope">
                            <el-tag>{{scope.row.sale_count}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sale_total" label="销售总额" align="center">
                        <template slot-scope="scope">
                            <el-tag type="danger">{{scope.row.sale_total}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <el-link v-if="scope.row.status" :underline="false" type="success">{{scope.row.status}}</el-link>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="create_time_text" label="创建时间" align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time" />&nbsp;
                            {{scope.row.create_time_text}}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width="220" fixed="right">
                        <template slot-scope="scope">
                            <div style="margin-bottom: 10px">
                                <a href="javascript:void(0)" class="aintimport"><i class="el-icon-upload2"></i><input class="intimport" icon="el-icon-upload2" type="file" @change="handleImport(scope.row.act_id)">导入</a>
                                <el-button type="primary" size="mini" icon="el-icon-upload2" @click="handlegoodsexport(scope.row.act_id)">导出</el-button>
                            </div>
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                        </template>+-
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background @current-change="handleCurrentChange" :page-sizes="[30, 50, 70, 90]" @size-change="handleSizeChange" layout="sizes, prev, pager, next" :page-size='30' :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    activityList,
    activitylistDelete,
    goosxlsximport,
    goosxlsxgoodsexport
} from '@/api/activity/activity'
import { activitylistImport } from '@/api/other'
import { toDate } from '@/utils/index'
export default {
    name: 'orderList',
    data() {
        return {
            loading_activity: false,
            loading: false,
            tableData: [],
            cur_page: 1,
            page_size: 30,
            key_word: '',
            country: '0',
            sort: '0',
            total: null,
            file: '',
            cityList: []
        }
    },
    created() {
        this.initData()
        // this.getCity()
    },
    computed: {},
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val
            this.initData()
        },
        //        放开自定义条数
        handleSizeChange(val) {
            this.page_size = val
            this.initData()
        },
        //状态改变
        changeStatus() {
            this.initData()
        },
        initData() {
            this.loading_activity = true
            let params = {
                key_word:this.key_word,
                cur_page: this.cur_page,
                page_size: this.page_size,
            }
            activityList(params).then(res => {
                if (res.errno == 0) {
                    this.loading_activity = false
                    this.tableData = res.data.list
                    this.total = res.data.total - 0
                } else {
                    this.$message.error(res.errmsg)
                    this.loading_activity = false
                }
            }).catch(err => {
                this.loading_activity = false
            })
        },
        //获取场馆列表
        // getCity() {
        //     cityList().then(res => {
        //         if (res.errno == 0) {
        //             this.cityList = res.data.list[0]
        //         } else {
        //             this.$message.error(res.errmsg)
        //         }
        //     }).catch(err => {

        //     })
        // },
        search() {
            this.cur_page = 1
            this.initData()
        },
        //新创建活动
        handletoCreate(index, row) {
            // localStorage.setItem('order_id',row.order_id)
            this.$router.push({
                path: '/activityacreate',
            })
        },
        //表格排序修改
        handlerRanknum(row) {
            let sendObj = {
                activity_id: row.act_id,
                rank_num: row.rank_num
            }
            activityranknumUpdate(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message.success('您已修改成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //    操作按钮
        //    是否展示
        handleIsshow(row) {
            let sendObj = {
                activity_id: row.activity_id,
                btn_status: row.is_show_str
            }
            activitylistIsshow(sendObj).then(res => {
                if (res.errno == 0) {
                    // this.$message.success('您已删除成功')
                    this.initData()
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err => {

            })
        },
        //    修改
        handleEdit(row) {
            this.$store.commit('SET_ACTIVITY_ID', row.act_id)
            this.$router.push({
                path: '/activityaupdate'
            })
        },
        //    删除
        handleDelete(row) {
            this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let sendObj = {
                    act_id: row.act_id,
                }
                activitylistDelete(sendObj).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('您已删除成功')
                        this.initData()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            }).catch(() => {
            })
        },
        //导入
        handleImport(id) {
            var windowURL = window.URL || window.webkitURL
            this.file = event.target.files[0]
            if (this.file.size > 0) {
                let formdata = new FormData()
                formdata.append('orderscsv', this.file)
                // let sendObj = {
                //     act_id:id,
                //     orderscsv:formdata,
                // }
                goosxlsximport(formdata,id).then(res => {
                    if (res.errno == 0) {
                        this.$message.success('共导入 ' + res.data.ok + ' 条数据，导入失败数据的商品名称是：' + res.data.goodsNameNull)
                        this.initData()
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {

                })
            }
        },
        // 导出
        handlegoodsexport(id){
            let export_url = `/api/act/main/goodsexport?act_id=${id}`
            window.location.href = export_url
            this.$message({
                message: "导出成功!",
                type: "success"
            });
        }
    }
}
</script>

<style scoped>
.aintimport {
    position: relative;
    color: #fff;
    background-color: #f56c6c;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 12px;
    border-color: #f56c6c;
    cursor: pointer;
}
.intimport {
    opacity: 0;
    z-index: 10;
    position: absolute;
    right: 0px;
    top: 2px;
    width: 60px;
    height: 30px;
    cursor: pointer;
}
.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 12px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}
</style>
