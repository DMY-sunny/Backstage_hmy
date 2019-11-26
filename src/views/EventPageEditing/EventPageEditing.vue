<template>
  <div>
    <!-- 头部按钮区域 -->
    <div class="heder">
      <div>
        <el-button type="warning" @click="foldBut">一键{{this.isFold ? "展开" : "折叠" }}模块</el-button>
      </div>
      <div class="hederAddBut">
        <el-button type="warning" @click="newTemplate(1)">新增模块</el-button>
        <div v-if="isShowForm === 1">
          <ul>
            <li v-for="(dataA,index) in butList" :key="index">
              <el-button plain @click="newTemplate(dataA.i)">{{dataA.name}}</el-button>
            </li>
          </ul>
        </div>
      </div>
      <div class="hederSaveBut">
        <el-button icon="el-icon-edit" type="primary" @click="isShowForm = 0">页面基础配置</el-button>
        <el-button icon="el-icon-check" type="success" @click.stop="saveData">保存数据</el-button>
      </div>
    </div>
    <!-- 模块区域 -->
    <!-- <i class="el-icon-setting" style="font-size:20px">&nbsp;展示区:</i> -->
    <div class="content">
      <div class="disBorder" :style="dynamicBg()">
        <!-- 侧边栏导航模块 -->
        <div v-if="!isFold && template.side_navs.length" class="navigation border_dashed" :style="`background-color: ${template.side_navs_bg_color};color: ${template.side_navs_color};`">
          <div v-for="(side,index) in template.side_navs" :key="'side'+index" class="navigation_box" @click="newTemplate(12),redactVSadd=1">
            <span class="navigation_title">
              <div style="width: 80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                {{side.text}}
              </div>
            </span>
          </div>
        </div>
        <draggable v-model="template.m" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
          <div class="moban_item" v-for="(data,index) in template.m" :key="'item-'+index" @clik.prevent="removalEvent">
          <!-- 拖拽区 -->
            <div draggable="true">
              <!-- 导航模块 -->
              <div v-if="isFold && data.module_type == 4" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 4" :ref="data.fe_module_id" class="navigation border_dashed" :style="`background-color: ${data.background_color};color: ${data.font_def_color};`">
                <div v-for="(datam,index) in data.navs" :key="'datam'+index" class="navigation_int" @click="navsHover(index)" :style="colorControl(index)">
                  <svg-icon class="svg_icon_daohang" :icon-class="datam.icon"></svg-icon>
                  <span class="navigation_title">
                    <div style="width: 112px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{datam.title}}
                    </div>
                  </span>
                </div>
              </div>
              <!-- 图片热区模快 -->
              <div v-if="isFold && data.module_type == 1" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 1" class="border_dashed" style="position: relative;overflow: hidden;" :ref="data.fe_module_id" :class="data.fe_module_id">               
                <div
                  @click="hotItem(form_data,data,index)"
                  @mousedown.stop="moveStop"
                  v-for="form_data in data.areas"
                  :key="form_data.act_id"
                  class="HotZone_box"
                  :style="HotZone_style(form_data)"
                ></div>
                <img
                  ref="img_height"
                  @clik="removalEvent"
                  class="HotZone_img"
                  :src="cdn06 + data.background"
                  @load="initSet(data)"
                />
              </div>
              <!-- 商品模块 -->
              <div v-if="isFold && data.module_type == 2 || isFold && data.module_type == 8" class="foldMod"><span>{{data.module_title}}</span></div>
              <commodityTool
                v-else-if="data.module_type === 2 || data.module_type === 8"
                :ref="data.fe_module_id"
                :class="data.fe_module_id"
                :commodityTool="data"
                class="border_dashed"
              ></commodityTool>
              <!-- 轮播图模快 -->
              <div v-if="isFold && data.module_type == 3" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 3 && data.length !== 0" :ref="data.fe_module_id" id="carouselMap" class="border_dashed" :class="data.fe_module_id">
                  <div v-for="(map,index) in data.picture_list" :key="'map'+index" @click="hotMap(map,data,index)" class="carouselMap_box">
                      <img ref="img_height" style="cursor:pointer;width:100%" @clik.prevent :src="cdn06 + map.img_url" @load="carImg(data)" />                   
                  </div>
              </div>
              <!-- 倒计时模块 -->
              <div v-if="isFold && data.module_type == 5" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 5" class="border_dashed" :class="data.fe_module_id" :ref="data.fe_module_id" style="width:562.5px;overflow-x: auto;" :style="`background-color: ${data.djs_bg_color_def};`">
                <div v-for="(item,index) in data.time_list" :key="'item9'+index" @click.stop="onCounBut(item,data,index)" :style="colorCounBut(index,item)" style="width:281.25px;vertical-align: middle;overflow: hidden;background-size:cover;display:inline-block;cursor:pointer;">
                    <div style="margin: 0 auto;text-align: center;height:50px;line-height: 50px;">
                        <el-divider direction="vertical"></el-divider>
                        <span>{{item.countdown_time}}</span>
                        <el-divider direction="vertical"></el-divider>
                    </div>
                </div>
                <div v-for="(item,index) in data.time_list" :key="'item'+index" style="vertical-align: middle;overflow: hidden;background-size:cover;">
                  <commodityTool
                    v-show="isShowCountdown_commod === index"
                    :commodityTool="item"
                  ></commodityTool>
                </div>
              </div>
              <!-- 弹幕轮播模块 -->
              <div v-if="isFold && data.module_type == 6" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 6" style="width:562.5px;height:300px;position: relative;overflow: hidden;" :ref="data.fe_module_id" class="border_dashed" :class="data.fe_module_id">
                <div
                  @mousedown.stop="drag"
                  :style="colorBarrageDrag(data,index)"
                >
                  <div
                  v-for="(datam,index) in data.list"
                  :key="'datam'+index"
                  @click="clickBarrage(datam,data,index)"                  
                  class="barrage_box"
                  :style="colorBarrage(datam,index)"
                  >
                    <img style="wvidth: 200px;" v-if="datam.type === 'img'" :src="datam.type_value" alt="加载失败">
                    <span v-else style="width: 80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{datam.type_value}}</span>
                  </div>
                </div>
                <img
                  style="overflow: hidden;"
                  @clik="removalEvent"
                  class="HotZone_img"
                  :src="cdn06+data.background"
                />
              </div>
              <!-- tab商品模块 -->
              <div v-if="isFold && data.module_type == 7" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 7" class="border_dashed" :class="data.fe_module_id" :ref="data.fe_module_id" style="width:562.5px;overflow-x: auto;" :style="`background-color: ${data.djs_bg_color_def};`">
                <div v-for="(item,index) in data.list" :key="'iteminde'+index" @click.stop="onTABcommod(item,data,index)" :style="colorTABBut(index,item)" class="navigation_int">
                    <svg-icon class="svg_icon_daohang" :icon-class="item.icon"></svg-icon>
                    <span class="navigation_title">
                    <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{item.title}}
                    </div>
                    </span>
                </div>
                <div v-for="(item,index) in data.list" :key="'item'+index" style="vertical-align: middle;overflow: hidden;background-size:cover;">
                  <commodityTool
                    v-show="isShowTAB_commod === index"
                    :commodityTool="item"
                  ></commodityTool>
                </div>
              </div>
              <!-- 优惠券模块 -->
              <div v-if="isFold && data.module_type == 9 || isFold && data.module_type == 11"  class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 9" class="couponCla border_dashed">
                  <div v-for="(coupon,index) in data.list" :key="'coupon'+index" @click="couponClick(coupon,data,index)">
                    <div class="couponClaSingle">
                      <div class="couponPrice">
                        <div class="price_rmb">
                          <span>￥</span>
                          <span style="font-size: 30px;color: #FE0F40">{{coupon.price}}</span>
                        </div>
                        <div class="price_spa">
                          <div class="Group">{{coupon.name}}</div>
                          <em class="priceText">{{coupon.desc}}</em>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div v-else-if="data.module_type == 11" class="couponCla_yijian border_dashed">
                  <img
                  @click="yijianlingqu(data)"
                  style="overflow: hidden;"
                  class="HotZone_img"
                  :src="cdn06+data.before_img"
                />
              </div>
              <!-- 爆款推荐模快 -->
              <div v-if="isFold && data.module_type == 10" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 10 && data.length !== 0" :ref="data.fe_module_id" id="carouselMap" class="border_dashed" :class="data.fe_module_id">
                  <div v-for="(map,index) in data.picture_list" :key="'map'+index" @click="recoCurrent(map,data,index)" class="carouselMap_box">
                    <div>
                      <img ref="img_height" style="cursor:pointer;width:100%" @clik.prevent :src="cdn06 + map.img_url" @load="carImg(data)" />
                    </div>
                  </div>
              </div>
              <!-- 标题分类模块 -->
              <div v-if="isFold && data.module_type == 12" class="foldMod"><span>{{data.module_title}}</span></div>
              <div v-else-if="data.module_type == 12" class="border_dashed">
                <div class="titleClassW" :style="titleClassStyle(data)">
                  <svg-icon class="svg_icon" :icon-class="data.icon"></svg-icon>
                  <div class="titleCmargin">{{data.title}}</div>
                  <svg-icon class="svg_icon" :icon-class="data.icon"></svg-icon>
                </div>
              </div>
            </div>
            <!-- 工作按钮区域  -->
            <div class="workButton">
              <div v-if="!isFold">
                <el-button type="primary" @click="templateItem(data,index)">修改模块</el-button>
              </div>
              <div v-if="isFold">
                <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
              </div>
              <div v-if="!isFold">
                <el-button type="success" @click="newTemplate(99,index)">插入模块</el-button>
                <div v-if="isShowBut === 99+index">
                  <ul class="headeList">
                    <li>
                      <el-button plain @click="newTemplate(2,index)">导航模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(3,index)">图片模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(4,index)">商品模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(6,index)">轮播模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(8,index)">倒计时模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(10,index)">弹幕轮播模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(12,index)">侧边栏模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(14,index)">tab商品模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(16,index)">横向滑动模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(17,index)">优惠券模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(19,index)">爆款推荐模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(21,index)">一键领取模块</el-button>
                    </li>
                    <li>
                      <el-button plain @click="newTemplate(22,index)">标题分类模块</el-button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- </transition-group> -->
        </draggable>
      </div>
      <!-- 工作区表单区域 -->
      <!-- 基本页面配置信息 -->
      <div class="right_form" v-show="isShowForm === 0">
        <el-form class="height500" ref="template" :model="template" size="mini" label-width="120px">
          <el-form-item label="活动名称">
            <el-input v-model="template.title" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="begin_ts">
            <el-date-picker
              v-model="template.begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="按钮开关">
            <el-checkbox v-model="template.show_top_btn">置顶按钮显示</el-checkbox>
          </el-form-item>
          <el-form-item label="广告开关">
            <el-checkbox v-model="template.show_bottom_ad">商品广告显示</el-checkbox>
          </el-form-item>
          <el-form-item label="背景颜色" prop="background_color">
            <el-color-picker v-model="template.background_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景图片" prop="background">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              :on-success="handleBasicSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              name="background"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="填写备注">
            <el-input v-model="template.remark" placeholder="请输入备注-不用于前端显示"></el-input>
          </el-form-item>
          <el-form-item label="分享图片" prop="share_pic">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handlePicSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="template.share_pic" :src="cdn06 + template.share_pic" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分享文案" prop="share_desc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              placeholder="分享文案"
              v-model="template.share_desc"
            ></el-input>
          </el-form-item>
          <el-form-item label="查看更多字体颜色" prop="show_more_font_color">
            <el-color-picker v-model="template.show_more_font_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="查看更多背景颜色" prop="show_more_bg_color">
            <el-color-picker v-model="template.show_more_bg_color"></el-color-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- 热区模块专属 商品 -->
      <div class="right_form" v-show="isShowForm === 3">
        <el-form class="height500" :rules="rules" ref="form" :model="form" size="mini" label-width="100px">
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="form.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="form.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="form.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="添加图片" prop="background">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="form.background" :src="cdn06 + form.background" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="form.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="moban('form')"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              v-if="ShowHidden_del_but"
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 新建热区-->
      <div class="right_form" v-show="isShowForm === 5">
        <el-form
          class="height500"
          ref="form_data"
          :model="form_data"
          size="mini"
          label-width="120px"
        >
          <el-form-item label="热区事件">
            <el-select label="事件类型" v-model="form_data.event_type">
              <el-option
                :value="item.value"
                :label="item.key"
                v-for="(item,index) in operatorList"
                :key="'event_type-'+index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="链接类型">
            <el-select v-model="form_data.link_type">
              <el-option
                :value="item.value"
                :label="item.key"
                v-for="(item,index) in listType"
                :key="'link_type-'+index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型" v-show="form_data.link_type==='1'">
            <el-select v-model="form_data.goods_type">
              <el-option
                :value="item.value"
                :label="item.key"
                v-for="(item,index) in goodsType"
                :key="'goods_type-'+index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="活动类型"
            v-show="form_data.link_type==='1' && form_data.goods_type ==='act_goods' || form_data.link_type==='3' && form_data.goods_type ==='act_goods'"
          >
            <el-select v-model="form_data.act_type">
              <el-option
                :value="item.value"
                :label="item.key"
                v-for="(item,index) in act_type"
                :key="'act_type-'+index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="活动 I D"
            v-show="form_data.link_type==='1' && form_data.goods_type ==='act_goods' || form_data.link_type==='3' && form_data.goods_type ==='act_goods'"
            prop="act_id"
          >
            <el-input v-model="form_data.act_id"></el-input>
          </el-form-item>
          <el-form-item label="GOODS_ID" v-show="form_data.link_type==='1'" prop="goods_id">
            <el-input v-model="form_data.goods_id"></el-input>
          </el-form-item>
          <el-form-item label="H5链接" v-show="form_data.link_type==='2'" prop="url_h5">
            <el-input v-model="form_data.url_h5"></el-input>
          </el-form-item>
          <el-form-item label="小程序链接" v-show="form_data.link_type==='2'" prop="url_xcx">
            <el-input v-model="form_data.url_xcx"></el-input>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="form_data.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="form_data.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="form_data.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-edit"
              type="primary"
              @click="requBut(form_data)"
            >{{this.type_am ===1?'修改':this.type_am ===0?'创建':''}}热区</el-button>
            <el-button type="primary" size="mini" @click.stop="DeleteRequ">删除热区</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 导航模块 -->
      <div class="right_form height500" v-show="isShowForm === 2">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="导航模块" name="navigation"></el-tab-pane>
          <el-tab-pane label="外观" name="naviExterior"></el-tab-pane>
          <el-tab-pane label="显示" name="naviDisplay"></el-tab-pane>
        </el-tabs>
        <el-form
          ref="temp_extends"
          :model="temp_extends"
          size="mini"
          label-width="150px"
        >
          <div v-show="isShowFormNavs === '0'">
            <ul>
            <draggable v-model="temp_extends.navs" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
              <li
                v-for="(tab,index) in temp_extends.navs"
                :key="'navs'+index"
                style="display:flex;height:35px"
              >
                <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
                <el-input v-model="tab.title" maxlength="6" show-word-limit placeholder="最多输入6个字"></el-input>
                <el-select v-model="tab.icon" placeholder="请选择icon" class="inputwidth">
                  <el-option
                    v-for="item in iconlist"
                    :key="'temp_extends'+item.id"
                    :value="item.name"
                  >
                  <svg-icon class="svg_icon_list" :icon-class="item.name"></svg-icon> 
                  </el-option>
                </el-select>
                <span style="white-space:nowrap">&nbsp; 跳转至 &nbsp;</span>
                <el-select v-model="tab.jmp">
                  <el-option
                    v-for="item in filterM"
                    :key="item.fe_module_id"
                    :label="item.module_title"
                    :value="item.fe_module_id"
                  ></el-option>
                </el-select>
                <el-button type="danger" @click="deleteNavs(index)">删除</el-button>
                <el-button type="success" @click="addToNavs(tab,index)">添加</el-button>
              </li>
            </draggable>
            </ul>
          </div>
          <div v-show="isShowFormNavs === '1'">
            <el-form-item label="背景颜色" prop="background_color">
              <el-color-picker v-model="temp_extends.background_color"></el-color-picker>
              <el-input v-model="temp_extends.background_color"></el-input>
            </el-form-item>
            <el-form-item label="字体默认颜色" prop="font_def_color">
              <el-color-picker v-model="temp_extends.font_def_color"></el-color-picker>
              <el-input v-model="temp_extends.font_def_color"></el-input>
            </el-form-item>
            <el-form-item label="字体选中颜色" prop="font_sel_color">
              <el-color-picker v-model="temp_extends.font_sel_color"></el-color-picker>
              <el-input v-model="temp_extends.font_sel_color"></el-input>
            </el-form-item>
            <el-form-item label="选中背景颜色" prop="background_sel_color">
              <el-color-picker v-model="temp_extends.background_sel_color"></el-color-picker>
              <el-input v-model="temp_extends.background_sel_color"></el-input>
            </el-form-item>
          </div>
          <div v-show="isShowFormNavs === '2'">
            <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="temp_extends.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="temp_extends.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
            <el-form-item label="显示选择">
              <el-checkbox-group v-model="temp_extends.show_mode">
                <el-checkbox
                  v-for="city in cities_hot"
                  :label="city.value"
                  :key="city.value"
                >{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
        <el-button v-if="isINavsBut === 1" type="primary" @click="addToNavs(1)">添加导航</el-button>
        <el-button
              type="primary"
              @click="addToNavsModule"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
        <el-button
              v-if="isINavsBut === 2"
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai(4)"
            >删除当前模块</el-button>
      </div>
      <!-- 商品模块 -->
      <div class="right_form" v-show="isShowForm === 4 || isShowForm === 16">
        <el-form
          label-width="110px"
          ref="commodityInfo"
          :rules="commodityRules"
          :model="commodityInfo"
          class="height500"
        >
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="commodityInfo.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="commodityInfo.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="commodityInfo.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="头部图片上传" prop="type_value">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleGoodsSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="commodityInfo.head_img" :src="cdn06+commodityInfo.head_img" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="commodityInfo.head_img">
              <el-button type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('toutu')" >删除当前头图</el-button>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="commodityInfo.background_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="爆款商品" prop="is_hot">
            <el-switch v-model="commodityInfo.is_hot" active-text="存在爆款商品" inactive-text="不存在爆款商品"></el-switch>
          </el-form-item>
          <el-form-item label="显示列数" prop="template">
            <el-radio-group v-model="commodityInfo.template">
              <el-radio-button label="rows_1">单列</el-radio-button>
              <el-radio-button label="rows_2">双列</el-radio-button>
              <el-radio-button label="rows_3">三列</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="价格文字" prop="price_text">
            <el-input v-model="commodityInfo.price_text"></el-input>
          </el-form-item>
          <el-form-item label="价格颜色">
            <el-color-picker v-model="commodityInfo.price_bg_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="添加商品">
            <el-button type="primary" @click="commodityList(0)">编辑商品列表</el-button>
          </el-form-item>
          <el-form-item label="跳转小程序">
            <el-input v-model="commodityInfo.more_url_xcx"></el-input>
          </el-form-item>
          <el-form-item label="跳转H5">
            <el-input v-model="commodityInfo.more_url_h5"></el-input>
          </el-form-item>
          <el-form-item label="商品logo" prop="logo">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleLogoSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="commodityInfo.logo" :src="cdn06+commodityInfo.logo" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="logo是否显示" prop="show_logo">
            <el-switch v-model="commodityInfo.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
          </el-form-item>
          <el-form-item label="商品角标" prop="subscript_pic">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleSubscriptSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="commodityInfo.subscript_pic" :src="cdn06+commodityInfo.subscript_pic" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="commodityInfo.subscript_pic">
              <el-button  type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('jiaobiao')" >删除当前图片</el-button>
          </el-form-item>
          <el-form-item label="角标位置">
            <el-radio-group v-model="commodityInfo.position">
              <el-radio-button v-if="!commodityInfo.show_logo" label="0">左上</el-radio-button>
              <el-radio-button v-if="commodityInfo.template !== 'rows_1'" label="1">右上</el-radio-button>
              <el-radio-button label="2">左下</el-radio-button>
              <el-radio-button v-if="commodityInfo.template !== 'rows_1'" label="3">右下</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="commodityInfo.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="commodityInfo.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="commodityInfo.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="commodityInfo.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onEstablish"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 轮播模块 新建模块-->
      <div class="right_form" v-show="isShowForm === 6">
        <el-form
          label-width="110px"
          ref="carousel_map"
          :model="carousel_map"
          :rules="carouselMapRules"
          class="height500"
        >
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="carousel_map.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="carousel_map.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="carousel_map.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="carousel_map.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="carousel_map.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="carousel_map.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="carousel_map.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onCarouselMap"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 轮播模块 修改处理图片-->
      <div class="right_form" v-show="isShowForm === 7">
        <el-form
          label-width="110px"
          ref="carouse_url"
          :rules="carouselMap2Rules"
          :model="carouse_url"
          class="height500"
        >
          <el-form-item label="图片上传" prop="img_url">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleMapSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="carouse_url.img_url" :src="cdn06+carouse_url.img_url" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="H5链接" prop="url_h5">
            <el-input v-model="carouse_url.url_h5"></el-input>
          </el-form-item>
          <el-form-item label="小程序链接" prop="url_xcx">
            <el-input v-model="carouse_url.url_xcx"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="mapBut(carouse_url)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}图片</el-button>
            <el-button type="danger" size="mini" @click.stop="DelCarouselMap">删除图片</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 倒计时模块 -->
      <div class="right_form" v-show="isShowForm === 8">
        <el-form class="height500" label-width="110px" size="mini" label-position="right" ref="countdownModule" :rules="countdownRules" :model="countdownModule">
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="countdownModule.module_title"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="倒计时背景颜色">
                <el-color-picker v-model="countdownModule.djs_bg_color_def"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="title选中背景颜色">
                <el-color-picker v-model="countdownModule.background_sel_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="title默认字体颜色">
                <el-color-picker v-model="countdownModule.font_def_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="title选中字体颜色">
                <el-color-picker v-model="countdownModule.font_sel_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间描述文字颜色">
                <el-color-picker v-model="countdownModule.time_des_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="时,分字体颜色">
                <el-color-picker v-model="countdownModule.hour_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时,分背景颜色">
                <el-color-picker v-model="countdownModule.hour_bg_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已开始秒字体颜色">
                <el-color-picker v-model="countdownModule.has_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="已开始秒背景颜色">
                <el-color-picker v-model="countdownModule.has_bg_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="未开始秒字体颜色">
                <el-color-picker v-model="countdownModule.has_not_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="未开始秒背景颜色">
                <el-color-picker v-model="countdownModule.has_not_bg_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="countdownModule.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onCountdownModule"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 倒计时 list -->
      <div class="right_form" v-show="isShowForm === 9">
        <el-form class="height500" :rules="countdown_rules" label-width="110px" ref="countdownChild" :model="countdownChild">
          <el-form-item label="开始时间" prop="begin_ts">
            <el-date-picker
              v-model="countdownChild.begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_ts">
            <el-date-picker
              v-model="countdownChild.end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="商品背景颜色">
            <el-color-picker v-model="countdownChild.background_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="显示列数" prop="template">
            <el-radio-group v-model="countdownChild.template">
              <el-radio-button label="rows_1">单列</el-radio-button>
              <el-radio-button label="rows_2">双列</el-radio-button>
              <el-radio-button label="rows_3">三列</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="价格文字" prop="price_text">
            <el-input v-model="countdownChild.price_text"></el-input>
          </el-form-item>
          <el-form-item label="价格颜色">
            <el-color-picker v-model="countdownChild.price_bg_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="添加商品">
            <el-button type="primary" @click="commodityList(1)">编辑商品列表</el-button>
          </el-form-item>
          <el-form-item label="跳转小程序">
            <el-input v-model="countdownChild.more_url_xcx"></el-input>
          </el-form-item>
          <el-form-item label="跳转H5">
            <el-input v-model="countdownChild.more_url_h5"></el-input>
          </el-form-item>
          <el-form-item label="商品logo" prop="logo">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleDjsLogoSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="countdownChild.logo" :src="cdn06+countdownChild.logo" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="logo是否显示" prop="show_logo">
            <el-switch v-model="countdownChild.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
          </el-form-item>
          <el-form-item label="商品角标" prop="subscript_pic">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleCountSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="countdownChild.subscript_pic" :src="cdn06+countdownChild.subscript_pic" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="countdownChild.subscript_pic">
              <el-button  type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('daojishi')" >删除当前图片</el-button>
          </el-form-item>
          <el-form-item label="角标位置">
            <el-radio-group v-model="countdownChild.position">
              <el-radio-button v-if="!countdownChild.show_logo" label="0">左上</el-radio-button>
              <el-radio-button v-if="countdownChild.template !== 'rows_1'" label="1">右上</el-radio-button>
              <el-radio-button label="2">左下</el-radio-button>
              <el-radio-button v-if="countdownChild.template !== 'rows_1'" label="3">右下</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="countdownChild.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="countdownChild.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="countdownChild.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="countdownBut(countdownChild)"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'添加':''}}时间模板</el-button>
            <el-button type="danger" size="mini" @click.stop="DelCountdown">删除时间模板</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 弹幕轮播模块 -->
      <div class="right_form" v-show="isShowForm === 10">
        <el-form class="height500" label-width="110px" ref="barrageModule" :rules="barrageRules" :model="barrageModule">
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="barrageModule.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="barrageModule.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="barrageModule.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="添加图片" prop="background">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleBarrageSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="barrageModule.background" :src="cdn06 + barrageModule.background" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容位置" prop="template">
            <el-radio-group v-model="barrageModule.text_align">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>              
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="barrageModule.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="barrageModule.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="barrageModule.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="barrageModule.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onBarrageModule(barrageModule)"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 弹幕轮播模块 list -->
      <div class="right_form" v-show="isShowForm === 11">
        <el-form
          label-width="110px"
          ref="barrageList"
          :rules="barrageListRules"
          :model="barrageList"
          class="height500"
        >
          <el-form-item label="类型">
            <el-select v-model="barrageList.type" placeholder="请选择">
              <el-option key="0" label="文字" value="text"></el-option>
              <el-option key="1" label="图片" value="img"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="barrageList.type === 'img'" label="图片上传" prop="type_value">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleBarrageListSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="barrageList.type_value" :src="cdn06+barrageList.type_value" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-else label="弹幕文字" prop="type_value">
              <el-input v-model="barrageList.type_value"></el-input>
          </el-form-item>
          <el-form-item label="H5链接" prop="url_h5">
            <el-input v-model="barrageList.url_h5"></el-input>
          </el-form-item>
          <el-form-item label="小程序链接" prop="url_xcx">
            <el-input v-model="barrageList.url_xcx"></el-input>
          </el-form-item>
          <el-form-item label="文字默认颜色">
            <el-color-picker v-model="barrageList.font_def_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="文字选中颜色">
            <el-color-picker v-model="barrageList.font_sel_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="文字背景颜色">
            <el-color-picker v-model="barrageList.background_color"></el-color-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="barrageListBut(barrageList)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}弹幕</el-button>
            <el-button type="danger" size="mini" @click.stop="DelBarrageList">删除弹幕</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 侧边栏导航模块 -->
      <div class="right_form" v-show="isShowForm === 12">
        <el-form
          label-width="110px"
          ref="template"
          :model="template"
          class="height500"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="侧边导航主题颜色">
                <el-color-picker v-model="template.side_navs_bg_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="侧边导航渐变颜色">
                <el-color-picker v-model="template.side_navs_gradient_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="侧边文字渐变颜色">
                <el-color-picker v-model="template.side_gradient_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="侧边导航字体颜色">
                <el-color-picker v-model="template.side_navs_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否展示侧边栏">
            <el-checkbox v-model="template.side_navs_show"></el-checkbox>
          </el-form-item>
          <el-form-item label="侧边导航大按钮文案">
            <el-input v-model="template.side_navs_text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="sideBut(0)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}模块</el-button>
            <el-button type="danger" size="mini" @click.stop="sideBut(1)">删除模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 侧边栏导航模块list -->
      <div class="right_form" v-show="isShowForm === 13">
        <el-form
          class="height500"
          ref="sideNavs"
          :model="sideNavs"
          size="mini"
          label-width="150px"
        >
          <div>
            <ul>
            <draggable v-model="template.side_navs" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
              <li
                v-for="(tab,index) in template.side_navs"
                :key="'navs'+index"
                style="display:flex;height:35px"
              >
                <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
                <el-input placeholder="导航名称" v-model="tab.text"></el-input>
                <span style="white-space:nowrap">&nbsp; 跳转至 &nbsp;</span>
                <el-input placeholder="跳转H5" v-model="tab.url_h5"></el-input>
                <el-input placeholder="跳转小程序" v-model="tab.url_xcx"></el-input>                
                <el-button type="danger" @click="deleteSideNavs(index)">删除</el-button>
                <el-button type="success" @click="sideNavsBut(tab,index)">添加</el-button>
              </li>
            </draggable>
            </ul>
          </div>
        </el-form>
        <el-button v-if="isINavsBut === 1" type="primary" @click="sideNavsBut(1)">添加导航</el-button>
      </div>
      <!-- TAB商品模块 -->
      <div class="right_form" v-show="isShowForm === 14">
        <el-form class="height500" label-width="110px" size="mini" label-position="right" ref="TABcommodModule" :rules="TABcommodRules" :model="TABcommodModule">
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="TABcommodModule.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="TABcommodModule.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="TABcommodModule.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="默认背景颜色">
                <el-color-picker v-model="TABcommodModule.bg_color_def"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选中背景颜色">
                <el-color-picker v-model="TABcommodModule.bg_sel_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="默认字体颜色">
                <el-color-picker v-model="TABcommodModule.font_def_color"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选中字体颜色">
                <el-color-picker v-model="TABcommodModule.font_sel_color"></el-color-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="TABcommodModule.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onTABcommodModule"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- TAB商品 list -->
      <div class="right_form" v-show="isShowForm === 15">
        <el-form class="height500" label-width="110px" ref="TABcommodChild" :model="TABcommodChild">
          <el-form-item label="导航文案" prop="title">
            <el-input v-model="TABcommodChild.title"></el-input>
          </el-form-item>
          <el-form-item label="icon">
            <el-select v-model="TABcommodChild.icon" placeholder="请选择icon" class="inputwidth">
              <el-option
                v-for="(item,index) in iconlist"
                :key="index"
                :value="item.name"
              >
              <svg-icon class="svg_icon_list" :icon-class="item.name"></svg-icon> 
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品背景颜色">
            <el-color-picker v-model="TABcommodChild.background_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="显示列数" prop="template">
          <el-radio-group v-model="TABcommodChild.template">
              <el-radio-button label="rows_1">单列</el-radio-button>
              <el-radio-button label="rows_2">双列</el-radio-button>
              <el-radio-button label="rows_3">三列</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="价格文字" prop="price_text">
            <el-input v-model="TABcommodChild.price_text"></el-input>
          </el-form-item>
          <el-form-item label="价格颜色">
            <el-color-picker v-model="TABcommodChild.price_bg_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="添加商品">
            <el-button type="primary" @click="commodityList(2)">编辑商品列表</el-button>
          </el-form-item>
          <el-form-item label="跳转小程序">
            <el-input v-model="TABcommodChild.more_url_xcx"></el-input>
          </el-form-item>
          <el-form-item label="跳转H5">
            <el-input v-model="TABcommodChild.more_url_h5"></el-input>
          </el-form-item>
          <el-form-item label="商品logo" prop="logo">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleTabLogoSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="TABcommodChild.logo" :src="cdn06+TABcommodChild.logo" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="logo是否显示" prop="show_logo">
            <el-switch v-model="TABcommodChild.show_logo" active-text="显示" inactive-text="隐藏"></el-switch>
          </el-form-item>
          <el-form-item label="商品角标" prop="subscript_pic">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleTABSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="TABcommodChild.subscript_pic" :src="cdn06+TABcommodChild.subscript_pic" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="TABcommodChild.subscript_pic">
              <el-button  type="danger" icon="el-icon-delete" round @click.stop="Deletehead_img('TAB')" >删除当前图片</el-button>
          </el-form-item>
          <el-form-item label="角标位置">
            <el-radio-group v-model="TABcommodChild.position">
              <el-radio-button v-if="!TABcommodChild.show_logo" label="0">左上</el-radio-button>
              <el-radio-button v-if="TABcommodChild.template !== 'rows_1'" label="1">右上</el-radio-button>
              <el-radio-button label="2">左下</el-radio-button>
              <el-radio-button v-if="TABcommodChild.template !== 'rows_1'" label="3">右下</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="TABcommodChild.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="TABcommodChild.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="TABcommodChild.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="TABcommodChildBut(TABcommodChild)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}TAB商品</el-button>
            <el-button type="danger" size="mini" @click.stop="DelTABcommod">删除TAB商品</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 优惠券模块 -->
      <div class="right_form" v-show="isShowForm === 17 || isShowForm === 21 ">
        <el-form class="height500" label-width="110px" size="mini" label-position="right" ref="couponModule" :model="couponModule">
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="couponModule.module_title"></el-input>
          </el-form-item>
          <el-form-item label="背景颜色">
                <el-color-picker v-model="couponModule.bg_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
            <el-date-picker
              v-model="couponModule.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
            <el-date-picker
              v-model="couponModule.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="领取方式">
            <el-select v-model="couponModule.collection_method" placeholder="请选择">
              <el-option key="0" label="一键领取" value="onekey"></el-option>
              <el-option v-if="isShowForm === 17" key="1" label="单张领取" value="single"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="领取频率">
            <el-select v-model="couponModule.collection_rate" placeholder="请选择">
              <el-option key="0" label="一天一次" value="1day1"></el-option>
              <el-option key="1" label="只有一次" value="once"></el-option>
            </el-select>
          </el-form-item>  
          <el-form-item v-if="isShowForm === 21" label="领取前图片" prop="before_img">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleBeforeSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="couponModule.before_img" :src="cdn06+couponModule.before_img" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>    
          <el-form-item v-if="isShowForm === 21" label="领取后图片" prop="after_img">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleAfterSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="couponModule.after_img" :src="cdn06+couponModule.after_img" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>     
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="couponModule.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onCouponModule"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 优惠券 list -->
      <div class="right_form" v-show="isShowForm === 18">
        <el-form class="height500" label-width="110px" ref="couponList" :model="couponList">
          <el-form-item v-if="couponModule.module_type == 9" label="优惠券码" prop="text">
            <el-input v-model="couponList.coupon_code"></el-input>
          </el-form-item>
          <el-form-item v-if="couponModule.module_type == 9" label="优惠券类型">
            <el-select v-model="couponList.type" placeholder="请选择">
              <el-option key="0" label="满减" value="discount"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item v-if="couponModule.module_type == 9" label="优惠券金额" prop="price">
            <el-input v-model="couponList.price"></el-input>
          </el-form-item>
          <el-form-item v-if="couponModule.module_type == 9" label="优惠券名称" prop="name">
            <el-input v-model="couponList.name"></el-input>
          </el-form-item>
          <el-form-item v-if="couponModule.module_type == 9" label="优惠券描述" prop="desc">
            <el-input v-model="couponList.desc"></el-input>
          </el-form-item>
          <el-form-item v-if="couponModule.module_type == 9" label="满多少可领" prop="full">
            <el-input v-model="couponList.full"></el-input>
          </el-form-item>
          <div v-if="couponModule.module_type == 11">
            <ul>
              <draggable v-model="couponModule.list" @update="datadragEnd" :options="{animation:500}" :style="sizeFun('data')" handle=".handle">
                <li
                  v-for="(tab,index) in couponModule.list"
                  :key="'list'+index"
                  style="display:flex;height:35px"
                >
                  <el-button type="success" icon="el-icon-rank" class="handle"></el-button>
                  <el-input v-model="tab.coupon_code"></el-input>
                  <el-button type="danger" @click.stop="deleteyijianlingqu(index)">删除</el-button>
                  <el-button type="success" @click="addToyijianlingqu(tab,index)">添加</el-button>
                </li>
              </draggable>
            </ul>
          </div>
          <el-form-item v-if="couponModule.module_type == 9">
            <el-button
              type="primary"
              @click="couponChildBut(couponList)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}数据</el-button>
            <el-button type="danger" size="mini" @click.stop="DelCoupon">删除数据</el-button>
          </el-form-item>
          <el-form-item v-else>
            <el-button
              type="primary"
              @click="saveData('1')"
            >保存数据</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 爆品推荐 新建模块-->
      <div class="right_form" v-show="isShowForm === 19">
        <el-form
          label-width="110px"
          ref="recommend"
          :model="recommend"
          class="height500"
        >
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="recommend.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
          <el-date-picker
              v-model="recommend.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
          <el-date-picker
              v-model="recommend.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item label="按钮默认背景色">
            <el-color-picker v-model="recommend.bg_color_def"></el-color-picker>
          </el-form-item>
          <el-form-item label="按钮选中背景色">
            <el-color-picker v-model="recommend.bg_sel_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体默认颜色">
            <el-color-picker v-model="recommend.font_def_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体选中颜色">
            <el-color-picker v-model="recommend.font_sel_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="recommend.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="recommend.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="recommend.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="recommend.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onRecommend"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 爆品推荐 list-->
      <div class="right_form" v-show="isShowForm === 20">
        <el-form
          label-width="110px"
          ref="recommend_url"
          :model="recommend_url"
          class="height500"
          :rules="recommendL_rules"
        >
          <el-form-item label="开始时间" prop="begin_ts">
          <el-date-picker
              v-model="recommend_url.begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_ts">
          <el-date-picker
              v-model="recommend_url.end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="图片上传" prop="img_url">
            <el-upload
              class="upload-demo"
              action="api/upload/image"
              name="background"
              list-type="picture-card"
              :on-success="handleRecSuccess"
              :before-upload="beforeIMGUpload"
              :show-file-list="false"
            >
              <img v-if="recommend_url.img_url" :src="cdn06+recommend_url.img_url" width="146" height="146" />
              <i class="el-icon-plus" v-else></i>
              <div slot="tip" class="el-upload__tip">只能上传JPG/PNG/BMP文件，且不超过300kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="H5链接" prop="url_h5">
            <el-input v-model="recommend_url.url_h5"></el-input>
          </el-form-item>
          <el-form-item label="小程序链接" prop="url_xcx">
            <el-input v-model="recommend_url.url_xcx"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="recoBut(recommend_url)"
            >{{redactVSadd===1?'修改':redactVSadd===2?'添加':''}}数据</el-button>
            <el-button type="danger" size="mini" @click.stop="DelRecommend">删除数据</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 标题分类 模块-->
      <div class="right_form" v-show="isShowForm === 22">
        <el-form
          label-width="110px"
          ref="titleClass"
          :model="titleClass"
          class="height500"
        >
          <el-form-item label="模块名称" prop="module_title">
            <el-input v-model="titleClass.module_title"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="show_begin_ts">
          <el-date-picker
              v-model="titleClass.show_begin_ts"
              type="datetime"
              format="yyyy-MM-dd HH-mm-ss"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="show_end_ts">
          <el-date-picker
              v-model="titleClass.show_end_ts"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-dd HH-mm-ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="titleClass.bg_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="标题">
            <el-input maxlength="12" show-word-limit v-model="titleClass.title"></el-input>
          </el-form-item>
          <el-form-item label="icon">
            <el-select v-model="titleClass.icon" placeholder="请选择icon" class="inputwidth">
              <el-option
                v-for="(item,index) in iconlist"
                :key="index"
                :value="item.name"
              >
              <svg-icon class="svg_icon_list" :icon-class="item.name"></svg-icon> 
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否置灰" prop="show_disable_tips">
            <el-switch v-model="titleClass.show_disable_tips" active-text="打开" inactive-text="关闭"></el-switch>
          </el-form-item>
          <el-form-item v-if="titleClass.show_disable_tips" label="置灰文案" prop="disable_tips">
            <el-input v-model="titleClass.disable_tips"></el-input>            
          </el-form-item>
          <el-form-item label="显示选择">
            <el-checkbox-group v-model="titleClass.show_mode">
              <el-checkbox
                v-for="city in cities_hot"
                :label="city.value"
                :key="city.value"
              >{{city.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onTitleClass"
            >{{redactVSadd===1?'确认修改':redactVSadd===2?'确认创建':''}}模块</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              round
              @click.stop="DeleteMokuai"
            >删除当前模块</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 弹出框 商品编辑列表 -->
    <el-dialog title="商品编辑列表" :visible.sync="dialogVisible" width="1000px">
      <div v-if="countdown_commod === 0">
        <el-select v-model="commodityInfo.act_type" placeholder="活动类型" class="inputwidth">
          <el-option
            v-for="item in act_type"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="commodityInfo.act_id" placeholder="活动ID" class="inputwidth"></el-input>
        <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)"></el-input>
        <el-button @click="seekCommodity(0)">搜索</el-button>
        <div>
          <el-table :data="commodityInfo.goods" height="450" border style="width: 100%">
            <el-table-column prop="date" label="商品图片" width="110">
              <template slot-scope="scope">
                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
              </template>
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="china_goods_price" label="原价"></el-table-column>
            <el-table-column prop="china_vip_price" label="现价"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else-if="countdown_commod === 1">
        <el-select v-model="countdownChild.act_type" placeholder="活动类型" class="inputwidth">
          <el-option
            v-for="item in act_type"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="countdownChild.act_id" placeholder="活动ID" class="inputwidth"></el-input>
        <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)"></el-input>
        <el-button @click="seekCommodity(1)">搜索</el-button>
        <div>
          <el-table :data="countdownChild.goods" height="450" border style="width: 100%">
            <el-table-column prop="date" label="商品图片" width="110">
              <template slot-scope="scope">
                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
              </template>
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="china_goods_price" label="原价"></el-table-column>
            <el-table-column prop="china_vip_price" label="现价"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else>
        <el-select v-model="TABcommodChild.act_type" placeholder="活动类型" class="inputwidth">
          <el-option
            v-for="item in act_type"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="TABcommodChild.act_id" placeholder="活动ID" class="inputwidth"></el-input>
        <el-input v-model="numRows" placeholder="请添加商品展示几排" class="inputwidth" @change="onChangeRows(numRows)"></el-input>
        <el-button @click="seekCommodity(2)">搜索</el-button>
        <div>
          <el-table :data="TABcommodChild.goods" height="450" border style="width: 100%">
            <el-table-column prop="date" label="商品图片" width="110">
              <template slot-scope="scope">
                <img style="width:70px" :src="cdn06+scope.row.logo_url" />
              </template>
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
            <el-table-column prop="china_goods_price" label="原价"></el-table-column>
            <el-table-column prop="china_vip_price" label="现价"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// isShowForm: 0, //新增模块按钮 0基础表单设置 1新增模块 2导航模板 3图片热区模板 4商品模板 5子热区模块 6轮播模块 7轮播子图片上传修改处理模块 8倒计时模块 9倒计时list 10弹幕 11弹幕list 12侧边栏导航 13侧边栏导航list 14tab商品 15 tab商品list 16横向滑动商品模块 17优惠券模块 18优惠券list 19百万爆品 20百万爆品list 21一键领取优惠券 22标题分类模块
