<template>
    <div>
        <div class="h100 left_img"><img :src="cdn04 + 'activity/page4.png'" alt=""></div>
        <div class="right_wrap h100" v-if="show_page">
            <div>
                <h1>{{ruleForm.title[0]}}</h1>
                <div class="right_box">
                    <div v-for="(sitem,sindex) in ruleForm.lun_data" :key="sindex" class="div1">
                        <p>
                            <span class="text">链接{{sindex + 1}}</span>
                            <!-- <el-button type="danger" v-if="sindex > 0" @click="delateToast(sindex)">删除</el-button> -->
                        </p>
                        <el-select v-model="sitem.act_type" placeholder="请选择活动类型">
                            <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                        </el-select>
                        <el-input v-model="sitem.act_id" placeholder="填写活动id"></el-input>
                    </div>
                    <!-- <el-button type="primary" @click="addToast">新增</el-button> -->
                </div>
            </div>
            <div>
                <h1>{{ruleForm.title[1]}}</h1>
                <div class="right_box">
                    <div v-for="(sitem,sindex) in ruleForm.roller_list" :key="sindex" class="div1">
                        <p>
                            <span class="text">秒杀场次{{sindex + 1}}</span>
                            <!-- <el-button type="danger" v-if="sindex > 0" @click="deleteRollerList(sindex)">删除</el-button> -->
                        </p>
                        <el-select v-model="sitem.act_type" placeholder="请选择活动类型">
                            <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                        </el-select>
                        <el-input v-model="sitem.act_id" placeholder="填写活动id"></el-input>
                        <el-date-picker v-model="sitem.start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" placeholder="选择开始时间">
                        </el-date-picker>
                        <el-date-picker v-model="sitem.end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" placeholder="选择结束时间">
                        </el-date-picker>
                    </div>
                    <!-- <el-button type="primary" @click="addRollerList">新增</el-button> -->
                </div>
            </div>
            <div>
                <h1>{{ruleForm.title[2]}}</h1>
                <div class="right_box">
                    <div class="div1">
                        <el-select v-model="ruleForm.celebrate.act_type" placeholder="请选择活动类型">
                            <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                        </el-select>
                        <el-input v-model="ruleForm.celebrate.act_id" placeholder="填写活动id"></el-input>
                    </div>
                </div>
            </div>
        </div>
        <el-button icon="el-icon-check" type="success" @click.stop="submitForm()">保存数据</el-button>
    </div>
</template>
<script>

import { actType, cmsCreateData, cmsGetData } from '@/api/arrange.js'
export default {
    data() {
        return {
            image_host: "",
            ems_id: '',
            disabled: true,
            bottom_img_index: 0,
            ruleForm: {},
            act_list: [],
            show_page: false
        };
    },
    created() {
        cmsGetData({ id: 164, tag: 'YEARACT4' }).then(res => {
            this.ruleForm = JSON.parse(res.data.data)
            this.show_page = true
            for (let i = 0; i < this.ruleForm.roller_list.length; i++) {
                this.ruleForm.roller_list[i].end_time = this.ruleForm.roller_list[i].end_time * 1000
                this.ruleForm.roller_list[i].start_time = this.ruleForm.roller_list[i].start_time * 1000
            }
        })
        actType().then(res => {
            this.act_list = res.data
        })
    },
    methods: {
        submitForm(formName) {
            for (let i = 0; i < this.ruleForm.roller_list.length; i++) {
                this.ruleForm.roller_list[i].end_time = this.ruleForm.roller_list[i].end_time / 1000
                this.ruleForm.roller_list[i].start_time = this.ruleForm.roller_list[i].start_time / 1000
            }
            let obj = {
                data: this.ruleForm,
                groupId: "113",
                groupName: "运营组配置",
                mask: "",
                tag: "YEARACT4",
                title: "周年庆"
            }
            cmsCreateData(obj).then(res => {
                if (res.errno === 0) {
                    this.$notify({
                        title: '成功',
                        message: res.errmsg,
                        type: 'success'
                    })
                    this.$router.go(-1)
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.errmsg
                    })
                }
            })
        },
        addToast() {
            this.$confirm('确定新增链接吗，请将新增图片给到技术', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.lun_data.push({
                    act_type: '6',
                    act_id: ''
                })
            })
        },
        delateToast(index) {
            this.$confirm('确定删除链接吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.lun_data.splice(index, 1)
            })
        },
        addTopData() {
            this.$confirm('确定新增链接吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.top_data.push({
                    act_type: '6',
                    act_id: ''
                })
            })
        },
        delateTopData(index) {
            this.$confirm('确定删除链接吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.top_data.splice(index, 1)
            })
        },
        addRollerList() {
            this.$confirm('确定新增场次吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.roller_list.push({
                    act_type: '6',
                    act_id: '',
                    start_time: '',
                    end_time: '',
                    num: 6
                })
            })
        },
        deleteRollerList(index) {
            this.$confirm('确定删除场次吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.roller_list.splice(index, 1)
            })
        },
        addZongData() {
            this.ruleForm.zong_data.push({
                tag: '',
                icon: '',
                num: 12,
                act_id: '',
                act_type: '6'
            })
        },
        delateZongData(index) {
            this.$confirm('确定删除导航吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.zong_data.splice(index, 1)
            })
        }
    }
}
</script>
<style>
.h100 {
    max-height: 100vh;
    overflow-y: auto;
}
.left_img {
    width: 30%;
    float: left;
    margin-right: 10%;
}
.left_img img {
    width: 100%;
    display: block;
}
.right_wrap {
    float: left;
    width: 50%;
}
.right_wrap h1 {
    font-size: 20px;
}
.right_box {
    border: 4px solid skyblue;
    padding: 2%;
    box-sizing: border-box;
    margin-bottom: 20px;
}
.right_box .div1 {
    margin-bottom: 10px;
}
.right_box p .text {
    padding-right: 20px;
}
</style>