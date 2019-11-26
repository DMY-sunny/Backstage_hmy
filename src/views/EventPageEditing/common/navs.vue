<template>
<div class="navs" v-show="isShow">
    <!-- 导航模块 -->
    <div v-if="showNavi" class="navigation">
        <div v-for="(datam,index) in form_navs.navs" :key="index" class="navigation_box" @mouseover="navsHover(index)" :style="colorControl(datam)">
            <a>{{datam.title}}</a>
        </div>  
    </div>

    <!-- 导航模块 -->
    <div class="right_form" v-show="showNavigation">
                 <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="导航模块" name="navigation"> </el-tab-pane>
                    <el-tab-pane label="外观" name="naviExterior"> </el-tab-pane>
                    <el-tab-pane label="显示" name="naviDisplay"> </el-tab-pane>
                </el-tabs>
                <el-form v-show="navigation" ref="form_navs" :model="form_navs" size="mini" label-width="150px">
                    <ul>
                        <li v-for="(tab,index) in form_navs.navs" :key="index" style="display:flex;height:35px">
                            <el-input v-model="tab.title"></el-input>
                            <span style="white-space:nowrap">&nbsp; 跳转至 &nbsp;</span>
                            <el-select v-model="tab.jmp">
                                <el-option
                                v-for="item in template.m"
                                :key="item.fe_module_id"
                                :label="item.module_title"
                                :value="item.fe_module_id">
                                </el-option>
                            </el-select>
                            <el-button type="danger" @click="deleteNavs(index)">删除</el-button>
                            <el-button type="success" @click="addToNavs(tab,index)">添加</el-button>
                        </li>
                    </ul>
                </el-form>
                <el-form v-show="naviExterior" ref="form_navs" :model="form_navs" size="mini" label-width="100px">
                    <el-form-item label="背景颜色" prop="background_color">
                        <el-color-picker v-model="form_navs.background_color"></el-color-picker>
                        <el-input v-model="form_navs.background_color"></el-input>                    
                    </el-form-item>
                    <el-form-item label="字体默认颜色" prop="font_def_color">
                        <el-color-picker v-model="form_navs.font_def_color"></el-color-picker>
                        <el-input v-model="form_navs.font_def_color"></el-input>
                    </el-form-item>
                    <el-form-item label="字体选中颜色" prop="font_sel_color">
                        <el-color-picker v-model="form_navs.font_sel_color"></el-color-picker>
                        <el-input v-model="form_navs.font_sel_color"></el-input>
                    </el-form-item>
                    <el-form-item label="选中背景颜色" prop="background_sel_color">
                        <el-color-picker v-model="form_navs.background_sel_color"></el-color-picker>
                        <el-input v-model="form_navs.background_sel_color"></el-input>
                    </el-form-item>
                </el-form>
                <el-form v-show="naviDisplay" ref="form_navs" :model="form_navs" size="mini" label-width="100px">
                    <el-form-item label="显示选择">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange_Navs">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                <el-checkbox  v-for="city in cities" :label="city.value"  :key="city.name">{{city.name}}</el-checkbox>
                           
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <el-button v-if="this.showNavi === false" type="primary" @click="showNavi = true">创建模板</el-button>                    
                <el-button v-else type="danger" @click="showNavi = false">删除按钮</el-button>                    
    </div>