//按钮
const buttonData = [
  {i:2,name:'导航模块'},
  {i:3,name:'图片模块'},
  {i:4,name:'商品模块'},
  {i:6,name:'轮播模块'},
  {i:8,name:'倒计时模块'},
  {i:10,name:'弹幕轮播模块'},
  {i:12,name:'侧边栏模块'},
  {i:14,name:'tab商品模块'},
  {i:16,name:'横向滑动模块'},
  {i:17,name:'优惠券模块'},
  {i:19,name:'爆款推荐模块'},
  {i:21,name:'一键领取模块'},
  {i:22,name:'标题分类模块'},
];
// 角色
const cityOptions = [
  { name: "会员", value: "show_with_vip" },
  { name: "非会员", value: "show_with_not_vip" },
];
// 倒计时模块list
const countdown_Child = {
  countdown_time:"",//时间差只是后台用
  begin_ts:"",//开始时间
  end_ts:"",//结束时间
  background_color:"", // 商品默认背景颜色
  template:"",
  subscript_pic: "",
  price_text:"活动价",
  act_type:"seckill",
  act_id:"",
  url_h5_format: "",
  url_xcx_format:"",
  max_rows:"",
  more_url_xcx:"",
  more_url_h5:"",
  show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
  disable_tips: "活动未开始", // 置灰文案; 3.1期增加
  position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
  subscript: "", // 角标 11月需求增加
  price_bg_color:"#DC2992",//价格颜色
  logo: "", // logo 11月需求增加
  show_logo: false, // 是否显示logo 11月需求增加
  goods:[],
};
// tab商品模块list
const TABcommod_Child = {
  title:"",
  icon:"",
  background_color:"", // 商品默认背景颜色
  template:"",
  subscript_pic:'',
  price_text:"活动价",
  act_type:"seckill",
  act_id:"",
  url_h5_format: "",
  url_xcx_format:"",
  max_rows:"",
  more_url_xcx:"",
  more_url_h5:"",
  show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
  disable_tips: "活动未开始", // 置灰文案; 3.1期增加
  more_text_font:"#eeee", // 查看更多文案颜色 3.1期增加
  more_bg_color:"#eeee", // 查看更多背景颜色 3.1期增加
  position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
  subscript: "", // 角标 11月需求增加
  price_bg_color:"#DC2992",//价格颜色
  logo: "", // logo 11月需求增加
  show_logo: false, // 是否显示logo 11月需求增加
  goods:[],
};
const icons = [
  {id:1,name:'apparel'},
  {id:2,name:'crown2'},
  {id:3,name:'fruit'},
  {id:4,name:'Furniture'},
  {id:5,name:'discount'},
  {id:6,name:'gift'},
  {id:7,name:'label'},
  {id:8,name:'ladybags'},
  {id:9,name:'like'},
  {id:10,name:'money'},
  {id:11,name:'pinzhigongyingshang'},
  {id:12,name:'purse'},
  {id:13,name:'shopping'},
  {id:14,name:'shoppingcart'},
  {id:15,name:'Watch'},
  {id:16,name:'youhuiquan1'},
  {id:17,name:'youhuiquan2'},
  {id:18,name:'zhubaopeishi'},
  {id:19,name:'Masonry'},
  // {id:20,name:'gexingdazhe'},
  // {id:21,name:'crown'},
]; // 图标集测试
import draggable from "vuedraggable";
import {
  handleimgSearch,
  handleimgPost,
  eventPageConfigs,
  activityGoods
} from "@/api/EventPage/EventPageEditing";
import { formatDate } from "@/utils/utils";
import { parse } from "path";
import commodityTool from "./commodity";
// import carouselMap from "./carousel_map";
import { setTimeout } from "timers";
import { log } from 'util';
//将浏览器默认拖拽图片事件关掉
export default {
  name: "EventPage",
  data() {
    return {
      butList: buttonData,//按钮数据
      iconlist: { ...icons},
      isFold:false,//模块是否折叠
      isShowBut:0,//模块按钮点击是否显示按钮
      dialogVisible: false,
      //标签选择样式
      activeName: "navigation",
      isINavsBut: 1, //导航添加按钮
      redactVSadd:2,//1是修改2是添加
      //导航权限显示选择
      checkAll: false,
      checkedCities: [],
      showNavi: false,
      //图片权限显示选择
      checkAll_hot: false,
      checkedCities_hot: [],
      cities_hot: cityOptions,
      rules: {
        module_title: [{ required: true, message: "请输入模块名称" }],
        background: [{ required: true, message: "请选择模块背景图" }]
      },
      activity_id: "",//存在活动id则为修改
      visible: false,
      templateIndex: 0,
      requIndex: 0,
      i: 1,
      type_am: 0,
      numRows: 0, //搜索输入值
      ShowHidden_del_but: false,
      isShowForm: 0, //新增模块按钮 0基础表单设置 1新增模块 2导航模板 3图片热区模板 4商品模板 5子热区模块 6轮播模块 7轮播子图片上传修改处理模块 8倒计时模块 9倒计时list 10弹幕 11弹幕list 12侧边栏导航 13侧边栏导航list 14tab商品 15 tab商品list 16横向滑动商品模块 17优惠券模块 18优惠券list 19百万爆品
      isShowFormNavs: "0",//导航
      operatorList: [],
      listType: [],
      goodsType: [],
      act_type: [],
      index: 0,
      fileList: [],
      //轮播图模块
      carousel_map: {
        module_type: 3, //模块类型: 1 热区; 2 商品; 3 轮播;
        module_title: "", //模块名称
        back_height:"",
        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
        picture_list: [],//轮播列表
        fe_module_id: "fe_module_id" + Date.now(),
        show_mode: [
          "show_with_vip",
          "show_with_not_vip",
        ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
      },
      carouse_url:{
          img_url:'',
          url_xcx:'',
          url_h5:''
      },
      carouselMapRules:{
          module_title: [
            { required: true, message: "请输入模块名称", trigger: "blur" }
          ],
      },
      carouselMap2Rules:{
        img_url: [
            { required: true, message: "请添加图片", trigger: "blur" }
          ],
      },
      //热区模块数据
      form: {
        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
        module_type: 1, //模块类型: 1 热区; 2 商品;3 轮播;
        module_title: "", //模块名称
        background: "", //event_type
        back_height: "",
        show_mode: [
          "show_with_vip",
          "show_with_not_vip",
        ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
        areas: [],
        fe_module_id: "fe_module_id" + Date.now()
      },
      //热区数据
      form_data: {
        select_box_height: "60", //[热区模块专属]热区选择区域高度
        select_box_width: "90", //[热区模块专属]热区选择区域宽度
        select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
        select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
        event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
        link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
        goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
        act_type: "seckill", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
        act_id: "", //活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
        goods_id: "", //商品SKU_ID goods_id
        appends: "", //附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
        url_h5: "",
        url_xcx: "",
        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
      },
      // commodityInfo: { ...commodityInfo },
      // 商品数据
      commodityInfo: {
        more_text_font:"", // 查看更多文案颜色 3.1期增加
        more_bg_color:"", // 查看更多背景颜色 3.1期增加
        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
        is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
        module_type: 2,
        subscript_pic:'',//爆款商品角标
        head_img:"",//头图
        back_height:"",
        module_title: "",
        background: "",
        background_color: "",
        template: "", //模板类型
        price_text: "", //活动价名称
        act_type: "", //活动类型
        act_id: "", //活动id
        url_h5_format: "", //活动详情h5链接格式
        url_xcx_format: "", //活动详情小程序链接格式
        max_rows: "", //显示多少个商品
        more_url_xcx: "", //[商品模块专属]更多内容 - 小程序链接
        more_url_h5: "", //[商品模块专属]更多内容 - h5链接
        position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
        subscript: "", // 角标 11月需求增加
        price_bg_color:"#DC2992",//价格颜色
        logo: "", // logo 11月需求增加
        show_logo: false, // 是否显示logo 11月需求增加
        show_mode: [
          "show_with_vip",
          "show_with_not_vip",
        ],
        fe_module_id: "fe_module_id" + Date.now(),
        goods: []
      },
      commodityRules: {
        price_text: [
          { required: true, message: "请输入价格文字", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        module_title: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],
        template: [
          { required: true, message: "请选择展示列数", trigger: "change" }
        ]
      },
      //倒计时 模块
      countdown_commod:0,//0是商品模块1是倒计时模块2tab商品模块
      isShowCountdown_commod:0,//倒计时模块展示
      isShowTAB_commod:0,//tab商品模块展示
      countdownModule:{
        module_type:5,
        module_title:"倒计时模块",
        djs_bg_color_def:"#FFFFFF",// 倒计时默认背景颜色
        background_sel_color:"#FE0F40",// title选中背景颜色
        font_def_color:"#333333",// title默认字体颜色
        font_sel_color:"#FFFFFF",// title选中字体颜色
        time_des_color:"#333333", // 时间描述文字颜色
        hour_color:"#FFFFFF", // 时,分字体颜色
        hour_bg_color:"#474245", // 时,分背景颜色
        has_color:"#FFFFFF", // 已开始秒字体颜色
        has_bg_color:"#FF124D", // 已开始秒背景颜色
        has_not_color:"#FFFFFF", // 未开始秒字体颜色
        has_not_bg_color:"#49D37C", // 未开始秒背景颜色
        fe_module_id: "fe_module_id" + Date.now(),
        time_list:[],
        show_mode: [
              "show_with_vip",
              "show_with_not_vip",
        ]
      },
      countdownRules:{
        module_title: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],
      },
      countdownChild: { ...countdown_Child},
      countdown_rules:{
        begin_ts:[
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        end_ts:[
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
      },
      tab_active:1,
      form_navsChild: {
        title: "", //导航名称
        jmp: "", //导航跳转标识
        icon: "",//icon
      },
      //导航模块
      temp_extends: {
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            module_type:4,
            module_title: "导航模块",
            fe_module_id: "fe_module_id" + Date.now(),
            background_color: "", //背景颜色
            background_sel_color: "", //选中背景颜色
            font_def_color: "", //默认字体颜色
            font_sel_color: "", //选中字体颜色
            navs: [],
            show_mode: [
              "show_with_vip",
              "show_with_not_vip",
            ]
      },
      //弹幕轮播模块
      barrageModule:{
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
            module_type: 6,
            module_title: "",
            background: "", //背景图片
            top: 85, // 上边距 px
            left: 260, // 左边距 px
            text_align:"right",//left 左对齐 right 右对齐 center居中
            list:[],
            fe_module_id: "fe_module_id" + Date.now(),
            show_mode: [
              "show_with_vip",
              "show_with_not_vip",
            ],
      },
      barrageRules:{
        module_title: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],
        background: [
            { required: true, message: "请添加图片", trigger: "blur" }
        ],
      },
      barrageList:{
        type:"text", // 类型: img 图片; text 文字;
        type_value:"", // 类型值,type为img该值为图片地址,type为text,类型值为文本
        url_h5: "", // h5链接
        url_xcx:"", // 小程序链接
        font_def_color:"", // 文字默认颜色
        font_sel_color:"", // 文字选中颜色
        background_color:"", // 背景颜色
      },
      barrageListRules:{
          type_value: [
            { required: true, message: "请填写内容", trigger: "blur" }
          ],
          url_h5: [
            { required: true, message: "请输入h5链接", trigger: "blur" }
          ],
          url_xcx: [
            { required: true, message: "请输入小程序链接", trigger: "blur" }
          ],
      },
      // 侧边栏导航
      sideNavs:{
        text:"", // 导航名称
        url_h5: "", // h5链接
        url_xcx:"", // 小程序链接
      },
      //tab商品模块
      TABcommodModule:{
        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
        module_type:7,
        module_title:"TAB商品模块",
        bg_color_def:"#FFFFFF",// 默认背景颜色
        bg_sel_color:"#FE0F40",// title选中背景颜色
        font_def_color:"#333333",// title默认字体颜色
        font_sel_color:"#FFFFFF",// title选中字体颜色
        fe_module_id: "fe_module_id" + Date.now(),
        list:[],
        show_mode: [
              "show_with_vip",
              "show_with_not_vip",
        ]
      },
      TABcommodRules:{
        module_title: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],
      },
      TABcommodChild: { ...TABcommod_Child},
      //优惠券模块
      couponModule:{
          module_type:9,
          module_title:"优惠券模块",
          background:"",
          bg_color:"",//背景颜色
          before_img:"",
          after_img:"",
          collection_method: "onekey", // 领取方式: 一键领取 onekey; 单张领取 single;
          collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
          list: [],
          fe_module_id: "fe_module_id" + Date.now(),
          show_mode: [
              "show_with_vip",
              "show_with_not_vip",
          ],
          show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
          show_end_ts: '' // 结束显示时间 每个模块都增加 3.1期增加
      },
      //优惠券list
      couponList:{
          coupon_code: "", // 优惠券码
          type: "discount", // 优惠券类型: 满减 discount;
          price: "", // 优惠券金额
          name: "", // 优惠券名称
          desc: "", // 优惠券描述
          full: "" // 门槛
      },
      //爆品推荐
      recommend: {
        module_type: 10, //模块类型: 1 热区; 2 商品; 3 轮播;
        module_title: "爆品推荐模块", //模块名称
        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
        show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
        disable_tips: "活动未开始", // 置灰文案; 3.1期增加
        bg_color_def:'#ffffff',//按钮的默认背景色
        bg_sel_color:'#fdf3ad',//按钮的选中背景色
        font_def_color:'#000000',//字体默认颜色
        font_sel_color:'#000000',//字体选中颜色
        picture_list: [],//轮播列表
        fe_module_id: "fe_module_id" + Date.now(),
        show_mode: [
          "show_with_vip",
          "show_with_not_vip",
        ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
      },
      recommend_url:{
          img_url:'',
          url_xcx:'',
          url_h5:'',
          begin_ts: "", // 开始时间
          end_ts: "" // 结束时间
      },
      recommendL_rules:{
        begin_ts:[
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        end_ts:[
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        url_h5:[
          { required: true, message: '请填写H5链接', trigger: 'blur' }
        ],
        url_xcx:[
          { required: true, message: '请填写H5链接', trigger: 'blur' }
        ]
      },
      //标题分类模块
      titleClass:{
        module_type: 12,
        module_title:"标题分类模块",
        icon: "", // 图标
        title: "", // 标题
        bg_color: "", // 背景颜色
        fe_module_id:"fe_module_id" + Date.now(),// 配合前端的冗余字段
        show_mode:[
          "show_with_vip",
          "show_with_not_vip",
        ],
        show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
        show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
      },
      // 提交数据
      template: {
        activity_id: "", //活动ID,如果没有该参数则为创建,如果存在则为更新操作
        title: "", //活动名称--页面标题
        background_color: "#FFFFFF", //背景颜色
        background: "", //背景图片
        show_top_btn:true,
        show_bottom_ad:true,
        remark: "", //备注
        share_pic: "", //分享缩略图
        share_desc: "", //分享文案
        begin_ts:"",//活动开始时间
        show_more_font_color:'',//查看更多颜色
        show_more_bg_color:'',//查看更多背景颜色
        m: [],

        side_navs_show:true,//侧边栏是否展示
        side_navs_bg_color: "#FE0F40", // 侧边导航主题颜色
        side_navs_gradient_color: "#FF8EA5", // 侧边导航渐变颜色
        side_gradient_color:"#FF3681",//侧边文字渐变颜色
        side_navs_color: "#FFFFFF", // 侧边导航字体颜色
        side_navs_text: "会场导航", // 侧边导航大按钮文案
        side_navs:[],
      }
    };
  },
  created() {
    eventPageConfigs().then(res => {
      this.operatorList = res.data.event_type;
      this.listType = res.data.link_type;
      this.goodsType = res.data.goods_type;
      this.act_type = res.data.activity_type;
    });
    if(this.$route.query.id){
      this.template.activity_id = this.$route.query.id;
      if (this.template.activity_id) {
        this.actSearch();
      }
    }
    
    if (this.form.module_title == "") this.ShowHidden_del_but = false;
    else this.ShowHidden_del_but = true;
  },
  computed: {
    //过滤导航模块
    filterM(){
      return this.template.m.filter(item => item.module_type != 4)//过滤导航模块
    }
  },
  components: {
    draggable,
    commodityTool
    // carouselMap
  },
  methods: {
    //编辑商品列表--活动搜索
    seekCommodity(i) {
      switch(i){
        case 0:
          let obj = {
            act_type: this.commodityInfo.act_type,
            act_id: this.commodityInfo.act_id,
            max_rows: this.commodityInfo.max_rows
          };
          activityGoods(obj).then(res => {
            if (res.errno === 1) {
              this.$notify({
                title: "错误!",
                message: "请填写正确数字",
                type: "warning"
              });
              return;
            }else{
              this.commodityInfo.more_url_h5 = res.data.url_h5;
              this.commodityInfo.more_url_xcx = res.data.url_xcx;
              this.commodityInfo.goods = res.data.list;
              this.commodityInfo.url_xcx_format = res.data.url_xcx_format;
              this.commodityInfo.url_h5_format = res.data.url_h5_format;
            }
          });
          break;
        case 1:
          let obj1 = {
            act_type: this.countdownChild.act_type,
            act_id: this.countdownChild.act_id,
            max_rows: this.countdownChild.max_rows
          };
          activityGoods(obj1).then(res => {
            if (res.errno === 1) {
              this.$notify({
                title: "错误!",
                message: "请填写正确数字",
                type: "warning"
              });
              return;
            }else{
              this.countdownChild.more_url_h5 = res.data.url_h5;
              this.countdownChild.more_url_xcx = res.data.url_xcx;
              this.countdownChild.goods = res.data.list;
              this.countdownChild.url_xcx_format = res.data.url_xcx_format;
              this.countdownChild.url_h5_format = res.data.url_h5_format;
            }
          });
          break;
        case 2:
          let obj2 = {
            act_type: this.TABcommodChild.act_type,
            act_id: this.TABcommodChild.act_id,
            max_rows: this.TABcommodChild.max_rows
          };
          activityGoods(obj2).then(res => {
            if (res.errno === 1) {
              this.$notify({
                title: "错误!",
                message: "请填写正确数字",
                type: "warning"
              });
              return;
            }else{
              this.TABcommodChild.more_url_h5 = res.data.url_h5;
              this.TABcommodChild.more_url_xcx = res.data.url_xcx;
              this.TABcommodChild.goods = res.data.list;
              this.TABcommodChild.url_xcx_format = res.data.url_xcx_format;
              this.TABcommodChild.url_h5_format = res.data.url_h5_format;
            }
          });
      }
    },
    //编辑商品列表 0商品模块 1倒计时模块
    commodityList(i) {
      this.countdown_commod = i
      switch(i){
        case 0:
          if (this.commodityInfo.template == "") {
              this.$notify({
                title: "显示列数!",
                message: "请选择列数",
                type: "warning"
              });
              return;
          } else {
            this.dialogVisible = true;
            switch (this.commodityInfo.template) {
              case "rows_1":
                this.numRows = this.commodityInfo.max_rows / 1
                break;
              case "rows_2":
                this.numRows = this.commodityInfo.max_rows / 2
                break;
              case "rows_3":
                this.numRows = this.commodityInfo.max_rows / 3            
                break;
            }
          }
          break;
        case 1:
          if (this.countdownChild.template == "") {
            this.$notify({
              title: "显示列数!",
              message: "请选择列数",
              type: "warning"
            });
            return;
          } else {
            this.dialogVisible = true;
            switch (this.countdownChild.template) {
              case "rows_1":
                this.numRows = this.countdownChild.max_rows / 1
                break;
              case "rows_2":
                this.numRows = this.countdownChild.max_rows / 2
                break;
              case "rows_3":
                this.numRows = this.countdownChild.max_rows / 3            
                break;
            }
          }
          break;
        case 2:
          if (this.TABcommodChild.template == "") {
            this.$notify({
              title: "显示列数!",
              message: "请选择列数",
              type: "warning"
            });
            return;
          } else {
            this.dialogVisible = true;
            switch (this.TABcommodChild.template) {
              case "rows_1":
                this.numRows = this.TABcommodChild.max_rows / 1
                break;
              case "rows_2":
                this.numRows = this.TABcommodChild.max_rows / 2
                break;
              case "rows_3":
                this.numRows = this.TABcommodChild.max_rows / 3            
                break;
            }
          }
          break;
      }
    },
    // 商品弹窗添加数组触发
    onChangeRows(num){
      switch(this.countdown_commod){
        case 0:
          switch (this.commodityInfo.template) {
            case "rows_1":
              if(num > 10) return this.$message.error('最多只能展示8排');
              else return this.commodityInfo.max_rows = num * 1;
              break;
            case "rows_2":
              if(num > 6) return this.$message.error('最多只能展示6排');
              else return this.commodityInfo.max_rows = num * 2;
              break;
            case "rows_3":
              if(num > 5) return this.$message.error('最多只能展示5排');
              else return this.commodityInfo.max_rows = num * 3;
              break;
          }
          break;
        case 1:
          switch (this.countdownChild.template) {
            case "rows_1":
              if(num > 8) return this.$message.error('最多只能展示8排');
              else return this.countdownChild.max_rows = num * 1;
              break;
            case "rows_2":
              if(num > 6) return this.$message.error('最多只能展示6排');
              else return this.countdownChild.max_rows = num * 2;
              break;
            case "rows_3":
              if(num > 5) return this.$message.error('最多只能展示5排');
              else return this.countdownChild.max_rows = num * 3;
              break;
          }
          break;
        case 2:
          switch (this.TABcommodChild.template) {
            case "rows_1":
              if(num > 8) return this.$message.error('最多只能展示8排');
              else return this.TABcommodChild.max_rows = num * 1;
              break;
            case "rows_2":
              if(num > 6) return this.$message.error('最多只能展示6排');
              else return this.TABcommodChild.max_rows = num * 2;
              break;
            case "rows_3":
              if(num > 5) return this.$message.error('最多只能展示5排');
              else return this.TABcommodChild.max_rows = num * 3;
              break;
          }
      }
    },
    //倒计时
    TimeDown(id, starttime, endDateStr) {
      //结束时间
      let endDate = new Date(endDateStr); 
      //当前时间
      let nowDate = new Date(starttime);
      //相差的总秒数
      let totalSeconds = parseInt((endDate - nowDate) / 1000);
      //天数
      let days = Math.floor(totalSeconds / (60 * 60 * 24));
      //取模（余数）
      let modulo = totalSeconds % (60 * 60 * 24);
      //小时数
      let hours = Math.floor(modulo / (60 * 60));
      modulo = modulo % (60 * 60);
      //分钟
      let minutes = Math.floor(modulo / 60);
      //秒
      let seconds = modulo % 60;
      // //输出到页面
      document.getElementById(id).innerHTML = days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
      //延迟一秒执行自己
      // let that = this
      // setTimeout(function () {
      //     that.TimeDown(id, starttime, endDateStr);
      // }, 1000)
    },
    //确认创建/修改 商品模块
    onEstablish() {
      let valids = true;
      this.$refs.commodityInfo.validate(valid => {
        if (valid) {
          valids = false;
        } else {
          valids = true;
          return false;
        }
      });
      if (valids) return;
      if (!this.commodityInfo.goods.length) {
        this.$notify({
          title: "注意!",
          message: "还没有选择商品",
          type: "warning"
        });
        return;
      }
      if (this.redactVSadd === 1) {
        this.template.m[this.templateIndex] = { ...this.commodityInfo };
        this.$forceUpdate();
      } else {
        // this.template.m.push({ ...this.commodityInfo });
        this.template.m.splice(this.templateIndex+1,0,{ ...this.commodityInfo });
      }
      this.isShowForm = "";
      this.saveData('1');//当运营想要一个实时保存的功能时
    },
    //导航条新增
    addToNavs(tab, index) {
      let tab_actdata = this.template.m.filter(item => item.module_type != 4)//过滤导航模块
      if (this.temp_extends.navs.length + 1 > tab_actdata.length) {
        this.$notify({
          title: "当前只有" + tab_actdata.length + "个模块",
          message: "请先新增模块,不可选取导航模块!"
        });
      } else {
        if (index == undefined) {
            this.isINavsBut = 0;
            let obj = JSON.parse(JSON.stringify(this.form_navsChild))
            this.temp_extends.navs.push(obj);
          return;
        }
          let obj1 = JSON.parse(JSON.stringify(this.form_navsChild))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
          this.temp_extends.navs.splice(index + 1, 0, obj1);
        // }
      }
    },
    //导航条模块新增/修改
    addToNavsModule(){
      if(this.redactVSadd === 1){
          this.isShowForm = ''//隐藏表单
          this.template.m[this.templateIndex] = { ...this.temp_extends}
          this.saveData('1');//当运营想要一个实时保存的功能时
          return;
      }else{
          this.isShowForm = ''
          let obj = JSON.parse(JSON.stringify(this.temp_extends))
          // this.template.m.push(obj)
          this.template.m.splice(this.templateIndex+1,0,obj)
          this.saveData('1');//当运营想要一个实时保存的功能时
          return;
      }
    },
    // 导航条删除
    deleteNavs(index) {
      this.$confirm("确认删除此模块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.temp_extends.navs.splice(index, 1);
          if (this.temp_extends.navs.length === 0) {
            this.isINavsBut = 1;
            this.isShowForm = ''
            this.template.m.splice(this.templateIndex, 1);
          }
        })
        .catch(() => {});
    },
    //确认创建/修改 倒计时模块
    onCountdownModule() {
        let valids = true;
        this.$refs.countdownModule.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
        });
        if (valids) return;
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.countdownModule };
        }else{
          // this.template.m.push(this.countdownModule);
          this.template.m.splice(this.templateIndex+1,0,this.countdownModule);
        }
        this.isShowForm = 9//打开倒计时子模板
    },
    //倒计时模块 list
    countdownBut(childModule){
      let valids = true;
      this.$refs.countdownChild.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
      });
      if (valids) return;
      if(this.redactVSadd === 1){
        this.redactVSadd = 2;
            this.countdownModule.time_list.splice(this.countdownModule.time_list.indexOf(this.countdownChild),1,childModule);
            this.TimeDown(childModule.end_ts)
            setTimeout(()=>{
              this.isShowForm = 9;
              this.countdownChild={ ...countdown_Child}
            })
      }else{
          this.countdownModule.time_list.push(childModule);
          this.TimeDown(childModule.end_ts)
          setTimeout(()=>{
              this.isShowForm = 9;
              this.countdownChild={ ...countdown_Child}              
          })
      }
      this.saveData('1');//当运营想要一个实时保存的功能时
    },
    // //倒计时时间差计算与转换
    TimeDown(endDateStr) {
        let date = new Date(endDateStr);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        this.countdownChild.countdown_time = Y+M+D+h+m+s;
        return Y+M+D+h+m+s;
    },
    // //倒计时模块list模块选中时间
    onCounBut(item, data, index) {
      this.countdownChild = item;
      this.countdownModule = data;
      this.redactVSadd = 1;
      this.isShowCountdown_commod = index
      this.isShowForm = 9; //倒计时表单
    },
    // //倒计时时间删除
    DelCountdown() {
        this.$confirm("确认删除此?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            switch (this.countdownModule.time_list.length){
              case 1:
                this.isShowForm = '';
                break;
            }
            this.countdownModule.time_list.splice(this.countdownModule.time_list.indexOf(this.countdownChild), 1);
            this.countdownChild={ ...countdown_Child}            
          }).catch(() => {});
    },
    //弹幕模块添加
    barrageListBut(data){
      let valids = true;
      this.$refs.barrageList.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
      });
      if (valids) return;
      if(this.redactVSadd === 1){
        this.redactVSadd = 2;
        let obj = JSON.parse(JSON.stringify(data));
        this.barrageModule.list.splice(this.index,1,obj);
      }else if(this.barrageModule.list.length > 5){
        this.$notify({
            title: "错误!",
            message: "最多可以添加6条弹幕!",
            type: "warning"
        });
        return;
      }else{
        let obj1 = JSON.parse(JSON.stringify(data));
        this.barrageModule.list.push(obj1);
        this.barrageList.type_value = "";
      };
      this.saveData('1');//当运营想要一个实时保存的功能时
    },
    // 基础页面添加背景图片
    handleBasicSuccess(res, file, index) {
      this.template.background = file.response.data.image_url;
    },
    // 基础页面--删除背景图片
    handleRemove(file, fileList) {},
    // 基础页面 -- 点击上传背景列表返回值
    handlePreview(file) {},
    // 超过数量提示信息
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    //删除图片列表提示信息
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //确认创建/修改 轮播模块
    onCarouselMap() {
        let valids = true;
        this.$refs.carousel_map.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
        });
        if (valids) return;
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.carousel_map };
        }else{
          // this.template.m.push({ ...this.carousel_map });
          this.template.m.splice(this.templateIndex+1,0,{ ...this.carousel_map });
        }
        this.isShowForm = 7
    },
    //创建/修改 轮播图片
    mapBut(carouse_url){
      let valids = true;
        this.$refs.carouse_url.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
        });
        if (valids) return;
      if(this.redactVSadd === 1){
        this.redactVSadd = 2;
        let obj = JSON.parse(JSON.stringify(carouse_url));
        this.carousel_map.picture_list.splice(this.index,1,obj);
      }else{
        let obj = JSON.parse(JSON.stringify(this.carouse_url));
        this.carousel_map.picture_list.push(obj); //把选中热区表单 插入当前模块
      }
      this.saveData('1');//当运营想要一个实时保存的功能时
      // 清空表单
      this.carouse_url = {
          img_url:'',
          url_xcx:'',
          url_h5:''
      }
    },
    //轮播模块选中图片
    hotMap(map, data, index) {
      // this.carouse_url = JSON.parse(JSON.stringify(map));
      this.carouse_url = map;
      this.carousel_map = data;
      this.redactVSadd = 1;
      this.index = index;
      this.isShowForm = 7; //热区表单
    },
    //轮播图片删除
    DelCarouselMap() {
        this.$confirm("确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            switch (this.carousel_map.picture_list.length){
              case 1:
                this.isShowForm = '';
                break;
            }
            this.carousel_map.picture_list.splice(this.carousel_map.picture_list.indexOf(this.carouse_url), 1);
            this.carouse_url = {
              img_url:'',
              url_xcx:'',
              url_h5:''
            }
          }).catch(() => {});
    },
    //弹幕删除
    DelBarrageList() {
        this.$confirm("确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            this.barrageModule.list.splice(this.barrageModule.list.indexOf(this.barrageList), 1);
            if(this.barrageModule.list.length === 0){
                this.barrageList = {
                  type:"img", // 类型: img 图片; text 文字;
                  type_value:"", // 类型值,type为img该值为图片地址,type为text,类型值为文本
                  url_h5: "", // h5链接
                  url_xcx:"", // 小程序链接
                  font_def_color:"", // 文字默认颜色
                  font_sel_color:"", // 文字选中颜色
                  background_color:"", // 背景颜色
                }
            }
          }).catch(() => {});
    },
    // 轮播模块图片上传
    handleMapSuccess(res, file, index) {
      this.carouse_url.img_url = res.data.image_url;
    },
    // 爆品推荐模块图片上传
    handleRecSuccess(res, file, index) {
      this.recommend_url.img_url = res.data.image_url;
    },
    // 一键领取 前 模块图片上传
    handleBeforeSuccess(res, file, index) {
      this.couponModule.before_img = res.data.image_url;
    },
    // 一键领取 后 模块图片上传
    handleAfterSuccess(res, file, index) {
      this.couponModule.after_img = res.data.image_url;
    },
    carImg(data){
      // 获取图片高度
      data.back_height = this.$refs.img_height[0].naturalHeight / this.$refs.img_height[0].naturalWidth
    },
    //基础模块--分享图片上传
    handlePicSuccess(res, file, index) {
      this.template.share_pic = res.data.image_url;
    },
    //商品模块--头部图片上传
    handleGoodsSuccess(res, file, index) {
      this.commodityInfo.head_img = res.data.image_url;
    },
    //商品模块--商品角标上传
    handleSubscriptSuccess(res, file, index) {
      this.commodityInfo.subscript_pic = res.data.image_url;
    },
    //商品模块logo图片上传
    handleLogoSuccess(res, file, index) {
      this.commodityInfo.logo = res.data.image_url;
    },
    //倒计时模块--商品角标上传
    handleCountSuccess(res, file, index) {
      this.countdownChild.subscript_pic = res.data.image_url;
    },
    //倒计时模块商品logo上传
    handleDjsLogoSuccess(res, file, index) {
      this.countdownChild.logo = res.data.image_url;
    },
    //TAB商品模块--商品角标上传
    handleTABSuccess(res, file, index) {
      this.TABcommodChild.subscript_pic = res.data.image_url;
    },
    // TAB商品logo图片上传
    handleTabLogoSuccess(res, file, index) {
      this.TABcommodChild.logo = res.data.image_url;
    },
    //商品模块--头部图片上传完成
    // comTopImg(data) {
    //   // 获取图片高度
    //   data.back_height = this.$refs.img_height[0].offsetHeight
    // },
    //热区模块--图片上传
    handleAvatarSuccess(res, file, index) {
      this.form.background = res.data.image_url;
    },
    //弹幕轮播模块 图片上传
    handleBarrageSuccess(res, file, index){
      this.barrageModule.background = res.data.image_url;
    },
    // 弹幕轮播模块 - list
    handleBarrageListSuccess(res, file, index) {
      this.barrageList.type_value = res.data.image_url;
    },
    //动态样式
    sizeFun(data) {
      return `width: ${data.width} ; height: ${data.height} ;top: ${data.top};left: ${data.left} `;
    },
    colorControl(index) {
      if (this.tab_active === index) {
                return `background-color: ${this.temp_extends.background_sel_color};color: ${this.temp_extends.font_sel_color};font-weight:bold;`
            } else {
                return "";
      }
    },
    colorTABBut(index) {
      if (this.isShowTAB_commod === index) {
                return `background-color: ${this.TABcommodModule.bg_sel_color};color: ${this.TABcommodModule.font_sel_color};font-weight:bold;`
            } else {
                return "";
      }
    },
    colorCounBut(index,item) {
      if (this.isShowCountdown_commod === index) {
                return `background-color: ${this.countdownModule.background_sel_color};color: ${this.countdownModule.font_sel_color};font-weight:bold;`
            } else {
                return "";
      }
    },
    // 弹幕样式
    colorBarrage(datam,index){
      if(this.index === index){
        return `background-color:${datam.background_color};color:${datam.font_sel_color};  overflow: auto;margin:10px 0 0 0;`
      }
      return `background-color:${datam.background_color};color:${datam.font_def_color};  overflow: auto;margin:10px 0 0 0;`
    },
    // 标题分类模块背景颜色
    titleClassStyle(color){
      return `background-color: ${color.bg_color};`;
    },
    //弹幕容器
    colorBarrageDrag(data,index){
        return `width: 300px;height: 135px;overflow-y: auto;position: absolute;top: ${data.top}px;left: ${data.left}px;border:1px dashed #000;cursor: pointer;text-align:${data.text_align};`          
    },
    //弹幕鼠标按下拖拽
    drag(e){
        let that = this //重定义
        var oDiv = e.path[0];
        var disX = e.clientX - oDiv.offsetLeft;//+ 20
        var disY = e.clientY - oDiv.offsetTop;//+ 130
        document.onmousemove = function(e){
            e.preventDefault();
            var l = e.clientX - disX;
            var t = e.clientY - disY;
            oDiv.style.left = l + "px"
            oDiv.style.top = t + "px"
            that.barrageModule.top = t + "px"
            that.barrageModule.left = l + "px"
        }
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        }
    },
    //选中当前弹幕
    clickBarrage(datam, data, index) {
      this.barrageList = datam;
      this.barrageModule = data;
      this.type_am = 1;
      this.index = index;
      this.redactVSadd = 1;//1修改状态,2添加
      this.isShowForm = 11; //弹幕表单
    },
    navsHover(index) {
      this.tab_active = index;
    },
    onBarrageModule(data) {
      this.isShowForm = 11;
      this.$refs.barrageModule.validate(valid => {
        if (valid) {
          if (this.redactVSadd === 2) {
            this.barrageModule.fe_module_id = "fe_module_id" + Date.now();
            // this.template.m.push(this.barrageModule); //插入模块表单
            this.template.m.splice(this.templateIndex+1,0,this.barrageModule); //插入模块表单
          } else {
            //插入模块表单
            this.template.m.splice(this.templateIndex, 1, this.barrageModule);
          }
          this.redactVSadd = 2;
        } else {
          this.isShowForm = 10
          return false;
        }
      });
    },
    // 热区图片加载完成
    initSet(data) {
      // 获取图片高度
      data.back_height = this.$refs.img_height[0].offsetHeight
      this.initData(data);
    },
    //新建热区模板
    moban(form) {
      this.isShowForm = "";
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.redactVSadd === 2) {
            if (this.form.module_title == "") this.ShowHidden_del_but = false;
            else this.ShowHidden_del_but = true;
            this.form.fe_module_id = "fe_module_id" + Date.now();
            this.template.m.splice(this.templateIndex+1,0,JSON.parse(JSON.stringify(this.form))); //新增插入模块表单
          } else {
            //修改
            if (this.form.module_title == "") this.ShowHidden_del_but = false;
            else this.ShowHidden_del_but = true;
            this.template.m.splice(this.templateIndex, 1, this.form);
          }
          this.redactVSadd = 2;
        } else {
          return false;
        }
      });
    },
    //立即创建热区表单
    requBut(form_data, index) {
      this.$refs.form_data.validate(valid => {
        if (valid) {
          if (!this.form.hotspots.get()) return;
          if (this.type_am === 0) {
            this.form_data.container_height = "10";
            this.form_data.container_width = "10";
            this.form_data.select_box_height = this.form.hotspots.get().selectBoxHeight;
            this.form_data.select_box_width = this.form.hotspots.get().selectBoxWidth;
            this.form_data.select_box_left = this.form.hotspots.get().selectBoxLeft;
            this.form_data.select_box_top = this.form.hotspots.get().selectBoxTop;
            let obj = JSON.parse(JSON.stringify(this.form_data));
            this.form.areas.push(obj); //把选中热区表单 插入当前模块
          } else {
            this.form_data.container_height = "10";
            this.form_data.container_width = "10";
            this.form_data.select_box_height = this.form.hotspots.get().selectBoxHeight;
            this.form_data.select_box_width = this.form.hotspots.get().selectBoxWidth;
            this.form_data.select_box_left = this.form.hotspots.get().selectBoxLeft;
            this.form_data.select_box_top = this.form.hotspots.get().selectBoxTop;
            this.type_am = 0;
            let obj = JSON.parse(JSON.stringify(form_data));
            this.form.areas.splice(
              this.form.areas.indexOf(this.form_data),
              1,
              obj
            );
          }
          this.form.hotspots._removeDiv();
          this.form_data = {
            select_box_height: "60", //[热区模块专属]热区选择区域高度
            select_box_width: "90", //[热区模块专属]热区选择区域宽度
            select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
            select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
            event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
            link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
            goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
            act_type: "seckill", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
            act_id: "", //活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
            goods_id: "", //商品SKU_ID goods_id
            appends: "", //附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
            url_h5: "",
            url_xcx: "",
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
          };
        this.saveData('1');//当运营想要一个实时保存的功能时
        } else {
          return false;
        }
      });
    },
    // 热区div
    HotZone_style(form_data) {
      //将画完的热区坐标辅助给div
      return `width: ${form_data.select_box_width}px ; height: ${form_data.select_box_height}px ;top: ${form_data.select_box_top}px;left: ${form_data.select_box_left}px;`;
    },
    addTemplate() {
      //新建模块
      this.redactVSadd = 2;

      //尽量不清除from表单 其他数据也在里面
      this.form_data = {
        select_box_height: "60", //[热区模块专属]热区选择区域高度
        select_box_width: "90", //[热区模块专属]热区选择区域宽度
        select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
        select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
        event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
        link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
        goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
        act_type: "seckill", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
        act_id: "", //活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
        goods_id: "", //商品SKU_ID goods_id
        appends: "", //附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
        url_h5: "",
        url_xcx: ""
      };
      if (this.form.module_title == "") this.ShowHidden_del_but = false;
      else this.ShowHidden_del_but = true;
    },
    //hotItem 选中热区执行函数
    //form_data 当前模块的热区  data 当前模块的数据 index当前模块顺序
    hotItem(form_data, data, index) {
      this.form_data = JSON.parse(JSON.stringify(form_data));
      this.form_data = form_data;
      this.form = data;
      this.type_am = 1;
      this.index = index;
      this.isShowForm = 5; //热区表单
      setTimeout(() => {
        data.hotspots.set({
          // 相对容器宽度
          containerHeight: document.getElementsByClassName(data.fe_module_id)[0]
            .offsetHeight, //获取模块的高度
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
        });
      });
    },
    //删除热区
    DeleteRequ() {
      //删除当前选中热区
      this.$confirm("确认删除此热区?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //功能: 删除当前模块上的最后一个热区后工作区隐藏 问题:进页面画第一个热区时会处发导致画第二次才会出现工作区===待解决
          switch (this.form.areas.length) {
            case 0:
              this.isShowForm = "";
              break;
          }
          this.form.areas.splice(this.form.areas.indexOf(this.form_data), 1);
          this.form.hotspots._removeDiv();
          this.form_data = {
            select_box_height: "60", //[热区模块专属]热区选择区域高度
            select_box_width: "90", //[热区模块专属]热区选择区域宽度
            select_box_left: "400", //[热区模块专属]热区选择区域距离所在图片左间距
            select_box_top: "300", //热区模块专属]热区选择区域距离所在图片上间距
            event_type: "link", //[热区模块专属]热区事件类型: 链接 link; 方法 function
            link_type: "1", //热区模块专属]链接类型: 1 商品; 2 3 4 ... 待补充
            goods_type: "act_goods", //[热区模块专属]商品类型: 活动商品 act_goods; 普通商品 goods
            act_type: "seckill", //活动类型: 限时秒杀 miaosha; 满减活动 manjian; 活动馆 huodongguan;
            act_id: "", //活动ID act_id(该活动ID指的是秒杀、满减等活动的ID)
            goods_id: "", //商品SKU_ID goods_id
            appends: "", //附加数据 appends (目前只在链接类型为固定前缀类型的时候会用到)
            url_h5: "",
            url_xcx: "",
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
          };
        })
        .catch(() => {});
    },
    // 建立热区
    initData(form) {
      let that = this; //this 重定义
      function createRect(parent) {
        //创建div
        const rect = document.createElement("div");
        rect.style.cssText =
          "position: absolute; box-sizing: border-box; border: 2px solid red; left: auto; top: auto; right: auto; bottom: auto;background-color: rgba(0, 0, 0, .3);";
        const mouseDownAndMove = new MouseDownAndMove(rect);
        mouseDownAndMove.before("down", e => e.target === rect);
        mouseDownAndMove.on("move", (e, start) => {
          rect.style.transform = `translate3d(${e.x - start.x}px, ${e.y -
            start.y}px, 0)`;
        });
        mouseDownAndMove.on("up", (e, start) => {
          rect.style.transform = "none";
          rect.style.top = rect.offsetTop + e.y - start.y + "px";
          rect.style.left = rect.offsetLeft + e.x - start.x + "px";
          rect.style.bottom = "auto";
          rect.style.right = "auto";
        });
        parent.appendChild(rect);
        return rect;
      }
      function createRound(parent, top, left) {
        const size = "8px";
        const round = document.createElement("div");
        round.style.cssText = `position: absolute; width: ${size}; height: ${size}; border: 1px solid red; border-radius: ${size};background-color: white;`;
        round.style.top = typeof top === "string" ? top : top + "px";
        round.style.left = typeof left === "string" ? left : left + "px";
        parent.appendChild(round);
        return round;
      }
      class MouseDownAndMove {
        constructor(node) {
          this._onHooks = {};
          this._beforeHooks = {};
          this.ele = node;
          this.mousedown = e => {
            if (e.button === 0 && this._runHook("before", "down", e)) {
              this._isDown = true;
              this._start = {
                x: e.x,
                y: e.y,
                offsetX: e.offsetX,
                offsetY: e.offsetY
              };
              this._runHook("on", "down", e);
            }
          };
          this.mouseup = e => {
            if (e.button === 0 && this._isDown) {
              this._isDown = false;
              this._runHook("on", "up", e);
            }
          };
          this.mousemove = e => {
            if (this._isDown) {
              e.preventDefault();
              this._runHook("on", "move", e);
            }
          };
          node.addEventListener("mousedown", this.mousedown);
          node.addEventListener("mouseup", this.mouseup);
          node.addEventListener("mousemove", this.mousemove);
        }

        _stop() {
          this.ele.removeEventListener("mousedown", this.mousedown, false);
          this.ele.removeEventListener("mouseup", this.mouseup, false);
          this.ele.removeEventListener("mousemove", this.mousemove, false);
        }

        _runHook(type, name, e) {
          const hook =
            type === "on" ? this._onHooks[name] : this._beforeHooks[name];
          if (typeof hook === "function") return hook(e, this._start);
          return true;
        }

        on(name, handler) {
          this._onHooks[name] = handler;
        }

        before(name, handler) {
          this._beforeHooks[name] = handler;
        }
      }

      function createRounds(parent) {
        const size = 5;
        const positions = [
          {
            top: -size,
            left: [
              -size,
              `-webkit-calc(50% - ${size}px)`,
              `-webkit-calc(100% - ${size}px)`
            ]
          },
          {
            top: `-webkit-calc(50% - ${size}px)`,
            left: [-size, `-webkit-calc(100% - ${size}px)`]
          },
          {
            top: `-webkit-calc(100% - ${size}px)`,
            left: [
              -size,
              `-webkit-calc(50% - ${size}px)`,
              `-webkit-calc(100% - ${size}px)`
            ]
          }
        ];
        let code = 0;
        const cursors = [
          "nwse",
          "ns",
          "nesw",
          "ew",
          "ew",
          "nesw",
          "ns",
          "nwse"
        ];
        for (let { top, left } of positions) {
          for (let _left of left) {
            const round = createRound(parent, top, _left);
            round._roundCode = code++;
            round.style.cursor = cursors[round._roundCode] + "-resize";
          }
        }
      }

      class Hotspots {
        constructor(container) {
          //根据拖拽 画选区
          this._container = container;
          this._containerRect = this._container.getBoundingClientRect();
          this.mouseDownAndMove = new MouseDownAndMove(this._container);

          this.mouseDownAndMove.before(
            "down",
            e =>
              e.target.hasOwnProperty("_roundCode") || e.target !== this._rect
          );
          this.mouseDownAndMove.on("down", (e, start) => {
            this._target = e.target;
            if (e.target.hasOwnProperty("_roundCode")) {
              const roundCode = e.target._roundCode;
              this._rect.style.cursor = e.target.style.cursor;
              const rect = this._getRect();
              const isTop = roundCode > 2;
              const isLeft = [2, 4, 7].indexOf(roundCode) !== -1;
              this._start = {
                offsetX: isLeft ? rect.left + 2 : rect.right,
                offsetY: isTop ? rect.top + 2 : rect.bottom
              };
              const x = e.x - e.offsetX + 8;
              const y = e.y - e.offsetY - 2;
              this._start.x = isLeft ? x - rect.width : x + rect.width;
              this._start.y = isTop ? y - rect.height : y + rect.height;
            } else if (e.target !== this._rect) {
              this._start = start;
              if (this._rect) {
                this._container.removeChild(this._rect);
                this._rect = null;
              }
            }
          });
          this.mouseDownAndMove.on("up", () => {
            //热区  鼠标抬起
            if (!this._rect) {
              return;
            }
            if (!this._target.hasOwnProperty("_roundCode")) {
              //选区事件处发
              that.type_am = 0;
              (that.isShowForm = 5), (that.form = form); // 当前表单 将当前表单赋值给form
              createRounds(this._rect);
            } else {
              this._rect.style.cursor = "move";
            }
          });
          this.mouseDownAndMove.on("move", e => {
            if (!this._rect) this._rect = createRect(this._container);
            const w = e.x - this._start.x;
            const h = e.y - this._start.y;
            this._setPosition("left", w);
            this._setPosition("top", h);
            const roundCode = this._target._roundCode;
            if ([1, 6].indexOf(roundCode) === -1)
              this._rect.style.width = Math.abs(w) + "px";
            if ([3, 4].indexOf(roundCode) === -1)
              this._rect.style.height = Math.abs(h) + "px";
          });
        }

        _stop() {
          const container = this._container;
          this._removeDiv();
          this.mouseDownAndMove._stop();
        }
        _removeDiv() {
          if (this._rect) {
            this._container.removeChild(this._rect);
            this._rect = null;
          }
        }

        _setPosition(type, size) {
          const attr = {
            left: ["right", "width", "offsetX"],
            top: ["bottom", "height", "offsetY"]
          }[type];
          const rect = this._rect;
          if (size < 0 && rect.style[attr[0]] === "auto") {
            rect.style[attr[0]] =
              this._containerRect[attr[1]] - this._start[attr[2]] + "px";
            rect.style[type] = "auto";
          } else if (size > 0 && rect.style[type] === "auto") {
            rect.style[attr[0]] = "auto";
            rect.style[type] = this._start[attr[2]] + "px";
          }
        }

        _getRect() {
          const rect = this._rect.getBoundingClientRect();
          return {
            left: this._rect.offsetLeft,
            right: this._rect.offsetLeft + rect.width,
            top: this._rect.offsetTop,
            bottom: this._rect.offsetTop + rect.height,
            width: rect.width,
            height: rect.height
          };
        }

        set(spots) {
          const container = this._container;
          if (this._rect) container.removeChild(this._rect);
          if (!spots) return (this._rect = null);
          this._rect = createRect(container);
          const { width, height } = this._containerRect;
          const {
            selectBoxLeft,
            selectBoxTop,
            selectBoxWidth,
            selectBoxHeight,
            containerWidth,
            containerHeight
          } = spots;
          const xRate = width / containerWidth;
          const yRate = height / containerHeight;
          this._rect.style.left = selectBoxLeft * xRate + "px";
          this._rect.style.top = selectBoxTop * yRate + "px";
          this._rect.style.width = selectBoxWidth * xRate + "px";
          this._rect.style.height = selectBoxHeight * yRate + "px";
          createRounds(this._rect);
        }

        get() {
          //处发get 将选区坐标赋值
          if (!this._rect) return;
          const {
            width: containerWidth,
            height: containerHeight
          } = this._containerRect;
          let { left, top, width, height } = this._getRect();
          return {
            containerWidth,
            containerHeight,
            selectBoxLeft: left,
            selectBoxTop: top,
            selectBoxWidth: width,
            selectBoxHeight: height //将selectBoxheight
          };
        }
      }

      // 鼠标事件创建div结束再显示选取容器
      // form为当前表单 form.hotspots就是在当前表单建立热区
      form.hotspots = new Hotspots(
        // 必须。选区容器 ids 热区需求参数 == 坐标
        that.$refs[form.fe_module_id][0]
        //document.getElementsByClassName(form.fe_module_id)[0]
      );
      // 设置一个选区
      // 如果传空 则清空当前选区
      // 选区set方法会自动将选区设置为相对于当前容器大小的

      // document.getElementById('btn').addEventListener('click', () => {
      //     // 获取当前选取的左上角，右下角【相对坐标】
      //     const area = form.hotspots.get()
      //     // 返回 当前容器宽度，当前容器高度，当前选区宽度，当前选区高度，当前选区offsetLeft，当前选区offsetTop
      //     // {containerWidth, containerHeight, selectBoxWidth, selectBoxHeight, selectBoxLeft, selectBoxTop}
      // })
    },
    //侧边栏导航
    //侧边栏创建模板
    sideBut(isAddVSDel){
      //isAddVSDel 0添加修改 1删除
      switch(isAddVSDel){
        case 0:
          if(this.redactVSadd === 1){
            this.redactVSadd = 2;
            this.$message({
              message: "修改信息成功!",
              type: "success"
            });
            this.isShowForm = 13
            return;
          }else{
            this.$message({
                  message: "创建模块成功!",
                  type: "success"
            });
            this.isINavsBut = 0;
            let obj = JSON.parse(JSON.stringify(this.sideNavs))
            this.template.side_navs.push(obj);
            this.isShowForm = 13            
            return;
          }
          break;
        case 1:
          this.$confirm("确认删除此模块?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.template.side_navs_show = true
            this.template.side_navs_bg_color = "#FE0F40"
            this.template.side_navs_gradient_color = "#FF8EA5"
            this.template.side_gradient_color = "#FF3681"
            this.template.side_navs_color = "#FFFFFF"
            this.template.side_navs_text = "会场导航"
            this.template.side_navs = []
          }).catch(() => {});
          break;
      }
    },
    //侧边栏list
    sideNavsBut(tab, index){
      if (index == undefined) {
          this.isINavsBut = 0;
          let obj = JSON.parse(JSON.stringify(this.sideNavs))
          this.template.side_navs.push(obj);
          return;
        }else if(this.template.side_navs.length > 11){
            this.$notify({
                title: "错误!",
                message: "最多可添加12个导航!",
                type: "warning"
            });
            return;
        }else{
          let obj1 = JSON.parse(JSON.stringify(this.sideNavs))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
          this.template.side_navs.splice(index + 1, 0, obj1);
          this.saveData('1');//当运营想要一个实时保存的功能时
          // 清空表单
          this.sideNavs = {
              text:'',
              url_xcx:'',
              url_h5:''
          }
        }
    },
    // 删除侧边栏
    deleteSideNavs(index){
      this.$confirm("确认删除此模块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.template.side_navs.splice(index, 1);
          if (this.template.side_navs.length === 0) {
            this.isShowForm = ''
            this.template.side_navs_show = true
            this.template.side_navs_bg_color = "#FE0F40"
            this.template.side_navs_gradient_color = "#FF8EA5"
            this.template.side_gradient_color = "#FF3681"
            this.template.side_navs_color = "#FFFFFF"
            this.template.side_navs_text = "会场导航"
            this.template.side_navs = []
          }
        })
        .catch(() => {});
    },
    //TAB商品模块 确认创建/修改
    onTABcommodModule() {
        let valids = true;
        this.$refs.TABcommodModule.validate(valid => {
          if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
        });
        if (valids) return;
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.TABcommodModule };
        }else{
          this.template.m.splice(this.templateIndex+1,0,this.TABcommodModule);
        }
        this.isShowForm = 15//打开倒计时子模板
    },
    //TAB商品模块 list
    TABcommodChildBut(TABcommodChild){
      if(this.redactVSadd === 1){
        this.TABcommodModule.list.splice(this.TABcommodModule.list.indexOf(this.TABcommodChild),1,TABcommodChild);
        setTimeout(()=>{
          this.isShowForm = 15;
          this.TABcommodChild= { ...TABcommod_Child}
        })
        this.redactVSadd = 2;
        this.saveData('1');//当运营想要一个实时保存的功能时
        return;
      }else if(this.TABcommodModule.list.length > 7){
          this.$notify({
              message: "tab商品模块最多只能添加8个",
              offset: 100,
              type: "warning"
            });
            return;
      }else{
          this.TABcommodModule.list.push(TABcommodChild);
          setTimeout(()=>{
              this.isShowForm = 15;
              this.TABcommodChild= { ...TABcommod_Child}
          })
          this.saveData('1');//当运营想要一个实时保存的功能时
      }
    },
    //tab子模块删除
    DelTABcommod(){
      this.$confirm("确认删除此?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            switch (this.TABcommodModule.list.length){
              case 1:
                this.isShowForm = '';
                break;
            }
            this.TABcommodModule.list.splice(this.TABcommodModule.list.indexOf(this.TABcommodChild), 1);
            this.TABcommodChild= { ...TABcommod_Child}
          }).catch(() => {});
    },
    // tab商品模块list选中时间
    onTABcommod(item, data, index) {
      this.TABcommodChild = item;
      this.TABcommodModule = data;
      this.redactVSadd = 1;
      this.isShowTAB_commod = index
      this.isShowForm = 15; //倒计时表单
    },
    //优惠券模块
    onCouponModule() {
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.couponModule};  
          this.$message({
            message: "修改信息成功!",
            type: "success"
          });
        }else{
          this.template.m.splice(this.templateIndex+1,0,this.couponModule);
          
          let obj = JSON.parse(JSON.stringify(this.couponList))
          this.couponModule.list.push(obj);  
        }
        this.isShowForm = 18//打开优惠券子模块
    },
    // 优惠券list
    couponChildBut(couponList){
      if(this.redactVSadd === 1){
        this.couponModule.list.splice(this.couponModule.list.indexOf(this.couponList),1,couponList);
        setTimeout(()=>{
          this.isShowForm = 18;
          this.couponList={
            coupon_code: "", // 优惠券码
            type: "discount", // 优惠券类型: 满减 discount;
            price: "", // 优惠券金额
            name: "", // 优惠券名称
            desc: "", // 优惠券描述
            full: "" // 门槛
          }
        })
        this.redactVSadd = 2;
        this.saveData('1');//当运营想要一个实时保存的功能时
        return;
      }else{
          this.couponModule.list.push(couponList);              
          setTimeout(()=>{
              this.isShowForm = 18;
              this.couponList={
                coupon_code: "", // 优惠券码
                type: "discount", // 优惠券类型: 满减 discount;
                price: "", // 优惠券金额
                name: "", // 优惠券名称
                desc: "", // 优惠券描述
                full: "" // 门槛
              }
          })
          this.saveData('1');//当运营想要一个实时保存的功能时
      }
    },
    //一键领取优惠券条新增
    addToyijianlingqu(tab, index) {
      let obj1 = JSON.parse(JSON.stringify(this.couponList))//这里使用深度复制使其点击添加按钮生成的表单值具有唯一性
      this.couponModule.list.splice(index + 1, 0, obj1);
    },
    // 一键领取条删除
    deleteyijianlingqu(index) {
      this.$confirm("确认删除此模块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.couponModule.list.length < 2) {
            this.$notify({
              message: "最少添加一个优惠券码!",
              offset: 100,
              type: "warning"
            });
          }else{
            this.couponModule.list.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    //选中当前一键领取优惠券
    yijianlingqu(data){
      this.couponModule = data;
      this.isShowForm = 18; //优惠券表单
    },
    //优惠券list删除    
    DelCoupon(){
      this.$confirm("确认删除此?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            switch (this.couponModule.list.length){
              case 1:
                this.isShowForm = '';
                break;
            }
            this.couponModule.list.splice(this.couponModule.list.indexOf(this.couponList), 1);
            this.couponList={
              coupon_code: "", // 优惠券码
              type: "discount", // 优惠券类型: 满减 discount;
              price: "", // 优惠券金额
              name: "", // 优惠券名称
              desc: "", // 优惠券描述
              full: "" // 门槛
            }
          }).catch(() => {});
    },
    //选中当前优惠券
    couponClick(coupon,data,index){
      this.couponList = coupon;
      this.couponModule = data;
      this.redactVSadd = 1;
      this.index = index;
      this.isShowForm = 18; //优惠券表单
    },
    //爆款推荐模块
    onRecommend() {
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.recommend };
        }else{
          // this.template.m.push({ ...this.carousel_map });
          this.template.m.splice(this.templateIndex+1,0,{ ...this.recommend });
        }
        this.isShowForm = 20
    },
    //创建/修改 爆款推荐图片
    recoBut(recommend_url) {
      let valids = true;
      this.$refs.recommend_url.validate(valid => {
        if (valid) {
            valids = false;
          } else {
            valids = true;
            return false;
          }
      });
      if (valids) return;
      if(this.redactVSadd === 1){
        this.redactVSadd = 2;
        let obj = JSON.parse(JSON.stringify(recommend_url));
        this.recommend.picture_list.splice(this.index,1,obj);
        this.saveData('1');//当运营想要一个实时保存的功能时
        // 清空表单
        this.recommend_url = {
            img_url:'',
            url_xcx:'',
            url_h5:'',
            begin_ts: "", // 开始时间
            end_ts: "" // 结束时间
        }
        return;
      }else{
        // let obj = recommend_url
        this.template.m.indexOf(this.recommend)
        this.recommend.picture_list.push(recommend_url); //把选中热区表单 插入当前模块
        this.saveData('1');//当运营想要一个实时保存的功能时
        // 清空表单
        this.recommend_url = {
            img_url:'',
            url_xcx:'',
            url_h5:'',
            begin_ts: "", // 开始时间
            end_ts: "" // 结束时间
        }
      }
    },
    //爆款推荐选中图片
    recoCurrent(map, data, index) {
      // this.carouse_url = JSON.parse(JSON.stringify(map));
      this.recommend_url = map;
      this.recommend = data;
      this.redactVSadd = 1;
      this.index = index;
      this.isShowForm = 20; //热区表单
    },
    //爆款图片删除
    DelRecommend() {
        this.$confirm("确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=>{
            switch (this.recommend.picture_list.length){
              case 1:
                this.isShowForm = '';
                break;
            }
            this.recommend.picture_list.splice(this.recommend.picture_list.indexOf(this.recommend_url), 1);
            this.recommend_url = {
              img_url:'',
              url_xcx:'',
              url_h5:'',
              begin_ts: "", // 开始时间
              end_ts: "" // 结束时间
            }
          }).catch(() => {});
    },
    //标题分类模块
    onTitleClass() {
        if(this.redactVSadd === 1){
          this.redactVSadd = 2
          this.template.m[this.templateIndex] = { ...this.titleClass };
        }else{
          this.template.m.splice(this.templateIndex+1,0,{ ...this.titleClass });
        }
        this.saveData('1')
        this.isShowForm = "";
    },
    // --------------------公共区域--------------------
    //新增模块
    newTemplate(i,index) {
      this.isShowBut = i + index
      this.templateIndex = index;//templateIndex 模板创建和时的index
      this.isShowForm = i;//
      this.redactVSadd = 2;
      switch (i) {
        case 2:
          this.template.m.forEach(item =>{
              if(item.module_type === 4){
                this.isShowForm = '';
                this.isINavsBut = 0
                this.$notify({
                    title: "导航已存在!",
                    message: "只能添加一个导航模块!",
                    offset: 100,
                    type: "warning"
                  });
                  return;
                }
          })
          if (this.template.m.length === 0) {
                  this.isShowForm = '';
                  this.isINavsBut = 0
                  this.$notify({
                    title: "没有模块",
                    message: "请先创建其他模块",
                    offset: 100
                  });
                  return;
          }
          this.temp_extends = {
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            module_type:4,
            module_title: "导航模块",
            fe_module_id:"",
            background_color: "", //背景颜色
            background_sel_color: "", //选中背景颜色
            font_def_color: "", //默认字体颜色
            font_sel_color: "", //选中字体颜色
            navs: [],
            show_mode: [
              "show_with_vip",
              "show_with_not_vip"
            ]
          }
          break;
        case 3:
          this.form = {
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            module_type: 1, //模块类型: 1 热区; 2 商品; 3 轮播
            module_title: "", //模块名称
            background: "", //event_type
            back_height: "",
            show_mode: [
              "show_with_vip",
              "show_with_not_vip"
            ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
            areas: [],
            fe_module_id: "fe_module_id" + Date.now()
          };
          break;
        //商品模块
        case 4:
          // this.commodityInfo = { ...commodityInfo } fe_module_id是动态id所以不能用
          this.commodityInfo = {
            more_text_font:"", // 查看更多文案颜色 3.1期增加
            more_bg_color:"", // 查看更多背景颜色 3.1期增加
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
            is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
            module_type: 2,
            subscript_pic:'',//爆款商品角标
            module_title: "",
            background: "",
            back_height:"",
            background_color: "",
            template: "", //模板类型
            price_text: "", //活动价名称
            act_type: "", //活动类型
            act_id: "", //活动id
            url_h5_format: "", //活动详情h5链接格式
            url_xcx_format: "", //活动详情小程序链接格式
            max_rows: "", //显示多少个商品
            more_url_xcx: "", //[商品模块专属]更多内容 - 小程序链接
            more_url_h5: "", //[商品模块专属]更多内容 - h5链接
            position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
            subscript: "", // 角标 11月需求增加
            price_bg_color:"#DC2992",//价格颜色
            logo: "", // logo 11月需求增加
            show_logo: false, // 是否显示logo 11月需求增加
            show_mode: [
              "show_with_vip",
              "show_with_not_vip"
            ],
            fe_module_id: "fe_module_id" + Date.now(),
            goods: []
          };
          break;
        case 6:
          this.carousel_map = {
              back_height:"",
              module_type: 3, //模块类型: 1 热区; 2 商品; 3 轮播;
              module_title: "", //模块名称
              show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
              show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
              show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
              disable_tips: "活动未开始", // 置灰文案; 3.1期增加
              picture_list: [],//轮播列表
              fe_module_id: "fe_module_id" + Date.now(),
              show_mode: [
                "show_with_vip",
                "show_with_not_vip"
              ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
          }
          break;
        //倒计时 模块
        case 8:
          this.countdownModule = {
            module_type:5,
            module_title:"倒计时模块",
            djs_bg_color_def:"#FFFFFF",// 倒计时默认背景颜色
            background_sel_color:"#FE0F40",// 选中背景颜色
            font_def_color:"#333333",// 默认字体颜色
            font_sel_color:"#FFFFFF",// 选中字体颜色
            time_des_color:"#333333", // 时间描述文字颜色
            hour_color:"#FFFFFF", // 时,分字体颜色
            hour_bg_color:"#474245", // 时,分背景颜色
            has_color:"#FFFFFF", // 已开始秒字体颜色
            has_bg_color:"#FF124D", // 已开始秒背景颜色
            has_not_color:"#FFFFFF", // 未开始秒字体颜色
            has_not_bg_color:"#49D37C", // 未开始秒背景颜色
            fe_module_id: "fe_module_id" + Date.now(),
            time_list:[],
            show_mode: [
                  "show_with_vip",
                  "show_with_not_vip"
            ]
          }
          this.countdownChild={ ...countdown_Child}          
          break;
        // 弹幕轮播模块
        case 10:
          this.barrageModule={
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
            module_type: 6,
            module_title: "",
            background: "", //背景图片
            top:85,
            left:260,
            text_align:"right",//left 左对齐 right 右对齐 center居中
            list:[],
            fe_module_id: "fe_module_id" + Date.now(),
            show_mode: [
              "show_with_vip",
              "show_with_not_vip"
            ],
          }
          break;
        //tab商品 模块
        case 14:
          this.TABcommodModule = {
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            module_type:7,
            module_title:"TAB商品模块",
            bg_color_def:"#FFFFFF",// 默认背景颜色
            bg_sel_color:"#FE0F40",// title选中背景颜色
            font_def_color:"#333333",// title默认字体颜色
            font_sel_color:"#FFFFFF",// title选中字体颜色
            fe_module_id: "fe_module_id" + Date.now(),
            list:[],
            show_mode: [
                      "show_with_vip",
                      "show_with_not_vip"
                ]
          }
          this.TABcommodChild= { ...TABcommod_Child}
          break;
        case 16:
          // this.commodityInfo = { ...commodityInfo } fe_module_id是动态id所以不能用
          this.commodityInfo = {
            more_text_font:"", // 查看更多文案颜色 3.1期增加
            more_bg_color:"", // 查看更多背景颜色 3.1期增加
            show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
            disable_tips: "活动未开始", // 置灰文案; 3.1期增加
            is_hot: false, // 是否为爆款商品: 是 true; 否 false; 3.1期增加
            module_type: 8,
            subscript_pic:'',//爆款商品角标
            module_title: "",
            background: "",
            back_height:"",
            background_color: "",
            template: "", //模板类型
            price_text: "", //活动价名称
            act_type: "", //活动类型
            act_id: "", //活动id
            url_h5_format: "", //活动详情h5链接格式
            url_xcx_format: "", //活动详情小程序链接格式
            max_rows: "", //显示多少个商品
            more_url_xcx: "", //[商品模块专属]更多内容 - 小程序链接
            more_url_h5: "", //[商品模块专属]更多内容 - h5链接
            position: "0", // 位置: 一列商品 0,左上1,左下二列,三列商品0,左上1,右上2,左下3,右下 11月需求增加
            subscript: "", // 角标 11月需求增加
            price_bg_color:"#DC2992",//价格颜色
            logo: "", // logo 11月需求增加
            show_logo: false, // 是否显示logo 11月需求增加
            show_mode: [
              "show_with_vip",
              "show_with_not_vip"
            ],
            fe_module_id: "fe_module_id" + Date.now(),
            goods: []
          };
          break;
        // 优惠券模块
        case 17:
            this.couponModule = {
              module_type:9,
              module_title:"优惠券模块",
              background:"",
              bg_color:"",//背景颜色
              before_img:"",
              after_img:"",
              collection_method: "onekey", // 领取方式: 一键领取 onekey; 单张领取 single;
              collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
              list: [],
              fe_module_id: "fe_module_id" + Date.now(),                        
              show_mode: [
                "show_with_vip",
                "show_with_not_vip",
              ],
              show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
              show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
            }
          break;
        case 19:
            this.recommend = {
              module_type: 10, //模块类型: 1 热区; 2 商品; 3 轮播;
              module_title: "爆品推荐模块", //模块名称
              show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
              show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
              show_disable_tips: false, // 是否显示置灰文案: 是 true; 否 false; 3.1期增加
              disable_tips: "活动未开始", // 置灰文案; 3.1期增加
              bg_color_def:'#ffffff',//按钮的默认背景色
              bg_sel_color:'#fdf3ad',//按钮的选中背景色
              font_def_color:'#000000',//字体默认颜色
              font_sel_color:'#000000',//字体选中颜色
              picture_list: [],//轮播列表
              fe_module_id: "fe_module_id" + Date.now(),
              show_mode: [
                "show_with_vip",
                "show_with_not_vip",
              ], //显示模式,十进制整数存储,目前最大为15,以二进制与运算检查权限
            }
          break;
        case 21:
          this.couponModule={
            module_type: 11,
            module_title:"优惠券模块",
            background:"",
            bg_color:"",//背景颜色
            before_img:"",
            after_img:"",
            collection_method: "onekey", // 领取方式: 一键领取 onekey; 单张领取 single;
            collection_rate: "1day1", // 领取频率: 一天一次 1day1; 一次 once;
            list: [],
            fe_module_id: "fe_module_id" + Date.now(),
            show_mode: [
                "show_with_vip",
                "show_with_not_vip",
            ],
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '' // 结束显示时间 每个模块都增加 3.1期增加
          }
          break
        case 22:
          this.titleClass={
            module_type: 12,
            module_title:"标题分类模块",
            icon: "", // 图标
            title: "", // 标题
            bg_color: "", // 背景颜色
            fe_module_id:"fe_module_id" + Date.now(),// 配合前端的冗余字段
            show_mode:[
              "show_with_vip",
              "show_with_not_vip",
            ],
            show_begin_ts: '', // 开始显示时间 每个模块都增加 3.1期增加
            show_end_ts: '', // 结束显示时间 每个模块都增加 3.1期增加
          }
          break
        }
    },
    // 提交数据
    saveData(noUpdata) {
      const loading = this.$loading({//loading 打开
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.timeToolD()//时间转化成时间戳秒值后台需求
      // 将时间处理成后端需求
      let templatePost = Object.assign({},this.template)
      if(!templatePost.hasOwnProperty('activity_id')) return alert('请刷新页面!');
      handleimgPost(templatePost).then(res => {
        //如果没有ID则不需要使用
        if(res.data.activity_id){
          this.template.activity_id = res.data.activity_id
          this.activity_id = res.data.activity_id
        }
        if (res.errno == 0) {
          loading.close();//关闭loading
          if(noUpdata == 1){
            this.timeToolM();
            this.$message({
              message: "信息保存成功!",
              type: "success"
            });
            // 上传成功后还原时间
          }else{
            this.$router.push({
              path: "/EventPageList",
            });
          }
          return;
        } else {
          loading.close();//关闭loading
          this.$message.error(res.errmsg);
          // 上传失败后还原时间
          this.timeToolM();
        }
      }).catch(err => {
        loading.close();//关闭loading

        this.$message.error(err);
          // 如果上传失败则还原时间
      });
    },
    // 编辑时间处理函数
    editTime(time){
      if(time == undefined) return;
      if(time.toString().length < 13){
        time = time * 1000     
        return time
      }else if(time.toString().length > 13){
        time = time / 1000
        return time     
      }
    },
    //保存时间处理
    saveTime(time){
      if(time == undefined) return;
      if(time.toString().length < 10){
        time = time * 1000     
        return time
      }else if(time.toString().length > 10){
        time = time / 1000
        return time     
      }
    },
    //编辑
    actSearch() {
      handleimgSearch(this.template.activity_id).then(res => {
        //先使用Object.assign 将返回值赋值
        this.template = Object.assign({},this.template,res.data)
        //循环将时间戳 *1000 使 el-date-picker 时间标签时间能正常显示
        this.template.begin_ts = this.editTime(this.template.begin_ts)
        // 这里使用switch就没问题,很懵逼!!而却不能用if会报错!!!!!   
        res.data.list.forEach(item => {
          switch(item.module_type){
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
              item.show_begin_ts = this.editTime(item.show_begin_ts)
              item.show_end_ts = this.editTime(item.show_end_ts)
              break;
            case 5:
              if(item.time_list){
                item.time_list.forEach(idata =>{
                  idata.begin_ts = this.editTime(idata.begin_ts)
                  idata.end_ts =  this.editTime(idata.end_ts)
                })
              }else{
                // window.location.reload();
              }
            break;
            case 10:
              item.show_begin_ts = this.editTime(item.show_begin_ts)
              item.show_end_ts = this.editTime(item.show_end_ts)
              if(item.picture_list){
                item.picture_list.forEach(idata =>{
                    idata.begin_ts = this.editTime(idata.begin_ts)
                    idata.end_ts = this.editTime(idata.end_ts)
                })
              }else{
                // window.location.reload();
              }
              break;
          }
        })
        //最后将this.template.m 数组赋值,将数据实现返显
        this.template.side_navs = res.data.side_navs
        this.template.m = res.data.list;
      });
    },
    // 时间处理函数乘法  秒值转换成毫秒值
    timeToolM(){
      // 如果上传成功后还原时间 为什么不直接调用编辑函数呢?因为修改函数调用的时候会让数组的数据双向绑定失效 解释:调用编辑函数后会重新给this.template赋值
        if(this.template.begin_ts.toString().length < 13){
          this.template.begin_ts = this.template.begin_ts * 1000
          this.template.m.forEach(item =>{
            if(item.module_type == 1 || item.module_type == 2 || item.module_type == 3 || item.module_type == 4 || item.module_type == 6 || item.module_type == 7 || item.module_type == 8 || item.module_type == 9 || item.module_type == 11){
                    item.show_begin_ts = item.show_begin_ts * 1000
                    item.show_end_ts = item.show_end_ts * 1000
            }else if(item.module_type == 5){
              item.time_list.forEach(idata =>{
                  idata.begin_ts = idata.begin_ts * 1000
                  idata.end_ts = idata.end_ts * 1000
                })
            }else if(item.module_type == 10){
              item.show_begin_ts = item.show_begin_ts * 1000
              item.show_end_ts = item.show_end_ts * 1000
              if(item.picture_list){
                item.picture_list.forEach(idata =>{
                    idata.begin_ts = idata.begin_ts * 1000
                    idata.end_ts = idata.end_ts * 1000
                })
              }else{
                // window.location.reload();
              }
            }
            // forEach 里面尽量不要使用switch进行多条件判断
          })
        }
    },
    // 时间除法 毫秒值转换成秒值
    timeToolD(){
        this.template.begin_ts = this.saveTime(this.template.begin_ts)
        if(!this.template.m){
          return;
        }
        this.template.m.forEach(item =>{
          switch(item.module_type){
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
                item.show_begin_ts = this.saveTime(item.show_begin_ts)
                item.show_end_ts = this.saveTime(item.show_end_ts)
                break;
            case 5:
              if(item.time_list){
                item.time_list.forEach(idata =>{
                  idata.begin_ts = this.saveTime(idata.begin_ts)
                  idata.end_ts = this.saveTime(idata.end_ts)
                })
              }else{
                window.location.reload();
              }
              break;
            case 10:
              item.show_begin_ts = this.saveTime(item.show_begin_ts)
              item.show_end_ts = this.saveTime(item.show_end_ts)
              if(item.picture_list){
                item.picture_list.forEach(idata =>{
                    idata.begin_ts = this.saveTime(idata.begin_ts)
                    idata.end_ts = this.saveTime(idata.end_ts)
                })
              }else{
                // window.location.reload();刷新页面
              }
              break;
          }
        })
    },
    //模块修改
    templateItem(data, index) {
      this.templateIndex = index;
      this.redactVSadd = 1;
      if (data.module_type == 2 || data.module_type == 8) {//商品
        this.isShowForm = 4;
        // this.commodityInfo = JSON.parse(JSON.stringify(data));
        this.commodityInfo = data
        return;
      } else if (data.module_type == 1) {//热区
        this.isShowForm = 3;
        this.form = Object.assign({}, data);
        if (data.module_title == "") this.ShowHidden_del_but = false;
        else this.ShowHidden_del_but = true;
        return;
      }else if(data.module_type == 3){//轮播
        this.isShowForm = 6;
        // this.carousel_map = JSON.parse(JSON.stringify(data));
        this.carousel_map = data
        this.carouse_url = {
          img_url:'',
          url_xcx:'',
          url_h5:''
        }
        return;
      }else if(data.module_type == 4){//导航
        this.isShowForm = 2;
        // this.temp_extends = JSON.parse(JSON.stringify(data))
        this.temp_extends = data
        if (this.temp_extends.navs.length === 0) {
            this.isINavsBut = 1;
        }else{
            this.isINavsBut = 2;
        }
        return;
        // this.temp_extends = JSON.parse(JSON.stringify(data));
      }else if(data.module_type == 5){ //倒计时
        this.isShowForm = 8;
        this.countdownModule  = data
        return;
      }else if(data.module_type == 6){ //弹幕轮播
        this.isShowForm = 10;
        this.barrageModule = data
        this.barrageList = {
          type:"text", // 类型: img 图片; text 文字;
          type_value:"", // 类型值,type为img该值为图片地址,type为text,类型值为文本
          url_h5: "", // h5链接
          url_xcx:"", // 小程序链接
          font_def_color:"", // 文字默认颜色
          font_sel_color:"", // 文字选中颜色
          background_color:"", // 背景颜色
        }
        return;
      }else if(data.module_type == 7){
        this.isShowForm = 14
        this.TABcommodModule = data
        return;
      }else if(data.module_type == 9){
        this.isShowForm = 17
        this.couponModule = data
        return;
      }else if(data.module_type == 10){
        this.isShowForm = 19
        this.recommend = data
        return;
      }else if(data.module_type == 11){
        this.isShowForm = 21
        this.couponModule = data
        return;
      }else if(data.module_type == 12){
        this.isShowForm = 22
        this.titleClass = data
        return;
      }
    },
    foldBut(){
        if(!this.isFold){
          this.isFold = true
        }else{
          this.isFold = false
        }
    },
    //删除模块
    DeleteMokuai(i) {
      this.$confirm("确认删除此模块?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isINavsBut = 1 ; //删除导航模块后添加按钮显示
          // this.form.hotspots._stop();
          this.isShowForm = ''
          this.template.m.splice(this.templateIndex, 1);
        })
        .catch(() => {});
    },
    // 所有图片--上传图片验证
    beforeIMGUpload(file) {
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/gif" ||
        file.type == "svg" ||
        file.type == "image/bmp";
      const isLt5M = file.size / 1024 < 300; //300kb
      // const isLt5M = file.size / 1024 / 1024 < 3; //3mb
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/BMP 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 300kb!");
      }
      return isJPG && isLt5M;
    },
    //删除图片
    Deletehead_img(data) {
      this.$confirm("确认删除此图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch(data){
            case 'toutu':
              this.commodityInfo.head_img = '';
              break;
            case 'jiaobiao':
              this.commodityInfo.subscript_pic = ''
              break;
            case 'daojishi':
              this.countdownChild.subscript_pic = ''
              break;
            case 'TAB':
              this.TABcommodChild.subscript_pic = ''
          }
        })
        .catch(() => {});
    },
    initSet(data) {
      // 获取图片高度
      this.form.back_height = this.$refs.img_height[0].offsetHeight
      this.initData(data);
    },
    //mousedown.stop 事假终止
    moveStop() {
      return false;
    },
    // 拖动排序 - start
    datadragEnd(evt) {
      evt.preventDefault();
      if (this.template.m[evt.oldIndex].module_type === 1) {
        this.template.m[evt.oldIndex].hotspots._stop();
        this.template.m[evt.oldIndex].hotspots = null;
        setTimeout(() => {
          this.initData(this.template.m[evt.oldIndex]);
        });
      }
      if (this.template.m[evt.newIndex].module_type === 1) {
        this.template.m[evt.newIndex].hotspots._stop();
        this.template.m[evt.newIndex].hotspots = null;
        setTimeout(() => {
          this.initData(this.template.m[evt.newIndex]);
        });
      }
    },
    //权限显示
    handleClick(tab, event) {
      this.isShowFormNavs = tab.index;
    },
    // 点击事件禁止冒泡
    removalEvent() {
      return false;
    },
    // //时间
    formatTime:function(row, column, cellValue){
        return formatDate(cellValue)
    },
    // 背景颜色
    dynamicBg(){
      return `background-color: ${this.template.background_color}`
    },
  },
  mounted() {
    //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    // 获取浏览器高度
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
      })();
    };
    //轮询接口
    let that = this
    const timers = window.setInterval(() => {
      setTimeout(res =>{
        that.saveData('1')
      },0)//利用定时器清除setInterval的每次叠加
    }, 600000);//10分钟执行一次
    //使用$once在离开当前路由时销毁定时器
    this.$once('hook:beforeDestroy',()=>{
      clearInterval(timers);
    })
  },
  // 在vue实例销毁前调用(类似跳转路由调用)
  beforeDestroy(){

  }
};
</script>

