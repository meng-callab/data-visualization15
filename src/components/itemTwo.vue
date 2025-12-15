
<template>
  <div>
    <h2>疾病费用TOP10数据</h2>
    
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const emit = defineEmits(['register']) 
const chart = ref(null)
let myCChart = null 
const initChart = () => {
  // 确保容器已挂载
  if (!chart.value) return
   myCChart = echarts.init(chart.value)
const option = {
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: ¥{c}'
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    top: '3%'
  },
  xAxis: {
    type: 'value',
    axisLabel: {
        color: '#ffffff',
         fontSize: 12
      },
  },
  yAxis: {
    type: 'category',
    data: [
      '主动脉弓狭窄', '恶性肿瘤', '肝肿瘤', '主动脉瓣关闭不全',
      '其他', '脊柱侧弯', '伯基特淋巴瘤', '鼻恶性肿瘤', '急性高侧壁心肌梗死', '咽恶性肿瘤'
    ],
     axisLabel: {
        color: '#ffffff',
         fontSize: 12
      },
  },
  series: [{
    type: 'bar',
    data: [167191.71, 76936.12, 59469.24, 51511.65,49435.15, 49387.07, 41103.32, 40163.25, 39734.05, 39691.84],
     axisLabel: {
        color: '#ddd',
      },
    itemStyle: {
      color: '#4facfe',
     
        label: {
          show: true,
          position: 'right', 
          color: '#ffffff', 
          formatter: '¥{c}' 
        }
    }
  }]
};
  myCChart.setOption(option)
  emit('register', myCChart)
  window.addEventListener('resize', () => {
    myCChart.resize()
  })
}
// 组件挂载后初始化图表
onMounted(() => {
  initChart()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 210px;
  margin-top: 10px;
}
h2 {
    height: .6rem;
    color: #fff;
    line-height: .6rem;
    font-size: 0.25rem;
    text-align: center;
}
</style>