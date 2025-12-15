
<template>
  <div>
    <h2 class="chart-title">医保支出TOP3地区结构分析</h2>
    <div class="chart-legend">
      <div class="legend-item" v-for="(item, index) in legendData" :key="index">
        <span class="legend-color" :style="{ backgroundColor: colors[index] }"></span>
        <span class="legend-text">{{ item }}</span>
      </div>
    </div>
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const emit = defineEmits(['register']) 
const chart = ref(null)
let myCChart = null 
let resizeChart = null 


const baseBlueColors = [
  '#1a365d', 
  '#2c5282', 
  '#3182ce', 
  '#63b3ed'  
];


const colors = ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6'];
const legendData = ['转省外住院', '普通住院', '门诊慢性病', '特殊疾病门诊']

const initChart = () => {
  if (!chart.value) return
  myCChart = echarts.init(chart.value)

  const data = [
    {
      name: '医保支出',
      children: [
        {
          name: '转省外住院',
          value: 11085000,
          children: [
            { name: '兰山区', value: 5542500, children: [{ name: '主动脉弓狭窄', value: 2400000 }, { name: '恶性肿瘤维持性化疗', value: 1800000 }, { name: '疑难重症', value: 1342500 }] },
            { name: '罗庄区', value: 2771250, children: [{ name: '肿瘤疾病', value: 1200000 }, { name: '骨科疾病', value: 950000 }, { name: '其他', value: 621250 }] },
            { name: '平邑县', value: 2771250, children: [{ name: '心血管疾病', value: 1150000 }, { name: '神经系统疾病', value: 920000 }, { name: '其他', value: 701250 }] }
          ]
        },
        {
          name: '普通住院',
          value: 6670000,
          children: [
            { name: '兰山区', value: 3668500, children: [{ name: '呼吸系统疾病', value: 1350000 }, { name: '消化系统疾病', value: 1150000 }, { name: '外伤', value: 850000 }, { name: '其他', value: 318500 }] },
            { name: '罗庄区', value: 1667500, children: [{ name: '慢性疾病', value: 750000 }, { name: '急性感染', value: 520000 }, { name: '妇产科疾病', value: 397500 }] },
            { name: '平邑县', value: 1334000, children: [{ name: '常见疾病', value: 850000 }, { name: '急诊处理', value: 484000 }] }
          ]
        },
        {
          name: '门诊慢性病',
          value: 2244000,
          children: [
            { name: '兰山区', value: 1234200, children: [{ name: '高血压', value: 480000 }, { name: '糖尿病', value: 420000 }, { name: '冠心病', value: 240000 }, { name: '其他慢性病', value: 94200 }] },
            { name: '罗庄区', value: 561000, children: [{ name: '高血压', value: 220000 }, { name: '糖尿病', value: 190000 }, { name: '冠心病', value: 100000 }, { name: '其他慢性病', value: 51000 }] },
            { name: '平邑县', value: 448800, children: [{ name: '高血压', value: 180000 }, { name: '糖尿病', value: 140000 }, { name: '冠心病', value: 80000 }, { name: '其他慢性病', value: 48800 }] }
          ]
        },
        {
          name: '特殊疾病门诊',
          value: 1294000,
          children: [
            { name: '兰山区', value: 711700, children: [{ name: '血液疾病', value: 250000 }, { name: '免疫系统疾病', value: 210000 }, { name: '精神类疾病', value: 160000 }, { name: '其他特殊疾病', value: 91700 }] },
            { name: '罗庄区', value: 323500, children: [{ name: '血液疾病', value: 110000 }, { name: '免疫系统疾病', value: 95000 }, { name: '精神类疾病', value: 70000 }, { name: '其他特殊疾病', value: 48500 }] },
            { name: '平邑县', value: 258800, children: [{ name: '血液疾病', value: 90000 }, { name: '免疫系统疾病', value: 75000 }, { name: '精神类疾病', value: 50000 }, { name: '其他特殊疾病', value: 43800 }] }
          ]
        }
      ]
    }
  ]

  const option = {
    tooltip: {
      trigger: 'item', 
      formatter: ({ name, value }) => {
        const total = 11085000 + 6670000 + 2244000 + 1294000
        const rate = ((value / total) * 100).toFixed(2)
        return `${name}<br/>金额: ${value.toLocaleString()}元<br/>占比: ${rate}%`
      },
     
      backgroundColor: 'rgba(26, 54, 93, 0.9)',
      borderColor: '#63b3ed',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
       // 自定义tooltip位置，强制显示在上方
      position: function (point, params, dom, rect, size) {
        // point：鼠标点击/悬浮的坐标 [x, y]
        // size：tooltip的尺寸 { width, height }
        return [
          point[0] - size.contentSize[0] / 2, // 水平居中
          point[1] - size.contentSize[1]  
        ];
      },
      
    },
    series: {
      type: 'sunburst',
      data: data,
      radius: [0, '80%'],
      sort: 'desc', 
      levels: [
        {
          // 最外层基础圈层
          itemStyle: {
            borderRadius: 12,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 2,
            color: baseBlueColors[0],
            shadowColor: 'rgba(99, 179, 237, 0.3)',
            shadowBlur: 8
          }
        },
        {
          r0: '0%',
          r: '25%',
          label: {
            show: true,
            position: 'outside',
            rotate: 0,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOffsetX: 1,
            shadowOffsetY: 1
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            color: baseBlueColors[1],
            shadowColor: 'rgba(99, 179, 237, 0.4)',
            shadowBlur: 6
          }
        },
        {
          r0: '25%',
          r: '50%',
          label: {
            show: true,
            rotate: 'radial',
            fontSize: 12,
            color: '#ffffff',
            shadowColor: 'rgba(0,0,0,0.15)',
            shadowOffsetX: 1,
            shadowOffsetY: 1
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            color: baseBlueColors[2],
            shadowColor: 'rgba(99, 179, 237, 0.3)',
            shadowBlur: 4
          }
        },
        {
          r0: '50%',
          r: '75%',
          label: { show: false },
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            color: baseBlueColors[3],
            shadowColor: 'rgba(99, 179, 237, 0.2)',
            shadowBlur: 2
          }
        }
      ],
      label: {
        minAngle: 15, 
        overflow: 'truncate',
        width: 70
      },
      emphasis: {
        focus: 'ancestor',
        label: {
          show: true,
          fontWeight: 'bold',
          color: '#ffffff'
        },
        itemStyle: {
          borderRadius: 10,
          brightness: 0.15,
          shadowBlur: 12,
          shadowColor: 'rgba(99, 179, 237, 0.6)'
        }
      },
      
      itemStyle: {
        color: (params) => {
          const level1Node = params.data.path?.[1];
          if (!level1Node) return baseBlueColors[0]; 
          const level1Name = level1Node.name;
          const index = legendData.findIndex(item => item === level1Name);
          return index > -1 ? colors[index] : baseBlueColors[Math.min(params.level, 3)];
        }
      }
    }
  }

  myCChart.setOption(option)
  emit('register', myCChart)

  resizeChart = () => {
    if (myCChart) myCChart.resize()
  }
  window.addEventListener('resize', resizeChart)
}

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (resizeChart) window.removeEventListener('resize', resizeChart)
  if (myCChart) myCChart.dispose()
  myCChart = null
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 180px;
  margin-top: 0px; 
  margin-bottom: 5px; 
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  top: -5px; 

  background: linear-gradient(135deg, rgba(10, 30, 60, 0.1), rgba(15, 50, 90, 0.05));
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 5px 0; 
  padding: 8px 12px;

  background: rgba(26, 54, 93, 0.15); 
  border-radius: 6px;
  border: 1px solid rgba(99, 179, 237, 0.2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.18rem;
  color: #e0f2fe;
  font-family: 'Microsoft YaHei', sans-serif;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.legend-text {
  white-space: nowrap;
}

.chart-title {
  height: 0.6rem;
  color: #e0f2fe;
  line-height: 0.6rem;
  font-size: 0.25rem;
  text-align: center;
  margin-bottom: 0px; 
  margin-top: 0;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(99, 179, 237, 0.3);
}
</style>