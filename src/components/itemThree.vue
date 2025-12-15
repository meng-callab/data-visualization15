
<template>
  <div>
    <h2>住院类型平均费用主要分布</h2>
    <button 
      class="toggle-btn"
      @click="toggleDataSource"
    >
      {{ isUsingLocalData ? '切换为接口加载' : '切换为本地数据' }}
    </button>
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios' 
const isUsingLocalData = ref(true) 
const chartData = reactive({//用于复杂类型
  legendData: [], 
  seriesData: []  
})


const localData = {
  legendData: ['转省外住院', '普通住院', '门诊慢性病', '特殊疾病门诊', '转省内住院', '生育住院', '普通门诊'],
  seriesData: [
    { value: 8643.01, name: '转省外住院', itemStyle: { color: '#9FA8DA' } },
    { value: 4326.89, name: '转省内住院', itemStyle: { color: '#A5D6A7' } },
    { value: 2078.59, name: '普通住院', itemStyle: { color: '#80CBC4' } },
    { value: 1281.25, name: '特殊疾病门诊', itemStyle: { color: '#81D4FA' } },
    { value: 1946.05, name: '生育住院', itemStyle: { color: '#F48FB1' } },
    { value: 310.29, name: '门诊慢性病', itemStyle: { color: '#FFE082' } },
    { value: 64.40, name: '普通门诊', itemStyle: { color: '#BDBDBD' } }
  ]
}


const chart = ref(null)
let myCChart = null


const fetchApiData = async () => {
  myCChart?.showLoading() // 显示加载动画
  try {

    const res = await axios.get('/three/data')
    const apiData = res.data.data.chartThree.chartData 
    return {
      legendData: apiData.map(item => item.name), 
      seriesData: apiData 
    }
  } catch (error) {
    console.error('接口请求失败：', error)
    alert('接口加载失败，自动切换为本地数据')
    return localData 
  } finally {
    myCChart?.hideLoading() 
  }
}


const initOrUpdateChart = (targetData) => {
 
  chartData.legendData = targetData.legendData
  chartData.seriesData = targetData.seriesData


  if (!myCChart && chart.value) {
    myCChart = echarts.init(chart.value)
    window.addEventListener('resize', () => myCChart?.resize())
  }

  const option = {
    legend: {
      orient: 'vertical',
      left: 15, 
      top: 'center',
      data: chartData.legendData,
      textStyle: { fontSize: 10, color: '#fff' },
      itemWidth: 10,
      itemHeight: 8
    },
    series: [
      {
        name: '费用分布',
        type: 'pie',
        radius: ['45%', '75%'],

        center: ['55%', '40%'], 
        itemStyle: {
          borderRadius: 6,
          borderWidth: 2,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
          animationDelay: (idx) => idx * 100
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            formatter: '{b} ({d}%)',
            fontSize: 10,
            color: '#A5D6A7'
          }
        },
        data: chartData.seriesData
      }
    ],
    tooltip: {
      trigger: 'item', 
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: { color: '#333' },
      formatter: function(params) {
        const inWan = (params.value / 10000).toFixed(2)
        return `<div style="font-size:12px">
                  <strong>${params.name}</strong><br/>
                  总费用：<span style="color:#e74c3c">¥${params.value.toLocaleString()}</span><br/>
                  约合：<span style="color:#3498db">${inWan}万元</span><br/>
                  占比：<span style="color:#2ecc71">${params.percent.toFixed(2)}%</span>
                </div>`
      }
    }
  }

  myCChart.setOption(option)
}


const toggleDataSource = async () => {
  isUsingLocalData.value = !isUsingLocalData.value
  const targetData = isUsingLocalData.value 
    ? localData 
    : await fetchApiData()
  initOrUpdateChart(targetData)
}


onMounted(() => {
  initOrUpdateChart(localData)
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 210px;
  margin-top: 5px; 
}
h2 {
  height: 0.6rem;
  color: #fff;
  line-height: 0.6rem;
  font-size: 0.25rem;
  text-align: center;
  margin: 0;
  padding-bottom: 5px; 
}
.toggle-btn {
  margin-left: 10px;
  padding: 4px 12px;
  font-size: 0.16rem;
  color: #08bfe0;
  background:#0378df; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.toggle-btn:hover {
  background: #0069bf;
}
</style>