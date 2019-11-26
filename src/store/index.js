import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
    ...app,
    strict: process.env.NODE_ENV !== 'production',
    plugins: [
        createPersistedState({
            key: 'manage-sysem',
            storage: window.sessionStorage,   // 默认是 plugins: [createPersistedState()]，对应的是window.localstorage
            reducer(val) {
                return {
                    // 此处存储需要持久化的state属性
                    userList: val.userList,
                    tempSendId:val.tempSendId,
                    goodsusedId:val.goodsusedId,
                    editgoodsId: val.editgoodsId,
                    editgoodsSku: val.editgoodsSku,
                    youzandetailId :val.youzandetailId,
                    brandId :val.brandId,
                    brandCountry:val.brandCountry,
                    brandgoodsId:val.brandgoodsId,
                    activityId:val.activityId,
                    seckillspecialId:val.seckillspecialId,
                    fullcutId:val.fullcutId,
                    spellactivityId:val.spellactivityId,
                    refundId:val.refundId,
                    communityId:val.communityId,
                    liveId:val.liveId,
                    communityArrId:val.communityArrId,
                    couponsId:val.couponsId,
                    couponsruleId:val.couponsruleId,
                    ShortLinkPageid:val.ShortLinkPageid,
                    userName:val.userName,
                }
            }
        })
    ]
})
export default store
