<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 新增活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="活动ID">
                            <el-input v-model="form.act_id" disabled />
                        </el-form-item>
                        <el-form-item label="活动名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="活动类型" prop="type">
                            <el-radio-group v-model="form.type" @change="typeChange(form.type)">
                                <el-radio :label='1'>第二件半价</el-radio>
                                <el-radio :label='2'>换购</el-radio>
                                <el-radio :label='100'>0元购</el-radio>
                                <el-radio :label='101'>微信分享</el-radio>
                                <el-radio :label='3'>N元任选</el-radio>
                                <el-radio :label='4'>买A赠B</el-radio>
                                <el-radio :label='5'>折扣专区</el-radio>
                                <el-radio :label='6'>限量秒杀</el-radio>
                                <el-radio :label='7'>买N免M</el-radio>
                                <el-radio :label='8'>预付定金</el-radio>
                                <el-radio :label='9'>前五分钟半价</el-radio>
                                <el-radio :label='13'>定金膨胀</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 换购 -->
                        <el-form-item label="换购额度" prop="cut" v-if="form.type == 2">
                            满
                            <el-input v-model="form.full" placeholder="0" />
                            加
                            <el-input v-model="form.avg_price" placeholder="0" />
                        </el-form-item>
                        <!-- N元任选 -->
                        <el-form-item label="N元任选" prop="purchase_data" v-if="form.type == 3">
                            满
                            <el-input v-model="form.fulln" placeholder="0" />
                            选
                            <el-input v-model="form.cut" placeholder="0" />
                        </el-form-item>
                        <!-- 折扣额度 -->
                        <el-form-item label="折扣额度" prop="discount" v-if="form.type == 5">
                            <el-tag v-for="(tag,index) in form.discount_data.discount" :key="index" closable @close="discountDelete(index)">
                                {{tag.num}}件{{tag.dis}}折
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" :span="20" />
                            件
                            <el-input v-model="discount_diss" placeholder="0" :span="20" />
                            折
                            <el-button @click="discountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 买N免N -->
                        <el-form-item label="买N免N" prop="buydiscount" v-if="form.type == 7">
                            <el-tag v-for="(tag,index) in form.discount_data.buydiscount" :key="index" closable @close="buynfreemDelete(index)">
                                买{{tag.num}}免{{tag.dis}}
                            </el-tag>
                            买
                            <el-input v-model="discount_num" placeholder="0" />
                            免
                            <el-input v-model="discount_diss" placeholder="0" />
                            <el-button @click="buydiscountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 换购 -->
                        <el-form-item label="尾款时间" prop="cut" v-if="form.type == 13">
                            支付尾款开始时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.earnest_money_params.start_time" type="datetime" placeholder="选择开始时间">
                            </el-date-picker>
                            支付尾款结束时间
                            <el-date-picker class="all_width" value-format="timestamp" v-model="form.earnest_money_params.end_time" type="datetime" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="start_time">
                            <el-date-picker class="all_width" v-model="form.start_time" type="datetime" value-format="yyyy-MM-ddTHH:mm" placeholder="选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="end_time">
                            <el-date-picker class="all_width" v-model="form.end_time" type="datetime" value-format="yyyy-MM-ddTHH:mm" placeholder="选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="form.status">
                                <el-radio :label='0'>未发布</el-radio>
                                <el-radio :label='1'>已发布</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="上传banner" label-width="90px">
                            <el-upload class="upload-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="banner图" prop="logo_url">
                            <img v-if="form.logo_url" :src="cdn06 + form.logo_url" class="logo" width="200">
                        </el-form-item>
                        <div v-show="form.type==1 || form.type==2 || form.type==101 || form.type==3 || form.type==5 || form.type==6 || form.type == 7 || form.type == 8 || form.type == 13">
                            <el-card class="box-card mb" v-if="productList&&productList.length>0">
                                <div slot="header" class="clearfix"><span>活动产品列表</span></div>
                                <div class="drag-box">
                                    <div class="drag-box-item">
                                        <draggable v-model="productList" :options="dragOptions">
                                            <transition-group tag="div" style="clear: both">
                                                <div v-for="(item,index) in productList" class="drag-list" :key="item.goods_id">
                                                    <div class="mb" style="font-size: 12px;">{{item.name}}</div>
                                                    <h6 style="height: 18px">
                                                        <div class="red" v-if="item.country==1">中国区</div>
                                                        <div v-if="item.country==2">韩国区</div>
                                                        <div v-if="item.country==3">
                                                            <span class="red">中国区</span>&nbsp;
                                                            <span>韩国区</span>
                                                        </div>
                                                        <div v-else></div>
                                                    </h6>
                                                    <a href="javascript:void (0)" style="display:block;">
                                                        <img :src="cdn06 + item.logo_url" width="100%" height="100%">
                                                    </a>
                                                    <h6 class="red" style="text-align: center">
                                                        <el-button @click="handleDelete(item,index)" type="danger" size="mini" class="mb">删除</el-button>
                                                    </h6>
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </div>
                            </el-card>
                            <el-form-item label="活动产品" prop="goods_name">
                                <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                                    <template slot="append">
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="form.sku_name" :disabled="true"></el-input>                                
                            </el-form-item>
                            <el-form-item label="排序">
                                <el-input v-model="form.sort" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item label="限购数量">
                                <el-input v-model="form.buy_limit" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item v-if="form.type == 13" label="预付定金">
                                <el-input v-model="form.earnest_money" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item v-if="form.type == 13" label="系数">
                                <el-input v-model="form.coefficient" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item label="普通价格">
                                <el-input v-model="form.price" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item label="会员价格">
                                <el-input v-model="form.memberprice" placeholder="添加数字"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="handleAdd(productList)" type="success" size="medium" plain class="">添加</el-button>
                                <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存活动产品</span>
                            </el-form-item>
                        </div>
                        <!--<el-form-item>-->
                        <el-button type="primary" @click="onSubmit(form)" :loading="loading">确认创建新活动</el-button>
                        <!--</el-form-item>-->
                    </el-form>
                </div>
            </el-col>
        </div>
    </div>
