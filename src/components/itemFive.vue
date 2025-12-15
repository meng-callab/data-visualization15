<template>
  <div>
    <h2>各年龄段和整体在不同等级医院的就医分布</h2>
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue' 
import * as echarts from 'echarts'

const emit = defineEmits(['register']) 
const chart = ref(null)
let myCChart = null // 保存图表实例引用

const initChart = () => {
  if (!chart.value) return
  myCChart = echarts.init(chart.value)
  
const option = {
  legend: {
    data: ['三级医院', '二级医院', '一级医院'],
    right: '5%',
    top: '8%', 
    orient: 'vertical',
    textStyle: { 
      color: '#ffffff',
      fontSize: 12,
      fontFamily: 'Microsoft YaHei, sans-serif'
    },
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 15,
    icon: 'circle'
  },
  
  radar: {
    center: ['45%', '45%'], 
    radius: '65%',
    shape: 'polygon',
    splitNumber: 4,
    
    indicator: [
      { name: '0-18岁', max: 5000 },
      { name: '19-35岁', max: 5000 },
      { name: '36-65岁', max: 5000 },
      { name: '65岁以上', max: 5000 },
      { name: '总计', max: 5000 },
    ],
    
    axisLine: { 
      show: true,
      lineStyle: { 
        color: 'rgba(255,255,255,0.25)',
        width: 1,
        type: 'solid'
      } 
    },
    
    splitLine: { 
      lineStyle: { 
        color: 'rgba(255,255,255,0.1)',
        width: 1,
        type: 'solid'
      } 
    },
    
    splitArea: {
      show: true,
      areaStyle: { 
        color: [
          'rgba(255,255,255,0.03)',
          'rgba(255,255,255,0.01)',
          'rgba(255,255,255,0.03)',
          'rgba(255,255,255,0.01)'
        ]
      }
    },
    
    name: {
      textStyle: {
        color: '#ffffff', 
        fontSize: 12,
        fontWeight: 'normal',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: [4, 8],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    }
  },
  
  series: [
    {
      name: '医院等级分布',
      type: 'radar',
      smooth: 0.3,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 2.5,
        opacity: 0.9
      },
      
      data: [
        {
          value: [501, 384, 1357, 672, 2914],
          name: '三级医院',
          lineStyle: { 
            color: '#FF9AA2', 
            width: 2.5,
            shadowBlur: 6,
            shadowColor: 'rgba(255, 154, 162, 0.5)'
          },
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 154, 162, 0.3)' },
              { offset: 1, color: 'rgba(255, 154, 162, 0.05)' }
            ])
          },
          itemStyle: { 
            color: '#FFFFFF',
            borderColor: '#FF9AA2',
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(255, 154, 162, 0.3)'
          },
          symbol: 'circle',
          symbolSize: 9
        },
        {
          value: [643, 600, 2263, 1484, 4990],
          name: '二级医院',
          lineStyle: { 
            color: '#7FDBDA', 
            width: 2.5,
            shadowBlur: 6,
            shadowColor: 'rgba(127, 219, 218, 0.5)'
          },
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(127, 219, 218, 0.3)' },
              { offset: 1, color: 'rgba(127, 219, 218, 0.05)' }
            ])
          },
          itemStyle: { 
            color: '#FFFFFF',
            borderColor: '#7FDBDA',
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(127, 219, 218, 0.3)'
          },
          symbol: 'circle',
          symbolSize: 9
        },
        {
          value: [311, 208, 1105, 1099, 2723],
          name: '一级医院',
          lineStyle: { 
            color: '#B5B9FF', 
            width: 2.5,
            shadowBlur: 6,
            shadowColor: 'rgba(181, 185, 255, 0.5)'
          },
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(181, 185, 255, 0.3)' },
              { offset: 1, color: 'rgba(181, 185, 255, 0.05)' }
            ])
          },
          itemStyle: { 
            color: '#FFFFFF',
            borderColor: '#B5B9FF',
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(181, 185, 255, 0.3)'
          },
          symbol: 'circle',
          symbolSize: 9
        }
      ],
      
      emphasis: {
        lineStyle: {
          width: 3.5,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        itemStyle: {
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        areaStyle: {
          opacity: 0.4
        }
      }
    }
  ],
  
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff', 
      fontSize: 12
    },
    formatter: (params) => {
      const ageRanges = ['0-18岁', '19-35岁', '36-65岁', '65岁以上', '总计'];
      const seriesName = params.seriesName;
      const ageRange = ageRanges[params.dataIndex];
      const value = params.value[params.dataIndex];
      
      let color = '#7FDBDA'; 
      if (seriesName.includes('三级')) color = '#FF9AA2';
      if (seriesName.includes('一级')) color = '#B5B9FF';
      
      if (params.dataIndex === 4) {
        return `
          <div style="font-weight: 600; color: ${color}; margin-bottom: 6px;">
            ${seriesName}
          </div>
          <div style="color: #ffffff; padding-left: 8px;">
            <span style="color: ${color}">●</span> 患者总数：<span style="color: #ffffff; font-weight: 600;">${value}人</span>
          </div>
        `;
      }
      return `
        <div style="font-weight: 600; color: ${color}; margin-bottom: 6px;">
          ${seriesName}
        </div>
        <div style="color: #ffffff; padding-left: 8px;">
          <span style="color: ${color}">●</span> ${ageRange}：<span style="color: #ffffff; font-weight: 600;">${value}人</span>
        </div>
      `;
    }
  },
  
  // 动画效果
  animation: true,
  animationDuration: 800,
  animationEasing: 'cubicOut'
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