<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="11">
                <el-card shadow="hover" class="mgb20" style="height:260px;">
                    <div class="user-info">
                        <img src="../assets/img/touxiang.gif" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">用户名: &nbsp;{{userName}}</div>
                            <br/>
                            用户id: &nbsp;{{login_user_id}}
                        </div>
                    </div>
                    <!-- <div class="user-info-list">上次登录时间：<span>{{ loginTime }}</span></div> -->
                </el-card>
            </el-col>
            <el-col :span="11">
                <el-card shadow="hover" class="mgb20" style="height:260px;">
                    <div slot="header" class="clearfix">
                        <span>角色信息</span>
                        <!-- <el-button @click="buttest('用户信息')" style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    </div>
                    <div class="text item">
                        中文名
                        <el-tag
                            v-for="item in roles"
                            :key="item.name"
                            type=""
                            effect="dark">
                            {{ item.name }}
                        </el-tag>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 页面loading -->
        <div>
        </div>
    </div>
</template>
<script>
    import bus from '../components/common/bus'
    import CityInfo from '@/utils/city-data.js'
    import {logout,logme} from '@/api/login'
    import {mapGetters, mapState} from 'vuex'
    export default {
        name: 'home',
        data() {
            return {
                show2: true,
                name: '',
                userInformation: '',
                outerVisible: false,
                form: {
                    city : '',
                    erae : '',
                    minerae : '',
                    selectedOptions: [],//地区筛选数组
                },
                CityInfo:CityInfo,
                city1:'',
                roles:[],
                user_name:localStorage.getItem('user_name'),
                user_desc:localStorage.getItem('user_desc'),
                login_user_id:localStorage.getItem('login_user_id'),
            }
        },
        //监控data里的数据
        watch:{
        },
        computed: {
            ...mapGetters(['userName'])
        },
        //dom实例(html)没有渲染出来前执行created()
        created(){
            this.name = this.userName
            logme().then(res=>{
                if(res.roles == undefined){
                    
                }
                this.roles = res.roles;
                console.log(res);
            })
        },
        //dom(html)渲染后执行mounted()
        mounted(){
        },
        methods: {
            
        },
        // vue 过滤器
        filters:{
            myAddressCity(value){
                for(let y in CityInfo){
                    if(CityInfo[y].value == value){
                        return value = CityInfo[y].label
                    }
                }
            },
            myAddressErae(value){
                for(let y in CityInfo){
                    for(let z in CityInfo[y].children){
                        if(CityInfo[y].children[z].value == value && value!=undefined){
                            return value = CityInfo[y].children[z].label;
                        }
                    }
                }
            },
            myAddressMinerae(value){
                for( let y in CityInfo){
                    for( let z in CityInfo[y].children){
                        for(let i in CityInfo[y].children[z].children){
                            if(CityInfo[y].children[z].children[i].value == value && value!=undefined){
                                return value = CityInfo[y].children[z].children[i].label
                            }
                        }
                    }
                }
            },
        },
    }
</script>
<style scoped lang="scss">
    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        // border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }
    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }
    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }
    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }
    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }
    .user-info-list span {
        margin-left: 70px;
    }
    .mgb20 {
        margin-bottom: 20px;
    }   
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
    /* dialog动画效果 */
    .dialog-fade-enter-active .el-dialog.way{
    animation: anim-open .3s;
    }
    .dialog-fade-leave-active .el-dialog.way{
    animation: anim-close .3s;
    }
    @keyframes anim-open {
    0% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    }
    @keyframes anim-close {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }
    }
</style>
