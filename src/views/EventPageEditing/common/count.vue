<template>
       <div :style="{'backgroundImage':'url('+bgImg+')'}" id="container" @mousedown='mouseDown($event)' @mouseup='mouseUp($event)' ref='box'></div>
</template>

<script>
    export default {
        data(){
            return{
               bgImg: require('../../../assets/img/img.jpg'),
            }
        },
        methods: {
            mouseDown(ev){
                ev = window.event || ev;
                //1.获取按下的点
                let oBox = document.getElementById("container");
                let x1 = ev.clientX - oBox.offsetLeft;
                let y1 = ev.clientY - oBox.offsetTop;
                //2.创建div
                let oDiv = document.createElement("div");
                oBox.appendChild(oDiv);
                oBox.onmousemove = function (ev) {
                    ev = window.event || ev;
                    let x2 = ev.clientX - oBox.offsetLeft;
                    let y2 = ev.clientY - oBox.offsetTop;
                    //3.设置div的样式
                    oDiv.style.left = (x2 > x1 ? x1 : x2) -70 +"px";
                    oDiv.style.top = (y2 > y1 ? y1 : y2) -70 +"px";
                    oDiv.style.width = Math.abs(x2-x1)+"px";
                    oDiv.style.height =Math.abs(y2-y1)+"px";
                    oDiv.value = 'v-drag'
                }
                return false;  //解除在划动过程中鼠标样式改变的BUG
            },
            mouseUp(){
                this.$refs.box.onmousemove = null;
            },
        },
        // 自定义指令
        // directives:{
        //     drag(el,bindings){
        //         el.onmousedown = function(e){
        //             let disx = e.pageX - el.offsetLeft;
        //             let disy = e.pageY - el.offsetTop;
        //             document.onmousemove = function (e){
        //                 el.style.left = e.pageX - disx+'px';
        //                 el.style.top = e.pageY - disy+'px';
        //             }
        //             document.onmouseup = function(){
        //                 document.onmousemove = document.onmouseup = null;
        //             }
        //         }
        //     }
        // }
    }
</script>
<style scoped>
    #container{
        width: 500px;
        height: 200px;
        border: 1px solid black;
        margin: 0px;
        position: relative;
    }
</style>