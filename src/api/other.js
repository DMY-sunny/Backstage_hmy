import request from '@/utils/axiosNo'

//活动列表 导入活动商品 /activity/main/import?activity_id=
export function activitylistImport(id, sendObj) {
    return request({
        url: '/activity/main/import?activity_id='+id,
        method: 'POST',
        data: sendObj,
    })
}
//秒杀专场 导入商品 /skill/main/import？seckill_special_id=
export function seckillspecialImport(id, sendObj) {
    return request({
        url: '/seckill/main/import?seckill_special_id='+id,
        method: 'POST',
        data: sendObj,
    })
}

//订单待发货 导入中通 /order/main/orderztoimport
export function orderwaitsendztoImport(sendObj) {
    return request({
        url: '/order/main/orderztoimport',
        method: 'POST',
        data: sendObj,
    })
}
//订单待发货 导入圆通 /order/main/orderytimport
export function orderwaitsendytImport(sendObj) {
    return request({
        url: '/order/main/orderytimport',
        method: 'POST',
        data: sendObj,
    })
}
//订单待发货 导入一号仓 /order/main/orderyhcimport
export function orderwaitsendyhcImport(sendObj) {
    return request({
        url: '/order/main/orderyhcimport',
        method: 'POST',
        data: sendObj,
    })
}
//导入百世 /order/main/orderbestimportnew
export function orderbaishiImport(sendObj) {
    return request({
        url: '/order/main/orderbestimportnew',
        method: 'POST',
        data: sendObj,
    })
}
//导入保税仓 /order/main/orderbondedimport
export function orderbaoshuiImport(sendObj) {
    return request({
        url: '/order/main/orderbondedimport',
        method: 'POST',
        data: sendObj,
    })
}