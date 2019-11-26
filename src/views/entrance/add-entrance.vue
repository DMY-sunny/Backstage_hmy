<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" required prop="start_time">
                <el-date-picker v-model="ruleForm.start_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" required prop="end_time">
                <el-date-picker v-model="ruleForm.end_time" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入口图片" required>
                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :show-file-list="false">
                    <img v-if="ruleForm.en_img" :src="cdn06 + ruleForm.en_img" class="img_auto" />
                    <i class="el-icon-plus" v-else></i>
                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="入口链接" prop="description">
                <el-radio-group v-model="ruleForm.entrance_type">
                    <el-radio :label=1>ems配置</el-radio>
                    <el-radio :label=0>原生大促</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ems活动id" prop="ems_id" v-if="ruleForm.entrance_type == 1">
                <el-input v-model="ruleForm.ems_id" placeholder="只需填入数字id"></el-input>
            </el-form-item>
            <el-form-item label="原生select" prop="select" v-if="ruleForm.entrance_type == 0">
                <el-input v-model="ruleForm.select" placeholder="如需更换请询问技术"></el-input>
            </el-form-item>
            <el-form-item label="是否自动跳转">
                <el-radio-group v-model="ruleForm.jump">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="新用户自动跳转" v-if="ruleForm.jump == 1">
                <el-radio-group v-model="ruleForm.jump_new">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="顶部导航文案" prop="top_nav">
                <el-input v-model="ruleForm.top_nav"></el-input>
            </el-form-item>
            <el-form-item label="分享文案" required prop="share_text">
                <el-input v-model="ruleForm.share_text"></el-input>
            </el-form-item>
            <el-form-item label="分享图片" required>
                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="shareImgSuccess" :show-file-list="false">
                    <img v-if="ruleForm.share_img" :src="cdn06 + ruleForm.share_img" class="img_auto" />
                    <i class="el-icon-plus" v-else></i>
                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                </el-upload>
            </el-form-item>
            <!-- <el-form-item label="三端展示">
                <el-radio-group v-model="ruleForm.show_type">
                    <el-radio :label=1>分端展示</el-radio>
                    <el-radio :label=0>全部</el-radio>
                </el-radio-group>
                <el-checkbox v-model="ruleForm.is_xcx">小程序</el-checkbox>
                <el-checkbox v-model="ruleForm.is_h5">h5</el-checkbox>
                <el-checkbox v-model="ruleForm.is_app">app</el-checkbox>
            </el-form-item> -->
            <el-form-item label="展示商品展示框">
                <el-radio-group v-model="ruleForm.act_flag">
                    <el-radio :label=1>显示</el-radio>
                    <el-radio :label=0>不显示</el-radio>
                </el-radio-group>
                <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="goodsImgSuccess" :show-file-list="false" v-if="ruleForm.act_flag == 1">
                    <img v-if="ruleForm.goods_act_img" :src="cdn06 + ruleForm.goods_act_img" class="img_auto" />
                    <i class="el-icon-plus" v-else></i>
                    <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="价格倒计时展示" v-if="ruleForm.act_flag == 1">
                <el-radio-group v-model="ruleForm.djs_flag">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="展示底部子入口">
                <el-radio-group v-model="ruleForm.bottom_flag">
                    <el-radio :label=1>是</el-radio>
                    <el-radio :label=0>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="子入口配置" prop="share_text" v-if="ruleForm.bottom_flag == '1'">
                <el-button type="primary" round @click="addBottomEntrance">新增子入口</el-button>
                <el-form-item :label="'子入口'+(index+1)" prop="share_text" v-for="(item,index) in ruleForm.bottom" :key="index">
                    <el-input value="不可操作" :disabled="disabled" v-if="index < 1"></el-input>
                    <el-button type="primary" round @click="deleteBottomEntrance(index)" v-else>删除子入口</el-button>
                    <el-form-item label="背景图片" required>
                        <div @click="bottomImg(index)">
                            <el-upload class="uploads-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="bottomImgSuccess" :show-file-list="false">
                                <img v-if="item.bg_img" :src="cdn06 + item.bg_img" class="img_auto" />
                                <i class="el-icon-plus" v-else></i>
                                <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="链接列表" prop="share_text">
                        <el-button type="primary" round @click="addBottomLink(index)">新增链接</el-button>
                        <el-form-item :label="'链接'+(sindex+1)" prop="share_text" v-for="(sitem,sindex) in item.link_list" :key="sindex">
                            <el-input value="不可操作" :disabled="disabled" v-if="sindex < 1"></el-input>
                            <el-button type="primary" round @click="deleteBottomLink(index,sindex)" v-else>删除链接</el-button>
                            <el-form-item label="小程序链接" required prop="share_text">
                                <el-input v-model="sitem.link"></el-input>
                            </el-form-item>
                            <el-form-item label="h5链接" prop="share_text">
                                <el-input v-model="sitem.h5_link"></el-input>
                            </el-form-item>
                        </el-form-item>
                    </el-form-item>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即{{ruleForm.activity_id?"修改":"创建"}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

import { entranceSave, entranceDetail } from '@/api/entrance.js'
export default {
    data() {
        return {
            image_host: "",
            ems_id: '',
            disabled: true,
            bottom_img_index: 0,
            ruleForm: {
                name: '',
                jump: 0,
                jump_new: 0,
                entrance_type: 1,
                select: 2,
                top_nav: '活动',
                share_text: "",
                end_time: "",
                start_time: "",
                share_img: "",
                en_img: "",
                en_link: "",
                en_link_app: '',
                show_link: "",
                bottom_flag: 0,
                show_type: 0,
                act_flag: 0,
                djs_flag: 0,
                goods_act_img: '',
                select: 2,
                is_xcx: true,
                is_h5: true,
                is_app: true,
                bottom: [{ 'bg_img': '', link_list: [{ 'link': '', 'h5_link': '' }] }]
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                share_text: [
                    { required: true, message: '请输入分享文案', trigger: 'blur' }
                ],
                en_img: [
                    { required: true, message: '请上传入口图片', trigger: 'blur' }
                ],
                start_time: [
                    { type: 'date', required: true, message: '请输入开始时间', trigger: 'change' }
                ],
                end_time: [
                    { type: 'date', required: true, message: '请输入结束时间', trigger: 'change' }
                ],
                ems_id: [
                    { required: true, message: '请输入ems活动的id,必须是数字', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        let activity_id = this.$route.query.id
        if (activity_id) {
            entranceDetail({ activity_id: activity_id }).then(res => {
                this.ruleForm = res.data
                this.image_host = res.data.image_host
                this.ruleForm.end_time = new Date(res.data.end_time * 1000)
                this.ruleForm.start_time = new Date(res.data.start_time * 1000)
            })
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.ruleForm.entrance_type == 0) {
                        this.ruleForm.ems_id = ''
                        this.ruleForm.en_link = ''
                        this.ruleForm.en_link_app = ''
                        this.ruleForm.show_link = '/dist/index/saleact'
                    } else {
                        if (this.ruleForm.ems_id == '') {
                            this.$notify({
                                title: '请填写ems配置的活动id',
                                message: res.errmsg,
                                type: 'error'
                            })
                            return
                        }
                        this.ruleForm.en_link = `/dist/childActivity?id=${this.ruleForm.ems_id}&isTopNav=1`
                        this.ruleForm.en_link_app = `/dist/childActivity?id=${this.ruleForm.ems_id}&isNav=1`
                        this.ruleForm.show_link = `/dist/childActivity?id=${this.ruleForm.ems_id}`
                    }
                    entranceSave(this.ruleForm).then(res => {
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
                } else {
                    return false;
                }
            });
        },
        handleAvatarSuccess(res, file, index) {
            this.ruleForm.en_img = res.data.image_url
            this.image_host = res.data.image_host
        },
        shareImgSuccess(res, file, index) {
            this.ruleForm.share_img = res.data.image_url
            this.image_host = res.data.image_host
        },
        goodsImgSuccess(res, file, index) {
            this.ruleForm.goods_act_img = res.data.image_url
            this.image_host = res.data.image_host
        },
        bottomImgSuccess(res, file, index) {
            this.ruleForm.bottom[this.bottom_img_index].bg_img = res.data.image_url
            this.image_host = res.data.image_host
        },
        bottomImg(index) {
            this.bottom_img_index = index
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        addBottomEntrance() {
            this.ruleForm.bottom.push({ 'bg_img': '', link_list: [{ 'link': '', 'h5_link': '' }] })
        },
        deleteBottomEntrance(index) {
            this.ruleForm.bottom.splice(index, 1)
        },
        addBottomLink(index) {
            this.ruleForm.bottom[index].link_list.push({ 'link': '', 'h5_link': '' })
        },
        deleteBottomLink(index, sindex) {
            this.ruleForm.bottom[index].link_list.splice(sindex, 1)
        }
    }
}
</script>
<style>
.uploads-demo .el-upload {
    width: auto;
    height: auto;
    min-width: 146px;
}
.img_auto {
    height: 200px;
    object-fit: cover;
    width: auto;
}
</style>