</div>
</template>
<script>
const cityOptions = [
    {name: '会员', value: "show_with_vip"},
    {name: '非会员', value: "show_with_not_vip"},
    {name: '新用户', value: "show_with_new_user"},
    {name: '老用户', value: "show_with_old_user"},
];
import draggable from 'vuedraggable'
import {
    handleimgSearch,
    handleimgPost,
    eventPageConfigs,
} from '@/api/EventPage/EventPageEditing'
//将浏览器默认拖拽图片事件关掉
export default {
    name: 'navs',
    props: ['isShowNavs', 'isShowNavigation'],
    components: {
        draggable,
    },
    data() {
        return {
            isShow: false,
            showNavigation: false,
            //标签选择样式
            activeName: 'navigation',
            navigation:true,
            naviExterior:false,
            naviDisplay:false,
            //权限显示选择
            checkAll: false,
            checkedCities: [],
            cities: cityOptions,
            isIndeterminate: true,
 
            showNavigation:false,//导航form模板的显示隐藏
            showNavi:false,//导航模块-显示/隐藏

            //导航模块数据
            form_navs: {
                module_type: '3',//模块类型: 1 热区; 2 商品;
                module_title: 'module_title',//模块名称
                background: '',//event_type
                background_color: '',//背景颜色
                font_def_color: '',//默认字体颜色
                font_sel_color: '',//选中字体颜色
                background_sel_color: '',//选中背景颜色
                show_model: [ "show_with_vip","show_with_not_vip","show_with_old_user","show_with_new_user"],//显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
                fe_module_id: 'fe_module_id' + Date.now(),
                navs:[
                            {
                                "title": "导航1",//导航名称
                                "jmp": "fe_module_id1566460395590" //导航跳转标识
                            },
                            {
                                "title": "导航2",//导航名称
                                "jmp": "fe_module_id1566460395590" //导航跳转标识
                            },
                            {
                                "title": "导航3",//导航名称
                                "jmp": "fe_module_id1566460395590" //导航跳转标识
                            }
                        ], 
            },
            form_navsChild:{
                    "title": "",//导航名称
                    "jmp": "模块" //导航跳转标识
            },
            template: {
                activity_id:'',//活动ID,如果没有该参数则为创建,如果存在则为更新操作
                title:'',//活动名称--页面标题
                background_color:'',//背景颜色
                background:'',//背景图片
                remark:'',//备注
                share_pic:'',//分享缩略图
                share_desc:'',//分享文案
                m: [
                    {
                        module_type: '1',//模块类型: 1 热区; 2 商品;
                        module_title: '导航模块',//模块名称
                        background: '',//event_type
                        background_color: '',//背景颜色
                        font_def_color: '',//默认字体颜色
                        font_sel_color: '',//选中字体颜色
                        show_model: [],//显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
                        fe_module_id: 'daohang' + Date.now(),
                        navs:[], 
                    },
                ],
            },
        }
    },
    watch:{
        isShowNavs(val){
          this.isShow = val;
        },
        "activeName": function(value){
            switch(value){
                case "navigation":
                    this.navigation = true
                    this.naviExterior = false
                    this.naviDisplay = false
                    break;
                case "naviExterior":
                    this.navigation = false
                    this.naviExterior = true
                    this.naviDisplay = false
                    break;
                case "naviDisplay":
                    this.navigation = false
                    this.naviExterior = false
                    this.naviDisplay = true
                    break;
            }
        },
        isShowNavigation(val){
            this.showNavigation = val;
        },
    },
    computed: {
    },
    
    methods: {
        //新建导航模块
        navigationModel(){
            this.showNavigation = true
            this.ShowHidden1 = false
            this.ShowHidden = false
            this.basicPageForm= false
            this.addModel = 2
        },
 
        //权限显示
        handleClick(tab, event) {
        },
        handleCheckAllChange_Navs(){
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        //权限显示
        handleCheckAllChange(val) {
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;

        },

        //导航条新增
        addToNavs(tab,index){
            let obj = JSON.parse(JSON.stringify(this.form_navsChild))
            this.form_navs.navs.splice(index+1,0,obj)
        },
        // 导航条删除
        deleteNavs(index){
            this.form_navs.navs.splice(index,1)
        },
        //导航模块删除
        deleteNavsModule(){

        },
        navsHover(index){
            $('.navigation_box').eq(index).css({
                'background-color': this.background_sel_color,
                'color': this.form_navs.font_sel_color
            }).siblings().css({
                'background-color': this.form_navs.background_color,
                'color': this.form_navs.font_def_color
            })
        },
        colorControl(datam){
            return `background-color: ${this.form_navs.background_color} ; color: ${this.form_navs.font_def_color}; `
        },
    },
    mounted() {
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

</script>

<style scoped>
.right_form {
    left: 60%;
    position: absolute;
    background-color: #f0f2f5;
}
.navigation{
    display: flex
}
.navigation_box{
    width: 112.5px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: solid 1px #000;
}
</style>
 