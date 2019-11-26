import request from '@/utils/axios'
// 海豚后台迁移接口
// Route::any('/act/main/listpost', 'Act\ListPostController@v1');
// Route::any('/act/main/delete', 'Act\DeleteController@v1');
// Route::any('/act/main/autocomplete', 'Act\AutoCompleteController@v1');
// Route::any('/act/main/goodslist', 'Act\GoodsListController@v1');
// Route::any('/act/main/updatepost', 'Act\UpdatePostController@v1');
// Route::any('/act/main/createpost', 'Act\CreatePostController@v1');
// Route::any('/act/main/skusearch', 'Act\SkuSearchController@v1');
// Route::any('/act/main/goodsadd', 'Act\GoodsAddController@v1');
// Route::any('/act/main/create', 'Act\CreateController@v1');
// Route::any('/act/main/goodsdel', 'Act\GoodsDelController@v1');
// Route::any('/act/main/detail', 'Act\ActDetailController@v1');
// Route::any('/act/main/import', 'Act\GoodsImportController@v1');
// Route::any('/act/main/goodsexport', 'Act\GoodsExportController@v1');
function qs(params) {
    let query = ''
    for (let key in params) query += key + '=' + params[key] + '&'
    query = query.slice(0, query.length - 1)
    return query
}

//活动管理 list /api/act/main/listpost 活动列表
export function activityList(sendObj) {
    return request({
        url: '/api/act/main/listpost',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /act/main/autocomplete 
export function autocomplete(sendObj) {
    return request({
        url: '/api/act/main/autocomplete',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/skusearch 获取商品名称及sku
export function skusearch(sendObj) {
    return request({
        url: '/api/act/main/skusearch',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/goodslist 商品列表
export function goodslist(sendObj) {
    return request({
        url: '/api/act/main/goodslist',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/goodslist 商品列表删除
export function goodsdel(sendObj) {
    return request({
        url: '/api/act/main/goodsdel',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/updatepost 修改提交
export function goodsupdatepost(sendObj) {
    return request({
        url: '/api/act/main/updatepost',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/detail 修改获取活动详情
export function actdetail(sendObj) {
    return request({
        url: `/api/act/main/detail?act_id=${sendObj}`,
        method: 'GET',
    })
}
//活动管理 /api/act/main/createpost  新增提交
export function goodscreatepost(sendObj) {
    return request({
        url: '/api/act/main/createpost',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/create  新增获取活动ID
export function createAppId(sendObj) {
    return request({
        url: '/api/act/main/create',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/goodsadd  添加新增商品
export function goodsadd(sendObj) {
    return request({
        url: '/api/act/main/goodsadd',
        method: 'POST',
        data: sendObj,
    })
}

//商品修改 /api/act/main/import 
export function goodsupdate(sendObj) {
    return request({
        url: 'api/act/main/goodsupdate',
        method: 'POST',
        data: sendObj,
    })
}

//活动管理 /api/act/main/delete 删除活动列表
export function activitylistDelete(sendObj) {
    return request({
        url: '/api/act/main/delete',
        method: 'POST',
        data: sendObj,
    })
}

//商品xlsx文件导入 /api/act/main/import 
export function goosxlsximport(sendObj,id) {
    return request({
        url: `/api/act/main/import?act_id=${id}`,
        method: 'POST',
        data: sendObj,
    })
}

//商品xlsx文件导出 /api/act/main/goodsexport 
export function goosxlsxgoodsexport(sendObj) {
    return request({
        url: `/api/act/main/goodsexport?act_id=${sendObj}`,
        method: 'GET',
    })
}

//商品联想搜索接口 /api/act/main/autocomplete/v2?keyword=
export function actautocomplete(sendObj) {
    return request({
        url: `/api/act/main/autocomplete/v2?keyword=${sendObj}`,
        method: 'GET',
    })
}