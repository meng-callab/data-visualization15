
<template>
  <div>
    <h2>各住院类型费用与主要患者数量分析</h2> 
    <!-- 通过 ref="chart" 让 Vue 能获取到该 DOM 元素 -->
    <div ref="chart" class="chart-container"></div>
  
  </div>
</template>

<script setup>
import { ref, onMounted ,defineEmits} from 'vue'
import * as echarts from 'echarts'

const emit = defineEmits(['register']) 
const chart = ref(null)
let myCChart = null // 保存图表实例引用

const initChart = () => {
  if (!chart.value) return
   myCChart = echarts.init(chart.value)//
  
  const option = {
   
    tooltip: {
      trigger: 'axis', // 联动关键
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10, 30, 50, 0.9)',
      borderColor: '#1E90FF',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter: params => {
        let res = `<strong>${params[0].name}</strong><br/>`
        params.forEach(item => {
          res += `${item.marker} ${item.seriesName}: ${item.seriesName.includes('费用') ? '¥' : ''}${item.value.toLocaleString()}<br/>`
        })
        return res
      }
    },
    legend: {
      data: ['平均费用', '患者数量'],
      top:5,
    //  bottom: 30,
      textStyle: { color: '#fff' },
      itemWidth: 12,
      itemHeight: 12
    },
    grid: {
      left: '5%',
      right: '8%',
      bottom: '20%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['转省外住院', '转省内住院', '普通住院', '特殊疾病门诊', '生育住院', '门诊慢性病', '普通门诊'],
      axisLabel: {
        rotate: 40,
        fontSize: 12,
        color: '#ffffff',
        interval: 0 // 强制显示所有标签
      },
      axisLine: { lineStyle: { color: '#444' } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '平均费用（元）',
        nameTextStyle: { color: '#4ECDC4' },
        position: 'left',
        axisLabel: { color: '#ffffff' },
        axisLine: { lineStyle: { color: '#444' } },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      {
        type: 'value',
        name: '患者数量',
        nameTextStyle: { color: '#ffffff' },
        position: 'right',
        axisLabel: { color: '#ddd' },
        axisLine: { lineStyle: { color: '#444' } },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '平均费用',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        data: [8643.01, 4326.89, 2078.59, 1281.25, 1946.05, 310.29, 64.40],
        lineStyle: { color: '#4ECDC4', width: 3 },
        itemStyle: { color: '#4ECDC4', borderWidth: 2, borderColor: '#fff' },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0)' }
          ])
        },
        // 鼠标悬停时放大标记 + 阴影效果
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(78, 205, 196, 0.8)' }
        }
      },
      {
        //（0 = 左轴，1 = 右轴）
        name: '患者数量',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [1283, 480, 3211, 1010, 383, 7232, 2114],
        lineStyle: { color: '#FF6B6B', width: 3, type: 'dashed' },
        itemStyle: { color: '#FF6B6B', borderWidth: 2, borderColor: '#fff' },
        symbol: 'diamond',
        symbolSize: 8,
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(255, 107, 107, 0.8)' }
        }
      }
    ]
    
  }

  myCChart.setOption(option)
  window.itemOneInstance = myCChart//组件内部的图表实例暴露到浏览器全局,方便调试
  emit('register', myCChart) // 触发自定义事件，向父组件传递实例
  window.addEventListener('resize', () => myCChart.resize())
}

onMounted(() => initChart())//必须在 onMounted 中初始化：Vue 组件挂载完成后，chart.value 才会指向真实 DOM 元素，否则 ECharts 无法找到容器
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 280px; 
  margin-top: 10px;
  border-radius: 6px;
  padding: 8px;
}
h2 {
  height: .6rem;
  color: #fff;
  line-height: .6rem;
  font-size: 0.25rem;
  text-align: center;
  margin: 0;
  padding: 0 0 10px 0;
}
</style>