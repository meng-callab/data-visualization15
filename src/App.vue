<template>
  <router-view/>
</template>
<script>

import {provide} from "vue"
import * as echarts from "echarts"
import axios from "axios"

//设置基准路径
axios.defaults.baseURL="http://localhost:8888"
export default{
 setup(){
  //provide("名字随便起","传递的内容")
  provide("echarts",echarts)
  provide("axios",axios)
 }
}
</script>

<style lang="less">
html, body {
  width: 100vw;    
  height: 100vh;   
  overflow: hidden;
}
body{
  background: url("~@/assets/bg.jpg") center center/ cover no-repeat fixed;

}
*{
  margin:0px;
  padding:0px;
  box-sizing: border-box;
}
</style>