</template>
<script>
import {
    autocomplete,
    skusearch,
    goodsadd,
    goodscreatepost,
    createAppId,
    goodsdel,
    actautocomplete,
    goodslist
} from '@/api/activity/activity'
import draggable from 'vuedraggable'
import { type } from 'os'
import { send } from 'q'
export default {
    name: 'goodsAdd',
    components: {
        draggable
    },
    data: function () {
        const validatelogoUrl = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请上传商品logo图片'))
            } else {
                callback()
            }
        }
        const validateName = (rule, value, callback) => {
            var pattern = new RegExp("[`~!@$^&*=|{}':;',\\[\\].<>?~！@￥……&*——|{}【】‘；：”“'。，、？%]");
            if (!value) {
                callback(new Error('请输入活动名称'))
            } else if (value.match(pattern)) {
                callback(new Error('活动名称含有非法字符'))
            } else if (value.length > 100) {
                callback(new Error('活动名称不能超过100个字'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            form: {
                // 商品添加字段
                act_id: '',
                goods_name: '',
                type: 0,
                buy_limit: '',//限购
                sort: '',//排序
                price: '',//普通价格
                memberprice: '',//会员价格
                sku_id: '' ,//sku_id
                sku_name:  '' ,//sku_name
                goods_id_list: [],//goods_id_list
                //活动添加字段
                title: '',//活动名称
                full: 0,//充分
                fulln: 0,//饱满
                cut: 0,//减
                avg_price: 0,//平均价格
                logo_url: '',//头图链接
                start_time: '',
                end_time: '',
                status: 0,//状态
                discount_status: 1,//折扣状态
                earnest_money:'', //定金
                coefficient:'', //系数
                earnest_money_params:{
                    start_time:'',// 收尾款开始时间
                    end_time:'',// 收尾款结束时间
                },
                discount_data:{
                    discount:[],//折扣专区
                    buydiscount:[],//买n减n
                },
            },
            start_time:'',// 收尾款开始时间
            end_time:'',// 收尾款结束时间
            restaurants: [],//输入建议列表
            productList: [],
            discount_num: '',
            discount_diss: '',
            goods_id:'',
            dragOptions: {
                animation: 150,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            rules: {
                activity_name: [
                    { required: true, validator: validateName, trigger: 'blur' }
                ],
                type: [
                    { required: true, }
                ],
                activity_country: [
                    { required: true, message: '选择登陆国家' }
                ],
                activity_img: [
                    { required: true, validator: validatelogoUrl, trigger: 'change' }
                ],
            },
        }
    },
    mounted() {
        this.getData()
        // this.getcountryData()
        // this.getBrandData()
    },
    methods: {
        //        提交数据
        onSubmit(formName) {
            // this.$refs.formName.validate((valid) => {
                // if (valid) {
                    this.form.earnest_money_params.start_time=this.form.earnest_money_params.start_time / 1000
                    this.form.earnest_money_params.end_time=this.form.earnest_money_params.end_time / 1000
                    // this.form.earnest_money_params.start_time.push(this.start_time) 
                    // this.form.earnest_money_params.end_time.push(this.end_time)
                    let sendObj={
                        act_id: formName.act_id,
                        title: formName.title,
                        type: formName.type,
                        full: formName.full,
                        fulln: formName.fulln,
                        cut: formName.cut,
                        avg_price: formName.avg_price,
                        logo_url: formName.logo_url,
                        start_time: formName.start_time,
                        end_time: formName.end_time,
                        status: formName.status,
                        goods_id_list: this.form.goods_id_list,
                        discount_data:this.form.discount_data,
                        discount_status: formName.discount_status,
                        earnest_money_params:this.form.earnest_money_params
                    }
                    this.loading = true
                    goodscreatepost(sendObj).then(res => {
                        if (res.errno == 0) {
                            this.$message.success('您成功创建活动')
                            this.$router.replace({
                                path: '/activitylist'
                            })
                            this.loading = false
                        } else {
                            this.$message(res.errmsg)
                            this.loading = false
                            this.form.earnest_money_params.start_time=this.form.earnest_money_params.start_time * 1000
                            this.form.earnest_money_params.end_time=this.form.earnest_money_params.end_time * 1000
                        }
                    }).catch(err => {
                        this.loading = false
                    })
        },
        getData(){
            createAppId().then(res=>{
                if (res.errno == 0) {
                    this.form.act_id = res.data.act_id
                } else {
                    this.$message.error(res.errmsg)
                }
            }).catch(err =>{

            })
        },
        //   获取全部商品数据
        getcountryData() {
            this.form.act_id = this.activityId
            this.loading_activity = true
            goodslist({act_id : this.activityId}).then(res => {
                if (res.errno == 0) {
                    this.loading_activity = false
                    this.productList = res.data.list
                    for(let i=0; i<res.data.list.length+1;i++){
                        this.form.goods_id_list.push(res.data.list[i].goods_id)
                    }
                } else {
                    this.$message.error(res.errmsg)
                    this.loading_activity = false
                }
            }).catch(err => {
                this.loading_activity = false
            })
        },
        //input 提示功能
        querySearch(queryString, cb) {
            actautocomplete(queryString).then(res => {
                if (res.errno == 0) {
                    for(var i=0;i<res.data.list.length;i++){
                        res.data.list[i].value = res.data.list[i].name;   
                    }                    
                    var restaurants = res.data.list
                    // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                    var results = queryString ? restaurants: restaurants;
                    cb(results);
                } else {
                    this.$message.error(res.errmsg)
                }
            })
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) { //选中品牌名称
            this.form.brand_name = item.value
            this.goods_id = item.goods_id
            let that = this
            skusearch({goods_name:item.value}).then(res=>{//获取选中场馆商品的信息
                if(res.errno == 0){
                    that.form.sku_id = res.data.skuInfo.sku_id
                    that.form.sku_name = res.data.skuInfo.sku_name
                }else {
                    that.$message.error(res.errmsg)
                }
            }).catch(err=>{
            })
        },
        //添加活动产品
        handleAdd(item) {
            this.form.goods_id_list.push(this.goods_id)
            let sendObj = {
                act_id: this.form.act_id,
                goods_name: this.form.goods_name,
                type: this.form.type,
                buy_limit:this.form.buy_limit, 
                sort: this.form.sort,
                price: this.form.price,
                memberprice:this.form.memberprice, 
                sku_id: this.form.sku_id, 
                sku_name:  this.form.sku_name,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                goods_id_list:this.form.goods_id_list,
                earnest_money:this.form.earnest_money,
                coefficient:this.form.coefficient
            }
            goodsadd(sendObj).then(res => {
                if (res.errno == 0) {
                    this.$message({
                        message: "添加成功!",
                        type: "success"
                    });
                    this.productList = res.data.list
                    this.form.goods_name = ''
                } else {
                    this.$message.error(res.errmsg)
                    this.form.goods_id_list.pop()
                }
            }).catch(err => {
                alert('请刷新页面')
                this.form.goods_id_list.pop()
            })
        },
        handleAvatarSuccess(res, file, index) { //图片上传成功回调
                this.form.logo_url = res.data.image_url
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/bmp');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //删除活动商品
        handleDelete(item, index) {
            let sendObj = {
                goods_id: item.goods_id,
                act_id: this.form.act_id,
                goods_id_list: this.form.goods_id_list,
                type: item.type
            }
            let that = this            
            goodsdel(sendObj).then(res=>{
                if(res.errno == 0){
                    this.$message({
                        message: "删除成功!",
                        type: "success"
                    });
                    that.getcountryData()
                    // that.productList = res.data.list
                }else{
                    that.$message.error(res.errmsg)
                }
            }).catch(err=>{
                    
            })
        },
        typeChange(type){

        },
        discountAdd() { // 折扣标签添加
            this.form.discount_data.discount.push({ num: this.discount_num, dis: this.discount_diss });
            setTimeout(res=>{
                this.discount_num='',
                this.discount_diss=''
            },500)

        },
        discountDelete(index) { // 折扣标签删除
            this.form.discount_data.discount.splice(index, 1);

        },
        buydiscountAdd() { // 折扣标签添加
            this.form.discount_data.buydiscount.push({ num: this.discount_num, dis: this.discount_diss });

        },
        buynfreemDelete(index) { // 折扣标签删除
            this.form.discount_data.buydiscount.splice(index, 1);

        }
    }
}
</script>
<style scoped>
.sku_item {
    margin-right: 10px;
}
.mb {
    margin-bottom: 10px;
}
.form-box {
    margin: 0 auto;
}
.logo {
    /*width: 15%;*/
}
.fr {
    float: right;
}
.fr button {
    display: block;
    width: 100%;
    margin: 5px 0 0;
}
.drag-list {
    float: left;
    padding: 10px;
    width: 140px;
    height: 260px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    margin: 10px;
}
.drag-list > div {
    height: 50px;
    overflow: hidden;
}

.red {
    color: #ff0000;
}
</style>
