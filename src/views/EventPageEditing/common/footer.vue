<template>
    <div>
        <!--menu start-->
        <!--    <el-menu-->
        <!--            style="position: absolute;z-index: 9999;"-->
        <!--            class="el-menu-demo"-->
        <!--            mode="horizontal"-->
        <!--            text-color="#000"-->
        <!--            active-text-color="#409EFF">-->
        <!--        <el-submenu index="1">-->
        <!--            <template slot="title">添加模块</template>-->
        <!--&lt;!&ndash;            <el-menu-item index="2-1" >导航模块</el-menu-item>&ndash;&gt;-->
        <!--            <el-menu-item index="2-2" @click="addTemplate">图片模块</el-menu-item>-->
        <!--&lt;!&ndash;            <el-menu-item index="2-3" >商品模块</el-menu-item>&ndash;&gt;-->
        <!--        </el-submenu>-->
        <!--        <el-menu-item index="1" @click="handleToDetail">活动列表页</el-menu-item>-->
        <!--    </el-menu>-->
        <!-- menu end -->
        <div class="heder">
            <el-form>
                <el-button icon="el-icon-edit" type="primary" @click="addTemplate">新建模块</el-button>
                <el-button icon="el-icon-check" type="success" @click.stop="saveData">保存数据</el-button>
            </el-form>
        </div>
        <div class="content">
            <div class="disBorder">
                <draggable v-model="template.m" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                    <!-- <transition-group> -->
                    <div class='moban_item' v-for="(data,index) in template.m" :key="index" @clik.prevent='removalEvent'>
                        <div class="HotZone" :ref="data.fe_module_id" :class="data.fe_module_id" draggable="true">
                            <div @click="hotItem(form_data,data,index)" @mousedown.stop="moveStop" v-for="form_data in data.areas" class="HotZone_box" :style="HotZone_style(form_data)">
                            </div>
                            <img @clik.prevent='removalEvent' class="HotZone_img" :src="data.background" />
                        </div>
                        <div>
                            <div ><el-button type="primary" @click='templateItem(data,index)'>修改模块</el-button></div>
                            <div><el-button type="success" icon="el-icon-rank" class="handle" circle></el-button></div>
                        </div>
                    </div>
                    <!-- </transition-group> -->
                </draggable>
            </div>
            <div class="right_form" v-show="ShowHidden">
                <el-form :rules="rules" ref="form" :model="form" size="mini" label-width="80px">
                    <el-form-item label="模块名称" prop="module_title">
                        <el-input v-model="form.module_title"></el-input>
                    </el-form-item>
                    <el-form-item label="选择热区模板图片" prop="background">
                        <el-upload class="upload-demo" action="api/upload/image" name="background" list-type="picture-card" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                            <img v-if="form.background" :src="form.background" width="180" height="150">
                            <i class="el-icon-plus" v-else></i>
                            <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="显示选择">
                        <el-checkbox v-model="form.show_all" @change="showAll(form)">全部</el-checkbox>
                        <el-checkbox v-model="form.show_with_vip">会员</el-checkbox>
                        <el-checkbox v-model="form.show_with_not_vip">非会员</el-checkbox>
                        <el-checkbox v-model="form.show_with_new_user">新用户</el-checkbox>
                        <el-checkbox v-model="form.show_with_old_user">老用户</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="moban('form')">{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
                        <el-button v-show="ShowHidden_del_but" type="danger" icon="el-icon-delete" round @click.stop="DeleteMokuai">删除当前模块</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--        新建热区-->
            <div class="right_form" v-show="ShowHidden1">
                <el-form :rules="rules_data" ref="form_data" :model="form_data" size="mini" label-width="80px">
                    <el-form-item label="热区事件">
                        <el-select label="事件类型" v-model="form_data.event_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in operatorList" :key="index"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接类型">
                        <el-select v-model="form_data.link_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in listType" :key="index"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品类型" v-show='form_data.link_type===1'>
                        <el-select v-model="form_data.goods_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in goodsType" :key="index"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动类型" v-show='form_data.link_type===1 && form_data.goods_type ==="act_goods"'>
                        <el-select v-model="form_data.act_type">
                            <el-option :value="item.value" :label="item.key" v-for="(item,index) in act_type" :key="index"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动 I D" v-show='form_data.link_type===1 && form_data.goods_type ==="act_goods"' prop="act_id">
                        <el-input v-model="form_data.act_id"></el-input>
                    </el-form-item>
                    <el-form-item label="GOODS_ID" v-show='form_data.link_type===1' prop="goods_id">
                        <el-input v-model="form_data.goods_id"></el-input>
                    </el-form-item>
                    <el-form-item label="H5链接" v-show='form_data.link_type===2' prop="url_h5">
                        <el-input v-model="form_data.url_h5"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序链接" v-show='form_data.link_type===2' prop="url_xcx">
                        <el-input v-model="form_data.url_xcx"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-edit" type="primary" @click="requBut(form_data)">{{this.type_am ===1?'修改':this.type_am ===0?'创建':''}}热区</el-button>
                        <el-button type="primary" size="mini" @click.stop="DeleteRequ">删除热区</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import {
        handleimgSearch,
        handleimgPost,
        eventPageConfigs,
    } from '@/api/EventPage/EventPageEditing'
    //将浏览器默认拖拽图片事件关掉
    export default {
        name: 'permissionList',
        data() {
            return {
                rules: {
                    module_title: [
                        { required: true, message: '请输入模块名称' },
                    ],
                    background: [
                        { required: true, message: '请选择模块背景图' }
                    ]
                },
                rules_data:{
                    act_id: [
                        { required: true, message: '请填写活动类型'},
                    ],
                    goods_id: [
                        { required: true, message: '请填活动id'},
                    ],
                    url_h5: [
                        { required: true, message: '请填写正确链接'}
                    ],
                    url_xcx: [
                        { required: true, message: '请填写正确链接'}
                    ],
                },
                activity_id:"",
                visible: false,
                templateIndex:0,
                requIndex:0,
                i: 1,
                index_i: 0,
                datas: {},//将当前模板数据暴露
                type_am: 0,
                ShowHidden: true,//显示/隐藏
                ShowHidden1: false,//显示/隐藏
                ShowHidden_del_but:false,
                operatorList: [],
                redactVSadd: 2,
                listType: [],
                goodsType: [],
                act_type: [],
                index: 0,
                form: {
                    module_type: '1',//模块类型: 1 热区; 2 商品;
                    module_title: '',//模块名称
                    background: '',//event_type
                    show_model: '',//显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
                    areas: [],
                    fe_module_id: 'fe_module_id' + Date.now(),
                    show_all: true,// 全部
                    show_with_vip: true,//会员
                    show_with_not_vip: true,//非会员
                    show_with_old_user: true,// 老会员
                    show_with_new_user: true,//新会员
                },
                form_data: {
                    select_box_height: '60',//[热区模块专属]热区选择区域高度
                    select_box_width: '90',//[热区模块专属]热区选择区域宽度
                    select_box_left: '400',//[热区模块专属]热区选择区域距离所在图片左间距
                    select_box_top: '300',//热区模块专属]热区选择区域距离所在图片上间距
                    event_type: 'link',//[热区模块专属]热区事件类型: 链接 link; 方法 function
                    link_type: 1,//热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
                    goods_type: 'act_goods',//[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
                    act_type: 'miaosha',//活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
                    act_id: '',//活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
                    goods_id: '',//商品SKU_ID goods_id
                    appends: '',//附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
                    url_h5: '',
                    url_xcx: '',
                },
                template: {
                    activity_id: '',//活动ID
                    m: [],
                },
                button_top: '创建热区'

            }
        },
        created() {
            this.configs()
            this.activity_id = this.$route.query.id
            if(this.activity_id){
                this.actSearch()
                this.ShowHidden = false
            }
            if(this.form.module_title == '') this.ShowHidden_del_but = false
            else this.ShowHidden_del_but = true
        },
        computed: {
        },
        components: {
            draggable
        },
        methods: {
            showAll(form){
                console.log(form)
                if (form.show_all === true){
                    form.show_with_vip = true
                    form.show_with_not_vip = true
                    form.show_with_new_user = true
                    form.show_with_old_user = true
                }
            },
            removalEvent(){
                return false
            },
            //模块修改
            templateItem(data,index) {
                this.templateIndex=index
                this.datas = data
                this.ShowHidden = true
                this.ShowHidden1 = false
                this.redactVSadd = 1
                this.form = Object.assign({}, data)
                if(data.module_title == '') this.ShowHidden_del_but = false
                else this.ShowHidden_del_but = true
            },
            tishiRequ() {
                this.visible = true
                console.log(this.visible)
            },
            configs() {
                eventPageConfigs().then(res => {
                    this.operatorList = res.data.event_type
                    this.listType = res.data.link_type
                    this.goodsType = res.data.goods_type
                    this.act_type = res.data.activity_type
                })
            },
            handleToDetail() {
                this.$router.push({
                    path: "/EventPageList"
                });
            },
            //根据活动id搜索
            actSearch() {
                handleimgSearch(this.activity_id).then(res => {
                    this.template.activity_id = res.data.activity_id
                    this.template.m = res.data.list
                    setTimeout(()=>{
                        this.template.m.forEach((item=>{
                            this.initData(item)
                        }))
                    })
                })
            },
            //      图片上传
            handleAvatarSuccess(res, file, index) { //图片上传成功回调
                this.form.background = res.data.image_host + res.data.image_url
            },
            // 上传图片验证
            beforeAvatarUpload(file) {
                const isJPG = (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/bmp');
                const isLt5M = file.size / 1024 / 1024 < 3;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传图片大小不能超过 300kb!');
                }
                return isJPG && isLt5M;
            },
            //mousedown.stop 事假终止
            moveStop() {
                return false
            },
            // 提交数据
            saveData(form) {
                console.log(this.template)
                handleimgPost(this.template).then(res => {
                    if (res.errno == 0) {
                        this.$router.push({
                            path: "/EventPageList",
                            query:{}
                        })
                    } else {
                        this.$message.error(res.errmsg);
                        this.loading = false;
                    }
                })
            },
            // 拖动排序 - start
            datadragEnd(evt) {
                evt.preventDefault();
                // console.log(this.m[evt.oldIndex].hotspots)
                setTimeout(() => {
                    this.template.m[evt.oldIndex].hotspots._stop()
                    this.template.m[evt.newIndex].hotspots._stop()
                    this.template.m[evt.newIndex].hotspots = null
                    this.template.m[evt.oldIndex].hotspots = null
                    setTimeout(() => {
                        this.initData(this.template.m[evt.oldIndex])
                        this.initData(this.template.m[evt.newIndex])
                    })
                })
            },
            // 拖动排序 - end
            sizeFun(data) {
                return `width: ${data.width} ; height: ${data.height} ;top: ${data.top};left: ${data.left} `
            },
            templateFun() {
            },
            moban(form, index) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // this.ShowHidden1 = true;//热区表单显示
                        this.ShowHidden = false //关闭模块表单
                        if(this.form.module_title == '') this.ShowHidden_del_but = false
                        else this.ShowHidden_del_but = true
                        if (this.redactVSadd === 1) {
                            this.datas.background = this.form.background
                            return
                        }
                        this.form.fe_module_id = 'fe_module_id' + Date.now()
                        this.template.m.push(JSON.parse(JSON.stringify(this.form)))//插入模块表单
                        let len = this.template.m.length - 1
                        setTimeout(() => {
                            this.initData(this.template.m[len])//运行热区函数 this.template.m[len] 新增模块数据 , 新增div的id(防止重复)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            requBut(form_data,index) {//立即创建热区表单
                console.log(form_data)
                this.$refs.form_data.validate((valid) => {
                    if (valid) {
                        if (!this.datas.hotspots.get()) return
                        if (this.type_am === 0) {
                            this.form_data.container_height = '10'
                            this.form_data.container_width = '10'
                            this.form_data.select_box_height = this.datas.hotspots.get().selectBoxHeight
                            this.form_data.select_box_width = this.datas.hotspots.get().selectBoxWidth
                            this.form_data.select_box_left = this.datas.hotspots.get().selectBoxLeft
                            this.form_data.select_box_top = this.datas.hotspots.get().selectBoxTop
                            let obj = JSON.parse(JSON.stringify(this.form_data))
                            this.datas.areas.push(obj)//把选中热区表单 插入当前模块
                            console.log(this.template.m)
                            this.$message({
                                message: '新建热区成功!',
                                type: 'success'
                            });
                        } else {
                            this.button_top = '修改热区'
                            // this.form_data = form_data
                            this.form_data.container_height = '10'
                            this.form_data.container_width = '10'
                            this.form_data.select_box_height = this.datas.hotspots.get().selectBoxHeight
                            this.form_data.select_box_width = this.datas.hotspots.get().selectBoxWidth
                            this.form_data.select_box_left = this.datas.hotspots.get().selectBoxLeft
                            this.form_data.select_box_top = this.datas.hotspots.get().selectBoxTop
                            this.type_am = 0
                            let obj = JSON.parse(JSON.stringify(form_data))
                            this.datas.areas.splice(this.datas.areas.indexOf(this.form_data), 1, obj)
                            this.$message({
                                message: '修改热区成功!',
                                type: 'success'
                            });
                        }
                        this.datas.hotspots._removeDiv()
                        this.ShowHidden1 = false
                        this.form_data = {
                            select_box_height: '60',//[热区模块专属]热区选择区域高度
                            select_box_width: '90',//[热区模块专属]热区选择区域宽度
                            select_box_left: '400',//[热区模块专属]热区选择区域距离所在图片左间距
                            select_box_top: '300',//热区模块专属]热区选择区域距离所在图片上间距
                            event_type: 'link',//[热区模块专属]热区事件类型: 链接 link; 方法 function
                            link_type: 1,//热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
                            goods_type: 'act_goods',//[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
                            act_type: 'miaosha',//活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
                            act_id: '',//活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
                            goods_id: '',//商品SKU_ID goods_id
                            appends: '',//附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
                            url_h5: '',
                            url_xcx: '',
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            HotZone_style(form_data) {//将画完的热区坐标辅助给div
                return `width: ${form_data.select_box_width}px ; height: ${form_data.select_box_height}px ;top: ${form_data.select_box_top}px;left: ${form_data.select_box_left}px;`
            },
            addTemplate() {//新建热区
                this.ShowHidden = true
                this.ShowHidden1 = false
                this.redactVSadd = 2
                this.form = {
                    module_type: '1',//模块类型: 1 热区; 2 商品;
                    module_title: '',//模块名称
                    background: '',//event_type
                    show_model: '',//显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
                    areas: [],
                    fe_module_id: 'fe_module_id' + Date.now(),
                    show_all: true,// 全部
                    show_with_vip: true,//会员
                    show_with_not_vip: true,//非会员
                    show_with_old_user: true,// 老会员
                    show_with_new_user: true,//新会员
                }
                this.form_data = {
                    select_box_height: '60',//[热区模块专属]热区选择区域高度
                    select_box_width: '90',//[热区模块专属]热区选择区域宽度
                    select_box_left: '400',//[热区模块专属]热区选择区域距离所在图片左间距
                    select_box_top: '300',//热区模块专属]热区选择区域距离所在图片上间距
                    event_type: 'link',//[热区模块专属]热区事件类型: 链接 link; 方法 function
                    link_type: 1,//热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
                    goods_type: 'act_goods',//[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
                    act_type: 'miaosha',//活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
                    act_id: '',//活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
                    goods_id: '',//商品SKU_ID goods_id
                    appends: '',//附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
                    url_h5: '',
                    url_xcx: '',
                }
                if(this.form.module_title == '') this.ShowHidden_del_but = false
                else this.ShowHidden_del_but = true
            },
            // HotZone_box
            //hotItem 选中热区执行函数
            hotItem(form_data, data, index) { //form_data 当前模块的热区  data 当前模块的数据 index当前模块顺序
                this.form_data = JSON.parse(JSON.stringify(form_data))
                this.form_data = form_data
                this.datas = data
                this.type_am = 1
                this.index = index
                this.ShowHidden = false
                this.ShowHidden1 = true;//热区表单
                console.log(form_data)
                setTimeout(() => {
                    data.hotspots.set({
                        // 相对容器宽度
                        containerHeight: document.getElementsByClassName(data.fe_module_id)[0].offsetHeight,//获取模块的高度
                        // 相对容器高度
                        containerWidth: 560,
                        // 相对选区宽度
                        selectBoxHeight: form_data.select_box_height,
                        // 相对选区宽度
                        selectBoxLeft: form_data.select_box_left,
                        // 相对选区offsetLeft
                        selectBoxTop: form_data.select_box_top,
                        // 相对选区offsetTop
                        selectBoxWidth: form_data.select_box_width
                    })
                })
            },

            //删除模块
            DeleteMokuai() {
                console.log(this.templateIndex)
                this.$confirm('确认删除此模块?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.datas.hotspots._stop()
                    this.template.m.splice(this.templateIndex, 1)
                }).catch(() => {
                });
            },
            //删除热区
            DeleteRequ() {//删除当前选中热区
                this.$confirm('确认删除此热区?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.datas.areas.splice(this.datas.areas.indexOf(this.form_data), 1)
                    this.datas.hotspots._removeDiv();
                    this.form_data = {
                        select_box_height: '60',//[热区模块专属]热区选择区域高度
                        select_box_width: '90',//[热区模块专属]热区选择区域宽度
                        select_box_left: '400',//[热区模块专属]热区选择区域距离所在图片左间距
                        select_box_top: '300',//热区模块专属]热区选择区域距离所在图片上间距
                        event_type: 'link',//[热区模块专属]热区事件类型: 链接 link; 方法 function
                        link_type: 1,//热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
                        goods_type: 'act_goods',//[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
                        act_type: 'miaosha',//活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
                        act_id: '',//活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
                        goods_id: '',//商品SKU_ID goods_id
                        appends: '',//附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
                        url_h5: '',
                        url_xcx: '',
                    }
                }).catch(() => {
                });
            },
            // 建立热区
            initData(datas) {
                let that = this //this 重定义
                function createRect(parent) { //创建div
                    const rect = document.createElement('div')
                    rect.style.cssText = 'position: absolute; box-sizing: border-box; border: 2px solid red; left: auto; top: auto; right: auto; bottom: auto;background-color: rgba(0, 0, 0, .3);'
                    const mouseDownAndMove = new MouseDownAndMove(rect)
                    mouseDownAndMove.before('down', e => e.target === rect)
                    mouseDownAndMove.on('move', (e, start) => {
                        rect.style.transform = `translate3d(${e.x - start.x}px, ${e.y - start.y}px, 0)`
                    })
                    mouseDownAndMove.on('up', (e, start) => {
                        rect.style.transform = 'none'
                        rect.style.top = rect.offsetTop + e.y - start.y + 'px'
                        rect.style.left = rect.offsetLeft + e.x - start.x + 'px'
                        rect.style.bottom = 'auto'
                        rect.style.right = 'auto'
                    })
                    parent.appendChild(rect)
                    return rect
                }

                function createRound(parent, top, left) {
                    const size = '8px'
                    const round = document.createElement('div')
                    round.style.cssText = `position: absolute; width: ${size}; height: ${size}; border: 1px solid red; border-radius: ${size};background-color: white;`
                    round.style.top = typeof top === 'string' ? top : (top + 'px')
                    round.style.left = typeof left === 'string' ? left : (left + 'px')
                    parent.appendChild(round)
                    return round
                }

                class MouseDownAndMove {
                    constructor(node) {
                        this._onHooks = {}
                        this._beforeHooks = {}
                        this.ele = node
                        this.mousedown = e => {
                            if (e.button === 0 && this._runHook('before', 'down', e)) {
                                this._isDown = true
                                this._start = { x: e.x, y: e.y, offsetX: e.offsetX, offsetY: e.offsetY }
                                this._runHook('on', 'down', e)
                            }
                        }
                        this.mouseup = e => {
                            if (e.button === 0 && this._isDown) {
                                this._isDown = false
                                this._runHook('on', 'up', e)
                            }
                        }
                        this.mousemove = e => {

                            if (this._isDown) {
                                e.preventDefault()
                                this._runHook('on', 'move', e)
                            }
                        }
                        node.addEventListener('mousedown', this.mousedown)
                        node.addEventListener('mouseup', this.mouseup)
                        node.addEventListener('mousemove', this.mousemove)
                    }

                    _stop() {
                        this.ele.removeEventListener('mousedown', this.mousedown, false)
                        this.ele.removeEventListener('mouseup', this.mouseup, false)
                        this.ele.removeEventListener('mousemove', this.mousemove, false)
                    }

                    _runHook(type, name, e) {
                        const hook = type === 'on' ? this._onHooks[name] : this._beforeHooks[name]
                        if (typeof hook === 'function') return hook(e, this._start)
                        return true
                    }

                    on(name, handler) {
                        this._onHooks[name] = handler
                    }

                    before(name, handler) {
                        this._beforeHooks[name] = handler
                    }
                }

                function createRounds(parent) {
                    const size = 5
                    const positions = [
                        {
                            top: -size,
                            left: [-size, `-webkit-calc(50% - ${size}px)`, `-webkit-calc(100% - ${size}px)`]
                        },
                        {
                            top: `-webkit-calc(50% - ${size}px)`,
                            left: [-size, `-webkit-calc(100% - ${size}px)`]
                        },
                        {
                            top: `-webkit-calc(100% - ${size}px)`,
                            left: [-size, `-webkit-calc(50% - ${size}px)`, `-webkit-calc(100% - ${size}px)`]
                        }
                    ]
                    let code = 0
                    const cursors = ['nwse', 'ns', 'nesw', 'ew', 'ew', 'nesw', 'ns', 'nwse']
                    for (let { top, left } of positions) {
                        for (let _left of left) {
                            const round = createRound(parent, top, _left)
                            round._roundCode = code++
                            round.style.cursor = cursors[round._roundCode] + '-resize'
                        }
                    }
                }

                class Hotspots {
                    constructor(container) { //根据拖拽 画选区
                        this._container = container
                        this._containerRect = this._container.getBoundingClientRect()
                        this.mouseDownAndMove = new MouseDownAndMove(this._container)

                        this.mouseDownAndMove.before('down', e => e.target.hasOwnProperty('_roundCode') || e.target !== this._rect)
                        this.mouseDownAndMove.on('down', (e, start) => {
                            this._target = e.target
                            if (e.target.hasOwnProperty('_roundCode')) {
                                const roundCode = e.target._roundCode
                                this._rect.style.cursor = e.target.style.cursor
                                const rect = this._getRect()
                                const isTop = roundCode > 2
                                const isLeft = [2, 4, 7].indexOf(roundCode) !== -1
                                this._start = { offsetX: isLeft ? rect.left + 2 : rect.right, offsetY: isTop ? rect.top + 2 : rect.bottom }
                                const x = e.x - e.offsetX + 8
                                const y = e.y - e.offsetY - 2
                                this._start.x = isLeft ? x - rect.width : x + rect.width
                                this._start.y = isTop ? y - rect.height : y + rect.height
                            } else if (e.target !== this._rect) {
                                this._start = start
                                if (this._rect) {
                                    this._container.removeChild(this._rect)
                                    this._rect = null
                                }
                            }
                        })
                        this.mouseDownAndMove.on('up', () => {//热区  鼠标抬起
                            if (!this._rect) {
                                return
                            }
                            if (!this._target.hasOwnProperty('_roundCode')) { //选区事件处发
                                that.type_am = 0
                                that.ShowHidden = false
                                that.ShowHidden1 = true
                                that.datas = datas  // 当前表单 将当前表单赋值给datas
                                createRounds(this._rect)
                            } else {
                                this._rect.style.cursor = 'move'
                            }

                        })
                        this.mouseDownAndMove.on('move', e => {
                            if (!this._rect) this._rect = createRect(this._container)
                            const w = e.x - this._start.x
                            const h = e.y - this._start.y
                            this._setPosition('left', w)
                            this._setPosition('top', h)
                            const roundCode = this._target._roundCode
                            if ([1, 6].indexOf(roundCode) === -1) this._rect.style.width = Math.abs(w) + 'px'
                            if ([3, 4].indexOf(roundCode) === -1) this._rect.style.height = Math.abs(h) + 'px'
                        })
                    }

                    _stop() {
                        const container = this._container
                        this._removeDiv()
                        this.mouseDownAndMove._stop()

                    }
                    _removeDiv() {
                        if (this._rect) {
                            this._container.removeChild(this._rect)
                            this._rect = null
                        }
                    }

                    _setPosition(type, size) {
                        const attr = { left: ['right', 'width', 'offsetX'], top: ['bottom', 'height', 'offsetY'] }[type]
                        const rect = this._rect
                        if (size < 0 && rect.style[attr[0]] === 'auto') {
                            rect.style[attr[0]] = this._containerRect[attr[1]] - this._start[attr[2]] + 'px'
                            rect.style[type] = 'auto'
                        } else if (size > 0 && rect.style[type] === 'auto') {
                            rect.style[attr[0]] = 'auto'
                            rect.style[type] = this._start[attr[2]] + 'px'
                        }
                    }

                    _getRect() {
                        const rect = this._rect.getBoundingClientRect()
                        return {
                            left: this._rect.offsetLeft,
                            right: this._rect.offsetLeft + rect.width,
                            top: this._rect.offsetTop,
                            bottom: this._rect.offsetTop + rect.height,
                            width: rect.width,
                            height: rect.height
                        }
                    }

                    set(spots) {
                        const container = this._container
                        console.log(that.form_data)
                        if (this._rect) container.removeChild(this._rect)
                        if (!spots) return (this._rect = null)
                        this._rect = createRect(container)
                        const { width, height } = this._containerRect
                        const { selectBoxLeft, selectBoxTop, selectBoxWidth, selectBoxHeight, containerWidth, containerHeight } = spots
                        console.log('热区坐标',spots)
                        const xRate = width / containerWidth
                        const yRate = height / containerHeight
                        this._rect.style.left = selectBoxLeft * xRate + 'px'
                        this._rect.style.top = selectBoxTop * yRate + 'px'
                        this._rect.style.width = selectBoxWidth * xRate + 'px'
                        this._rect.style.height = selectBoxHeight * yRate + 'px'
                        createRounds(this._rect)
                    }

                    get() {//处发get 将选区坐标赋值
                        if (!this._rect) return
                        const { width: containerWidth, height: containerHeight } = this._containerRect
                        let { left, top, width, height } = this._getRect()
                        return {
                            containerWidth,
                            containerHeight,
                            selectBoxLeft: left,
                            selectBoxTop: top,
                            selectBoxWidth: width,
                            selectBoxHeight: height//将selectBoxheight
                        }
                    }
                }

                // 鼠标事件创建div结束再显示选取容器
                // datas为当前表单 datas.hotspots就是在当前表单建立热区
                datas.hotspots = new Hotspots(
                    // 必须。选区容器 ids 热区需求参数 == 坐标
                    that.$refs[datas.fe_module_id][0]
                    //document.getElementsByClassName(datas.fe_module_id)[0]
                )
                // 设置一个选区
                // 如果传空 则清空当前选区
                // 选区set方法会自动将选区设置为相对于当前容器大小的

                // document.getElementById('btn').addEventListener('click', () => {
                //     // 获取当前选取的左上角，右下角【相对坐标】
                //     const area = datas.hotspots.get()
                //     // 返回 当前容器宽度，当前容器高度，当前选区宽度，当前选区高度，当前选区offsetLeft，当前选区offsetTop
                //     // {containerWidth, containerHeight, selectBoxWidth, selectBoxHeight, selectBoxLeft, selectBoxTop}
                // })
            },
        },
        mounted() {
            // this.initData(this.template.m[0])
            //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

    }

</script>

<style scoped>
    .heder {
        position: absolute;
        z-index: 999;
        background-color: rgba(0 0 0, 0.5);
    }
    .content {
        display: flex;
        padding-top: 70px;
    }
    .HotZone_img {
        width: 562.5px;
        vertical-align: top;
    }
    .right_form {
        left: 60%;
        position: absolute;
        background-color: #f0f2f5;
    }
    .HotZone {
        position: relative;
        /*display: inline-block;*/
        overflow: hidden;
    }
    .HotZone_box {
        position: absolute;
        background-color: rgba(255, 100, 97, 0.5);
    }
    .moban_item {
        display: flex;
        align-items: center;
    }
</style>
