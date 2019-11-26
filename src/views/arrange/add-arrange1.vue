<template>
    <div>
        <div class="h100 left_img"><img :src="cdn04 + 'activity/page1.png'" alt=""></div>
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
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
                        <div v-for="(sitem,sindex) in ruleForm.top_data" :key="sindex" class="div1">
                            <p>
                                <span class="text">链接{{sindex + 1}}</span>
                                <!-- <el-button type="danger" v-if="sindex > 0" @click="delateTopData(sindex)">删除</el-button> -->
                            </p>
                            <el-select v-model="sitem.act_type" placeholder="请选择活动类型">
                                <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                            </el-select>
                            <el-input v-model="sitem.act_id" placeholder="填写活动id"></el-input>
                        </div>
                        <!-- <el-button type="primary" @click="addTopData">新增</el-button> -->
                    </div>
                </div>
                <div>
                    <h1>{{ruleForm.title[2]}}</h1>
                    <div class="right_box">
                        <el-input v-model="ruleForm.celebrate.act_id" placeholder="填写活动id"></el-input>
                    </div>
                </div>
                <div>
                    <h1>{{ruleForm.title[3]}}</h1>
                    <div class="right_box">
                        <div v-for="(sitem,sindex) in ruleForm.zong_data" :key="sindex" class="div1">
                            <p>
                                <span class="text">导航{{sindex + 1}}</span>
                                <el-button type="danger" v-if="sindex > 0" @click="delateZongData(sindex)">删除</el-button>
                            </p>
                            <el-select v-model="sitem.act_type" placeholder="请选择活动类型">
                                <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                            </el-select>
                            <el-input v-model="sitem.act_id" placeholder="填写活动id"></el-input>
                            <el-input v-model="sitem.tag" placeholder="tab文案第一行" maxlength="6" show-word-limit></el-input>
                            <el-input v-model="sitem.icon" placeholder="tab文案第二行" maxlength="6" show-word-limit></el-input>
                        </div>
                        <el-button type="primary" @click="addZongData">新增</el-button>
                    </div>
                </div>
                <div>
                    <h1>{{ruleForm.title[4]}}</h1>
                    <div class="right_box">
                        <div v-for="(sitem,sindex) in ruleForm.brand_data" :key="sindex" class="div1">
                            <p>
                                <span class="text">链接{{sindex + 1}}</span>
                                <!-- <el-button type="danger" v-if="sindex > 0" @click="delateBrandData(sindex)">删除</el-button> -->
                            </p>
                            <el-select v-model="sitem.act_type" placeholder="请选择活动类型">
                                <el-option :label="item.desc" :value="item.act_type" v-for="(item,index) in act_list" :key="index"></el-option>
                            </el-select>
                            <el-input v-model="sitem.act_id" placeholder="填写活动id"></el-input>
                        </div>
                        <!-- <el-button type="primary" @click="addBrandData">新增</el-button> -->
                    </div>
                </div>
            </div>
            <el-button icon="el-icon-check" type="success" @click.stop="submitForm('ruleForm')">保存数据</el-button>
        </el-form>
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
        cmsGetData({ id: 164, tag: 'YEARACT' }).then(res => {
            this.ruleForm = JSON.parse(res.data.data)
            this.show_page = true
            // this.ruleForm.end_time = new Date(res.data.end_time * 1000)
            // this.ruleForm.start_time = new Date(res.data.start_time * 1000)
        })
        actType().then(res => {
            this.act_list = res.data
        })
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let obj = {
                        data: this.ruleForm,
                        groupId: "113",
                        groupName: "运营组配置",
                        mask: "",
                        tag: "YEARACT",
                        title: "周年庆"
                    }
                    console.log(obj)
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
        addBrandData() {
            this.$confirm('确定新增链接吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.brand_data.push({
                    act_type: '6',
                    act_id: ''
                })
            })
        },
        delateBrandData(index) {
            this.$confirm('确定删除链接吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleForm.brand_data.splice(index, 1)
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