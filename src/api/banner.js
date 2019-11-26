import request from '@/utils/axios'
//banner 列表
export function bannerList(data) {
    return request({
        url: `api/toast/list`,
        method: 'GET',
        params: data
    })
}
export function bannerSave(data) {
    let str = data.toast_id ? 'update' : 'save'
    return request({
        url: `api/toast/${str}`,
        method: 'post',
        data: data
    })
}
export function bannerDetail(data) {
    return request({
        url: `api/toast/detail`,
        method: 'GET',
        params: data
    })
}
export function bannerdeltoast(data) {
    return request({
        url: `api/toast/deltoast`,
        method: 'post',
        params: data
    })
}
export function atcGoods(id) {
    return request({
        url: `api/search/act/goods?goods_id=${id}`,
        method: 'GET'
    })
}