<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="icon iconfont el-iconshangpin"></i> 修改活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="20" :offset="2">
                <div class="form-box">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="活动ID">
                            <el-input v-model="form.act_id" disabled />
                        </el-form-item>
                        <el-form-item label="活动名称" prop="title">
                            <el-input v-model="form.title" placeholder="请输入活动名称" />
                        </el-form-item>
                        <el-form-item label="活动类型" prop="type">
                            <el-radio-group v-model="form.type">
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
                            件
                            <el-tag v-for="(tag,index) in form.discount_data.discount" :key="index" closable @close="discountDelete(index)">
                                {{tag.num}}件{{tag.dis}}折
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" :span="20" />
                            <el-input v-model="discount_diss" placeholder="0" :span="20" />
                            折
                            <el-button @click="discountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
                        <!-- 买N免N -->
                        <el-form-item label="买N免N" prop="buydiscount" v-if="form.type == 7">
                            买
                            <el-tag v-for="(tag,index) in form.discount_data.buydiscount" :key="index" closable @close="buynfreemDelete(index)">
                                买{{tag.num}}免{{tag.dis}}
                            </el-tag>
                            <el-input v-model="discount_num" placeholder="0" />
                            免
                            <el-input v-model="discount_diss" placeholder="0" />
                            <el-button @click="buydiscountAdd()" type="success" size="medium" plain class="">添加</el-button>
                        </el-form-item>
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
                                        <!-- <draggable v-model="productList" :options=""> -->
                                            <!-- <transition-group tag="div" style="clear: both"> -->
                                                <!-- <div v-for="(item,index) in productList" class="drag-list" :key="item.goods_id" @click="Selecteds(productList,item,index)"> -->
                                                <div v-for="(item,index) in productList" class="drag-list" :key="item.goods_id">
                                                    <div style="height: 54px;overflow: hidden">{{item.name}}</div>
                                                    <div style="text-align: center"><img
                                                            :src="cdn06+item.logo_url" width="180"></div>
                                                    <div>
                                                        原价: <span class="red"> {{item.price}}</span>
                                                    </div>
                                                    <div>活动产品:
                                                        <el-input v-model="item.name" :disabled="true"></el-input>                                
                                                    </div>
                                                    <div class="mb">排序:
                                                        <el-input v-model="item.sort" placeholder="添加数字"></el-input>
                                                    </div>
                                                    <div class="mb">限购数量:
                                                        <el-input v-model="item.buy_limit" placeholder="添加数字"/>
                                                    </div>
                                                    <div v-if="form.type == 13" class="mb">预付定金:
                                                        <el-input v-model="item.earnest_money" placeholder="添加数字"/>
                                                    </div>
                                                    <div v-if="form.type == 13" class="mb">系数:
                                                        <el-input v-model="item.coefficient" placeholder="添加数字"/>
                                                    </div>
                                                    <div class="mb">普通价格:
                                                        <el-input v-model="item.price" placeholder="添加数字"/>
                                                    </div>
                                                    <div class="mb">会员价格:
                                                        <el-input v-model="item.origin_price" placeholder="添加数字"/>
                                                    </div>
                                                    <!-- <div class="mb">推荐:
                                                        <el-radio-group v-model="item.is_recommend">
                                                            <el-radio label="1">推荐</el-radio>
                                                            <el-radio label="0">不推荐</el-radio>
                                                        </el-radio-group>
                                                    </div> -->
                                                    <!-- <div class="mb">
                                                        销量：{{item.sale_count}} &nbsp;
                                                        销售额：{{item.sale_count * item.seckill_price}}
                                                    </div> -->
                                                    <div>
                                                        <el-button type="primary" size="mini" @click="handleEditGoods(item)" :loading="loading">修改 </el-button>
                                                        <el-button type="danger" size="mini"  @click="handleDelete(item,index)">删除 </el-button>
                                                    </div>
                                                    </div>
                                            <!-- </transition-group> -->
                                        <!-- </draggable> -->
                                    </div>
                                </div>
                            </el-card>
                            <el-form-item v-if="addvsupdata" label="活动产品" prop="goods_name">
                                <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                                    <template slot="append">
                                    </template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item v-else label="活动产品">
                                <el-input v-model="form.goods_name" :disabled="true"></el-input>                                
                            </el-form-item>
                            <el-form-item v-if="addvsupdata">
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
                                <el-button @click="handleAdd(productList),addvsupdata = true" type="success" size="medium" plain class="">添加</el-button>
                                <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存活动产品</span>
                            </el-form-item>
                        </div>
                        <!--<el-form-item>-->
                        <el-button type="primary" @click="onSubmit(form)" :loading="loading">确认修改</el-button>
                        <!--</el-form-item>-->
                    </el-form>
                </div>
            </el-col>
        </div>
        <el-dialog
        title="修改信息"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <el-form>
            <el-form-item v-if="addvsupdata" label="活动产品" prop="goods_name">
                <el-autocomplete style="width: 100%;margin-bottom: 10px" v-model="form.goods_name" :fetch-suggestions="querySearch" placeholder="请输入商品名称" :trigger-on-focus="false" @select="handleSelect">
                    <template slot="append">
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item v-else label="活动产品">
                <el-input v-model="form.goods_name" :disabled="true"></el-input>                                
            </el-form-item>
            <el-form-item v-if="addvsupdata">
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
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button @click="handleAdd(productList),dialogVisible = false" type="success" size="medium" plain class="">{{addvsupdata?'添加':'修改'}}</el-button>
                <span style="color:red ">&nbsp; &nbsp;选择以上条目后,然后点击添加按钮保存活动产品</span>
            </el-form-item>
        </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {
        goodslist,
        actdetail,
        autocomplete,
        skusearch,
        goodsupdatepost,
        goodsdel,
        goodsadd,
        goodsupdate,
        actautocomplete,
    } from '@/api/activity/activity'
    import draggable from 'vuedraggable'
    import {mapGetters} from 'vuex'
