import * as types from '../mutation-types'

const app = {
    state: {
        userList: '',
        userName: '',//用户名
        tempSendId:'',//微信发送记录 id
        goodsusedId:'',//商品id
        editgoodsId:'',//修改商品所需id
        editgoodsSku:'',//修改商品所需sku
        youzandetailId:'',//查看有赞商品详情 id
        brandId:'',//品牌brand id
        brandCountry:'',//品牌国家 brand country
        brandgoodsId:'',//品牌旗下商品详情id
        activityId:'',//活动列表 查看详情id
        seckillspecialId:'',//活动管理 秒杀专场id
        fullcutId:'',//满减活动列表 id
        spellactivityId:'',//批团活动列表跳转至拼团商品列表
        refundId:'',//退货退款 id
        communityId:'',//社区id
        communityArrId:'',//精选笔记所有id
        liveId:'',//直播id
        couponsId:'',//优惠券id,
        couponsruleId:'',//优惠券规则id
        ShortLinkPageid:'',//短链接生成页面id
    },
    mutations: {
        [types.SET_USER_LIST](state, userInfor) {
            state.userList = userInfor
        },
        [types.SET_TEMP_SEND_ID](state, temp) {
            state.tempSendId = temp
        },
        [types.SET_GOODS_ID](state, goodsId) {
            state.goodsusedId = goodsId
        },
        [types.SET_EDIT_GOODS_ID](state, editgoodsId) {
            state.editgoodsId = editgoodsId
        },
        [types.SET_EDIT_GOODS_SKU](state, editgoodsSku) {
            state.editgoodsSku = editgoodsSku
        },
        [types.SET_YOUZAN_DETAIL_ID](state, youzandetailId) {
            state.youzandetailId = youzandetailId
        },
        [types.SET_BRAND_ID](state, brandId) {
            state.brandId = brandId
        },
        [types.SET_BRAND_COUNTRY](state, brandCountry) {
            state.brandCountry = brandCountry
        },
        [types.SET_BRAND_GOODS_ID](state, brandgoodsId) {
            state.brandgoodsId = brandgoodsId
        },
        [types.SET_ACTIVITY_ID](state, activityId) {
            state.activityId = activityId
        },
        [types.SET_SECKLII_SPECIAL_ID](state, seckillspecialId) {
            state.seckillspecialId = seckillspecialId
        },
        [types.SET_FULLCUT_ID](state, fullcutId) {
            state.fullcutId = fullcutId
        },
        [types.SET_SPELL_ACTIVITY_ID](state, spellactivityId) {
            state.spellactivityId = spellactivityId
        },
        [types.SET_REFUND_ID](state, refundId) {
            state.refundId = refundId
        },
        [types.SET_COMMUNITY_ID](state, communityId) {
            state.communityId = communityId
        },
        [types.SET_LIVE_ID](state, liveId) {
            state.liveId = liveId
        },
        [types.SET_COMMUNITY_ARR_ID](state, communityArrId) {
            state.communityArrId = communityArrId
        },
        [types.SET_COUPONS_ID](state, couponsId) {
            state.couponsId = couponsId
        },
        [types.SET_COUPONS_RULE_ID](state, couponsruleId) {
            state.couponsruleId = couponsruleId
        },
        [types.SET_SHORTLINK_ID](state, ShortLinkPageid) {
            state.ShortLinkPageid = ShortLinkPageid
        },
        [types.SET_USER_NAME](state, userName) {
            state.userName = userName
        },
    },
    actions: {
        setUserList({commit}, userInfor) {
            commit(types.SET_USER_LIST, userInfor)
        },
        setTempSendId({commit}, tempId) {
            commit(types.SET_TEMP_SEND_ID, tempId)
        },
        setGoodsUsedId({commit}, goodsId) {
            commit(types.SET_GOODS_ID, goodsId)
        } ,
        setEditGoodsId({commit}, editgoodsId) {
            commit(types.SET_EDIT_GOODS_ID, editgoodsId)
        },
        setEditGoodsSku({commit}, editgoodsSku) {
            commit(types.SET_EDIT_GOODS_SKU, editgoodsSku)
        },
        setYouZanDetailId({commit}, youzandetailId) {
            commit(types.SET_YOUZAN_DETAIL_ID, youzandetailId)
        },
        setBrandId({commit}, brandId) {
            commit(types.SET_BRAND_ID, brandId)
        },
        setBrandCountry({commit}, brandCountry) {
            commit(types.SET_BRAND_COUNTRY, brandCountry)
        },
        setBrandGoodsId({commit}, brandgoodsId) {
            commit(types.SET_BRAND_GOODS_ID, brandgoodsId)
        },
        setActivityId({commit}, activityId) {
            commit(types.SET_ACTIVITY_ID, activityId)
        },
        setSeckillspecialId({commit}, seckillspecialId) {
            commit(types.SET_SECKLII_SPECIAL_ID, seckillspecialId)
        },
        setFullcutId({commit},fullcutId){
            commit(types.SET_FULLCUT_ID,fullcutId)
        },
        setSpellactivityId({commit},spellactivityId){
            commit(types.SET_SPELL_ACTIVITY_ID,spellactivityId)
        },
        setRfundId({commit},refundId){
            commit(types.SET_REFUND_ID,refundId)
        },
        setCommunityId({commit},communityId){
            commit(types.SET_COMMUNITY_ID,communityId)
        },
        setLiveId({commit},liveId){
            commit(types.SET_LIVE_ID,liveId)
        },
        setCommunityId({commit},communityArrId){
            commit(types.SET_COMMUNITY_ARR_ID,communityArrId)
        },
        setCouponsId({commit},couponsId){
            commit(types.SET_COUPONS_ID,couponsId)
        },
        setCouponsruleId({commit},couponsruleId){
            commit(types.SET_COUPONS_ID,couponsruleId)
        },
        setShortLinkId({commit}, ShortLinkPageid) {
            commit(types.SET_SHORTLINK_ID, ShortLinkPageid)
        },
        setShortLinkId({commit}, userName) {
            commit(types.SET_USER_NAME, userName)
        },
    },
    getters: {
        userList: state => {
            return state.userList
        },
        tempSendId: state => {
            return state.tempSendId
        },
        goodsusedId: state => {
            return state.goodsusedId
        },
        editgoodsId: state => {
            return state.editgoodsId
        },
        editgoodsSku: state => {
            return state.editgoodsSku
        },
        youzandetailId: state => {
            return state.youzandetailId
        },
        brandId: state => {
            return state.brandId
        },
        brandCountry: state => {
            return state.brandCountry
        },
        brandgoodsId: state => {
            return state.brandgoodsId
        },
        activityId: state => {
            return state.activityId
        },
        seckillspecialId: state => {
            return state.seckillspecialId
        },
        fullcutId:state=>{
            return state.fullcutId
        },
        spellactivityId:state=>{
            return state.spellactivityId
        },
        refundId:state=>{
            return state.refundId
        },
        communityId:state=>{
            return state.communityId
        },
        liveId:state=>{
            return state.liveId
        },
        communityArrId:state=>{
            return state.communityArrId
        },
        couponsId:state=>{
            return state.couponsId
        },
        couponsruleId:state=>{
            return state.couponsruleId
        },
        ShortLinkPageid: state => {
            return state.ShortLinkPageid
        },
        userName: state => {
            return state.userName
        },
    }
}
export default app