<style scoped>
ul li {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

.inputwidth {
  width: 200px;
}
.heder {
  width: 100%;
  display: flex;
  position: absolute;
  z-index: 999;
  background-color: rgba(0 0 0, 0.5);
}
.hederAddBut {
  left: 60%;
  position: absolute;
}
.hederSaveBut {
  left: 70%;
  position: absolute;
}
.content {
  display: flex;
  padding-top: 40px;
}
.right_form {
  left: 60%;
  position: absolute;
  /* background-color: rgba(201,231,255); */
}
.HotZone {
  position: relative;
  overflow: hidden;
}
.HotZone_box {
  position: absolute;
  background-color: rgba(255, 100, 97, 0.5);
}
.HotZone_img {
  width: 562.5px;
  vertical-align: top;
}
#carouselMap {
  width: 546.5px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y:hidden;
  padding-right: 14px;
}
.carouselMap_box {
  /* padding: px; */
  display: inline-block;
  width: 110.5px;
}
.moban_item {
  display: flex;
  align-items: center;
}
/* 导航 */
.navigation {
  width: 562.5px;
  white-space: nowrap;
  overflow-x: auto;
}
.border_dashed{
  border: 1px dashed #000;
  margin: 1px
}
.navigation_box {
  display: inline-block;
  width: 110.5px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border: solid 2px #c8c5c5;
}
.navigation_int{
  display: inline-block;
  width: 110.5px;
  height: 52px;
  text-align: center;
  line-height: 25px;
  border: solid 2px #c8c5c5;
}
.barrage_box {
  height: 30px;
  line-height: 30px;
  /* overflow-y: auto; */
}
.workButton div{
  margin: 5px 0 5px 0;
}
.headeList ul{
  display: flex;
}
.foldMod{
  height:30px;
  width:100px;
  text-align:content;
  line-height:30px;
  font-weight:bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.foldMod:hover{
  width:auto;
  /* text-overflow:inherit; 
  overflow: visible; 
  white-space: pre-line;     
  合并空白符序列，但是保留换行符。 */
}
.couponCla{
  width: 562.5px;
  /* height: 150px; */
  text-align:content;
  line-height: 150px;
}
.couponCla_yijian{
  width: 562.5px;
  text-align:content;
}
.couponClaSingle{
  margin:0 auto;
  width: 430px;
  height: 86px;
  background: url('./../../assets/img/couponCla.png') 10% 10% no-repeat;
  background-size: cover;
}
.couponPrice{
  display: flex;
}
.price_rmb{
  width: 100px;
  font-weight: bold;
  font-size: 20px;
  margin: 0 0 0 24px;
  line-height: 90px;
}
.price_spa{
  line-height: 30px;
  font-size: 18px;
  padding-top: 14px;
  
}
.Group{
  font-weight: bold;
}
.height500{
  padding: 5px;
  width: 470px;
  height: 500px;
  overflow-y: auto;
  border: 5px solid #e3e197;
  box-shadow:0 0 5px #e3e197 inset;
}
.disBorder{
  width: 700px;
  /* height: 575px; */
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow:0 0 5px rgba(201,231,255) inset;
  padding: 5px;
  border: 5px solid rgba(201,231,255);
  /* background-color: #e3e197; */
}
.el-button--small{
  width: 128px !important;
}
.coupon_title{
  width:130px;
  vertical-align: middle;
  overflow: hidden;
  background-size:cover;
  display:inline-block;
  cursor:pointer;
  box-shadow:0 0 1px rgba(201,231,255) inset;
  border: 1px solid rgba(201,231,255);
}
.coupon_title :hover{
  background-color: antiquewhite;
}
.titleClassW{
  display: flex;
  width: 562.5px;
  /* height: ; */
  color: #DC2992;
}
.titleCmargin{
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  margin: 0 auto;
}
.svg_icon{
  width: 30px;
  height: 60px;
  margin: 0 70px;
}
.svg_icon_list{
  width: 30px;
  height: 30px;
  margin: 0 80px;
}
.svg_icon_tab{
  width: 30px;
  height: 30px;
  margin: 0 80px;
}
</style>