import { type } from 'os'

    export default {
        name: 'goodsAdd',
        components: {
            draggable
        },
        computed: {
            ...mapGetters(['activityId'])
        },
        data: function () {
            const validatelogoUrl = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请上传商品logo图片'))
                }
                callback()
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
                dialogVisible: false,
                loading: false,
                addvsupdata:true,//添加/修改
                form: {
                    // 商品添加字段
                    act_id: '',
                    goods_name: '',
                    type: 1,
                    buy_limit: '',//限购
                    sort: '',//排序
                    price: '',//普通价格
                    memberprice: '',//会员价格
                    sku_id: '' ,//sku_id
                    sku_name:  '' ,//sku_name
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
                    goods_id_list:[],
                    earnest_money:'', //定金
                    coefficient:'', //系数
                    earnest_money_params:{
                        start_time:'',// 收尾款开始时间
                        end_time:'',// 收尾款结束时间
                    },
                    discount_data: {
                        discount:[],//折扣专区
                        buydiscount:[],//买n减n
                    },
                    discount_status: 1,//折扣状态
                },
                start_time:'',// 收尾款开始时间
                end_time:'',// 收尾款结束时间
                restaurants: [],//输入建议列表
                productList: [],
                discount_num: '',
                discount_diss: '',
                goods_id:'',
            }
        },
        mounted() {
            this.getcountryData(),
            this.getBrandData()
        },
        methods: {

//          提交数据
            onSubmit(formName) {
                this.form.earnest_money_params.start_time=this.form.earnest_money_params.start_time / 1000
                this.form.earnest_money_params.end_time=this.form.earnest_money_params.end_time / 1000
                let that = this, goodsIdList = "####"
                this.loading = true
                let sendObj = {
                            act_id: this.form.act_id,
                            title: this.form.title,
                            logo_url: this.form.logo_url,
                            type: this.form.type,
                            avg_price: this.form.avg_price,
                            full: this.form.full,
                            fulln: this.form.fulln,
                            cut: this.form.cut,
                            start_time: this.form.start_time,
                            end_time: this.form.end_time,
                            status: this.form.status,
                            goods_id_list: this.form.goods_id_list,
                            discount_data: this.form.discount_data,
                            discount_status: this.form.discount_status,
                            earnest_money_params:this.form.earnest_money_params
                }
                goodsupdatepost(sendObj).then(res => {
                            if (res.errno == 0) {
                                this.$message.success('您成功修改活动')
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
            // 提交数据
            handleEditGoods(item){
                let sendObj={
                    goods_id: item.goods_id,
                    buy_limit: item.buy_limit,
                    price: item.price,
                    memberprice: item.origin_price, 
                    sort: item.sort,
                    act_id: this.form.act_id,
                    goods_id_list: this.form.goods_id_list,
                    type: item.type,
                    earnest_money:item.earnest_money,
                    coefficient:item.coefficient
                }
                goodsupdate(sendObj).then(res=>{
                    if (res.errno == 0) {
                        this.$message({
                            message: "修改成功!",
                            type: "success"
                        });
                        this.productList = res.data.list
                        this.addvsupdata = true
                        this.form.goods_name = ''
                        this.form.sort = ''
                        this.form.buy_limit = ''
                        this.form.price = ''
                        this.form.memberprice = ''
                        this.form.earnest_money = ''
                        this.form.coefficient = ''
                    } else {
                        this.$message.error(res.errmsg)
                    }
                }).catch(err => {
                })
            },
//          获取 数据goodslist
            getcountryData() {
                this.form.act_id = this.activityId
                this.loading_activity = true
                goodslist({act_id : this.activityId}).then(res => {
                    console.log(res.data.list)
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
            //获取活动详情
            getBrandData() {
                actdetail(this.activityId).then(res=>{
                    this.form.discount_data.discount = res.data.act_info.extent_info.discount || []
                    this.form.discount_data.buydiscount = res.data.act_info.extent_info.buydiscount || []
                    this.form.avg_price = res.data.act_info.avg_price
                    this.form.cut = res.data.act_info.cut
                    this.form.full = res.data.act_info.full
                    this.form.fulln = res.data.act_info.fulln
                    this.form.logo_url = res.data.act_info.logo_url
                    this.form.status = res.data.act_info.status
                    this.form.title = res.data.act_info.title
                    this.form.type = res.data.act_info.type
                    this.form.start_time = this.TimeDown(res.data.act_info.start_time)
                    this.form.end_time = this.TimeDown(res.data.act_info.end_time)
                    this.form.earnest_money_params.start_time=res.data.act_info.extent_info.start_time * 1000
                    this.form.earnest_money_params.end_time=res.data.act_info.extent_info.end_time * 1000
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
            //添加活动产品
            handleAdd(item) {
                this.form.goods_id_list.push(this.goods_id)
                if(this.addvsupdata == true){
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
                }else{//修改
                    this.form.goods_id_list.pop()
                    let sendObj={
                        goods_id: this.goods_id,
                        buy_limit: this.form.buy_limit,
                        price: this.form.price,
                        memberprice: this.form.memberprice, 
                        sort: this.form.sort,
                        act_id: this.form.act_id,
                        goods_id_list: this.form.goods_id_list,
                        type: this.form.type,
                        earnest_money:this.form.earnest_money,
                        coefficient:this.form.coefficient
                    }
                    goodsupdate(sendObj).then(res=>{
                        if (res.errno == 0) {
                            this.$message({
                                message: "修改成功!",
                                type: "success"
                            });
                            this.productList = res.data.list
                            this.addvsupdata = true

                            this.form.goods_name = ''
                            this.form.sort = ''
                            this.form.buy_limit = ''
                            this.form.price = ''
                            this.form.memberprice = ''
                            this.form.earnest_money = ''
                            this.form.coefficient = ''

                        } else {
                            this.$message.error(res.errmsg)
                        }
                    }).catch(err => {

                    })
                }
                
            },
            //input 触发事件
            querySearch(queryString, cb) {
                actautocomplete(queryString).then(res => {
                    if (res.errno == 0) {
                        for(var i=0;i<res.data.list.length;i++){
                            res.data.list[i].value = res.data.list[i].name;   
                        }
                        var restaurants = res.data.list
                        // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                        var results = queryString ? restaurants : restaurants;
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
            handleSelect(item) { //选中品牌
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
                        this.addvsupdata = true
                        this.form.goods_name = ''
                        this.form.sort = ''
                        this.form.buy_limit = ''
                        this.form.price = ''
                        this.form.memberprice = ''
                        this.form.earnest_money = ''
                        this.form.coefficient = ''
                    }else{
                        that.$message.error(res.errmsg)
                    }
                }).catch(err=>{

                })
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
            },
            //时间处理
            TimeDown(endDateStr) {
                // 2019-11-11 23:59:00
                let date = new Date(endDateStr * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                this.form.end_time = Y+M+D+h+m+s;
                return Y+M+D+h+m+s;
            },
        }
    }
</script>
<style scoped>

    /* 线上引入 */
    .mb {
        margin-bottom: 10px;
    }

    .form-box {
        margin: 0 auto;
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
        width: 205px;
        border: 1px solid #dcdfe6;
        border-radius: 10px;
        margin: 10px;
    }

    .el-table th, .el-table tr.el-table__row {
        float: left !important;
    }

    .el-table tr {
        float: left !important;
    }

    .red {
        color: #ff0000;
    }
</style>
