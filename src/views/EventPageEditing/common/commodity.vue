<template>
  
<div  class="commodityModule">
     <!-- 商品模块 -->
    <div class="right_form" v-show="showNavigation">
                 <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="商品模块" name="isCommodity"> </el-tab-pane>
                    <el-tab-pane label="显示" name="isShowCommoditytitle"> </el-tab-pane>
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
export default {
    name: 'commodity',
    data() {
        return {
            form:{
                
            }
        }
    },
    created() {

    },
    watch:{

    },
    computed: {
    },
    components: {
        draggable
    },
    methods: {

    },
    mounted() {

    }
}

</script>

<style scoped>

</style>
 