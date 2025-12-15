<template>
  <div>
    <h2>医疗总费用与年龄的抽样关系</h2>
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import * as echarts from 'echarts'

// 1. 定义用于传递图表实例的事件
const emit = defineEmits(['register']) 
const chart = ref(null)
let myCChart = null // 保存图表实例引用

const initChart = () => {
  if (!chart.value) return
  myCChart = echarts.init(chart.value)
  
  const option = {
    legend: {
      data: ['儿童患者', '青年患者', '中年中老年患者', '老年患者'],
      top: 0, 
      textStyle: { color: '#ffffff' }, 
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '20%',
      top: '10%', 
      containLabel: true
    },
    xAxis: {
      name: '年龄',
      nameTextStyle: {  
        color: '#ffffff', 
        fontSize: 12
      },
      nameLocation: 'end',
      nameGap: 10, 
      type: 'value',
      min: 0,
      max: 90,
      axisLine: { lineStyle: { color: '#888888' } }, 
      axisLabel: { color: '#ffffff' }, 
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } } 
    },
    yAxis: {
      name: '医疗费用（元）',
      nameTextStyle: {  
        color: '#ffffff', 
        fontSize: 12
      },
      nameLocation: 'middle',
      nameGap: 40,
      type: 'value',
      min: 0,
      max: 20000,
      axisLine: { lineStyle: { color: '#888888' } }, 
      axisLabel: { 
        color: '#ffffff', 
        formatter: value => value >= 10000 ? `${(value/10000).toFixed(1)}万` : value
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } } 
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 50, 0.9)',
      borderColor: '#4facfe',
      textStyle: { color: '#ffffff' }, 
      formatter: params => {
        
        if (!params || params.length === 0) {
          return '暂无数据';
        }
        const param = params[0];
        //  校验 param.value 是否存在，避免直接访问 [0] [1] 报错
        const age = param.value?.[0] ?? '未知';
        const cost = param.value?.[1] !== undefined 
          ? `¥${param.value[1].toLocaleString()}` 
          : '未知';
        return `${param.seriesName}<br/>年龄：${age}岁<br/>费用：${cost}`;
      }
    },
    series: [
      {
        name: '儿童患者',
        type: 'scatter',
        symbolSize: 14,
        data: [[12, 4539.06], [6, 4259.71], [6, 4502.23], [2, 11703.17], [3, 18338.08], [13, 1429.69], [2, 3690.94],[3, 398.37],[5, 18417.99],[15, 1813.88]],
        itemStyle: { color: '#4facfe' },
        emphasis: { symbolSize: 20, itemStyle: { shadowBlur: 10 } }
      },
      {
        name: '青年患者',
        type: 'scatter',
        symbolSize: 14,
        data: [[29,13792.46],[32, 1670.55], [31, 2546.01], [32, 3533.38],[33, 2266.45],[34, 1036.73],[21, 167191.17],[22, 873.43], [34, 286.83], [20, 1532.77]],
        itemStyle: { color: '#00f2fe' },
        emphasis: { symbolSize: 20, itemStyle: { shadowBlur: 10 } }
      },
      {
        name: '中年中老年患者',
        type: 'scatter',
        symbolSize: 14,
        data: [[42, 8129.72],[45, 1805.82], [49, 1522.71],[38, 13290.86],[50, 1696.96],[49, 1281.19],[43, 2495.31],[45, 4549.96],[49, 7260.63],[50, 7273.57]    ],
        itemStyle: { color: '#00d2ff' },
        emphasis: { symbolSize: 20, itemStyle: { shadowBlur: 10 } }
      },
      {
        name: '老年患者',
        type: 'scatter',
        symbolSize: 14,
        data:[[91, 6641.21],[85, 588.31],[66, 14986.27],[66, 1098.47],[69, 365.24],[71, 74.89], [86, 103.36],[78, 369.37],[88, 564.94],[77, 252.19]
],
        itemStyle: { color: '#ff6b6b' },
        emphasis: { symbolSize: 20, itemStyle: { shadowBlur: 10 } }
      }
    ]
  }

  myCChart.setOption(option)
   //  图表初始化后，将实例传递给父组件
  emit('register', myCChart)
  window.addEventListener('resize', () => myCChart.resize())
}

onMounted(() => initChart())
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 280px;
  margin-top: 5px; 
  border-radius: 6px;
  padding: 10px;
}
h2 {
  height: .6rem;
  color: #ffffff; 
  line-height: .6rem;
  font-size: 0.25rem;
  text-align: center;
  margin: 0;
  padding: 0 0 5px 0; 
}
</style>