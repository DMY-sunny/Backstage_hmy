import Cookies from 'js-cookie'
export default {
    cloneObj(obj) {
        let str = obj.constructor === Array ? [] : {};
        let newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj); // 首先将对象序列化
            newobj = JSON.parse(str); //  然后将对象还原
        }
        return newobj;
    },
    //此角色有什么操作按钮权限功能
    WMSpermissionsBtnSet (name) {
        var WMSpermissionsBtnSet = Cookies.get('WMSpermissionsBtnSet');
        if(WMSpermissionsBtnSet){
            var p = JSON.parse(WMSpermissionsBtnSet);
            for (var i = 0; i < p.length; ++i) {
                if (p[i] === name) {
                    return true;
                }
            }
        }
        return false;
    },
};
 // 时间处理
export function formatDate(cellValue) {
    var date = new Date(cellValue * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-";
            var M =
                (date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1) + "-";
            var D =
                (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
                " ";
            var h =
                (date.getHours() < 10
                    ? "0" + date.getHours()
                    : date.getHours()) + ":";
            var m =
                (date.getMinutes() < 10
                    ? "0" + date.getMinutes()
                    : date.getMinutes()) + ":";
            var s =
                date.getSeconds() < 10
                    ? "0" + date.getSeconds()
                    : date.getSeconds();
            return (cellValue = Y + M + D + h + m + s);
};
