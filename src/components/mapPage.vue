<template>
  <div class="mapshandonglinyishi" id="mapshandonglinyishi">
    <h2>图表6</h2>
    <div class="chart">图表的容器</div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, inject, defineEmits  } from "vue";

const emit = defineEmits(['register']);  
const $echarts = inject("echarts");
const mapData = reactive({});

async function getState() {
  const response = await axios.get("http://localhost:8080/map/shandonglinyishi.geojson");
  Object.assign(mapData, response.data);
}

onMounted(async () => {
  await getState();
  $echarts.registerMap("shandonglinyishi", mapData);
  
  const myCharts = $echarts.init(document.getElementById("mapshandonglinyishi"));
const initialData = [
        { name: "兰山区", value: [118.35, 35.05, 5751] },
        { name: "罗庄区", value: [118.46, 34.90, 2517] },
        { name: "平邑县", value: [117.63, 35.49, 1789] },
          { name: "莒南县", value: [118.83, 35.17, 722] },
          { name: "市本级", value: [118.33, 35.06, 638] },
          { name: "临沭县", value: [118.73, 34.87, 521] },
          { name: "沂水县", value: [118.64, 35.79, 455] },
          { name: "郯城县", value: [118.36, 34.61, 367] },
          { name: "兰陵县", value: [118.03, 34.84, 347] },
          { name: "费县", value: [117.97, 35.26, 284] },
          { name: "沂南县", value: [118.47, 35.54, 258] },
          { name: "平邑镇", value: [117.63, 35.49, 117] },
          { name: "蒙阴县", value: [117.95, 35.70, 110] }
  ];
  myCharts.setOption({
    geo: {
      map: "shandonglinyishi",
      left: "10%", 
      top: "15%",  
      right: "10%",
      bottom: "10%",
      itemStyle: {
        areaColor: "#cce7ff", 
        borderColor: "#2f80ed", 
        borderWidth: 1.5, 
        shadowColor: "rgba(47, 128, 237, 0.2)", 
        shadowBlur: 15, 
        emphasis: {
          focus: "self",
          areaColor: "#b3d8fc", 
          borderColor: "#1d71d8"
        }
      }
    },
    tooltip: {
      trigger: "item",
    
      backgroundColor: "rgba(255, 255, 255, 0.9)", 
      borderColor: "#e6e6e6",
      borderWidth: 1,
      padding: [10, 15],
      textStyle: { color: "#1d2129", fontSize: 12 },
   
    formatter: (params) => {
        // params.value[2] 就是医保人数，直接取数显示
        const peopleCount = params.value?.[2] || 0;
        return `<div style="text-align: left;">
          <div style="font-weight: bold; color: #d92d20; margin-bottom: 4px;">${params.name}</div>
          <div style="color: #4e5969;">医保参保人数：<span style="font-size: 14px; color: #1d2129;">${peopleCount.toLocaleString()}</span> 人</div>
        </div>`;
      }
    },
    title: {
      text: "市区医保数据人数的分布情况",
      left: "center", 
      top: "2%", 
      textStyle: {
        color: "#ffffff", 
        fontSize: 18, 
        textShadowBlur: 5,
        textShadowColor: "rgba(0, 0, 0, 0.1)" 
      }
    },
    visualMap: {
      type: "continuous",
      min: 100,
      max: 6000,
      calculable: true,
      
      left: "5%", 
      bottom: "5%", 
      itemWidth: 15, 
      itemHeight: 120, 
      inRange: { 
       
        color: ["#e8f4fd", "#b7eb8f", "#ffd591"] 
      },
      textStyle: {
        color: "#ffffff", 
        fontSize: 11
      },
     
      text: ["高", "低"], 
      textGap: 10
    },
    series: [
      {
        type: "scatter",
        coordinateSystem: "geo",
       
        symbolSize: (value) => { 
          return Math.sqrt(value[2]) / 5 + 5; // 数值越大，散点越大
        },
        itemStyle: {
          color: "#0d3c7a ",
          opacity: 0.8,
          emphasis: {
            color: "#d92d20", 
            shadowBlur: 10,
            shadowColor: "rgba(245, 63, 63, 0.3)"
          }
        },
        
        data: initialData,
     
        animationDuration: 1500,  
        animationEasing: 'elasticOut',  // 弹性缓动效果
        animationDelay: (idx) => idx * 100  // 数据点依次动画
      }
    ]
  });

//模拟异步数据更新（每5秒刷新一次）
  setInterval(() => {
    const updatedData = initialData.map(item => ({
      ...item,
      // 随机微调医保人数（±5%），模拟实时数据变化
      value: [
        item.value[0],
        item.value[1],
        Math.round(item.value[2] * (0.95 + Math.random() * 0.1))
      ]
    }));
    // 更新数据并添加过渡动画
    myCharts.setOption({
      series: [{
        data: updatedData,
      
        animationDuration: 800,
        animationEasingUpdate: 'cubicOut'
      }]
    });
  }, 5000);
  myCharts.on('click', (params) => {
    console.log('地图点击事件：', {
      区域: params.name,
      医保人数: params.value?.[2] || '未知',
      坐标: params.value?.slice(0, 2) || []
    });
  
  });

  emit('register', myCharts);  

  const handleResize = () => myCharts.resize();
  window.addEventListener("resize", handleResize);
});
</script>

<style>
.mapshandonglinyishi {
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  padding: 10px;
}

.mapshandonglinyishi h2 {
  margin: 0 0 10px 0;
  color: #1d2129;
  font-size: 16px;
  text-align: center;
}
.mapshandonglinyishi .chart {
  width: 100%;
  height: calc(100% - 40px);
}
</style>