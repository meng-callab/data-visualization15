<template>
    <div>
      <header>
        <h1>基于山东省临市2016-2018年度医保数据——数据可视化分析的医疗报告</h1>
        <div class="dashboard-controls">
          <button @click="resetLinkage">重置联动</button>
          <button @click="simulateDataUpdate">模拟数据更新</button>
          <button @click="toggleLinkage">{{ linkageEnabled ? '禁用联动' : '启用联动' }}</button>
          <span class="status">已连接图表: {{ chartInstances.length }}个</span>
          <span class="status">最后交互: {{ lastInteraction }}</span>
        </div>
      </header>
      
      <!-- 大容器 -->
      <section class="container">
        <!--左容器-->
        <section class="itemLeft">
          <ItemPage><ItemOne @register="registerChart" /></ItemPage>
          <ItemPage><ItemTwo @register="registerChart" /></ItemPage>
          <ItemPage><ItemThree @register="registerChart" /></ItemPage>
        </section>
        
        <!--中容器-->
        <section class="itemCenter">
          <MapPage @register="registerChart" />
          <div class="interaction-log">
            <h3>交互记录</h3>
            <div class="log-content">
              <div v-for="(log, index) in interactionLogs" :key="index" class="log-item">
                {{ log }}
              </div>
            </div>
          </div>
        </section>
        
        <!--右容器-->
        <section class="itemRight"> 
          <ItemPage><ItemFour @register="registerChart" /></ItemPage>
          <ItemPage><ItemFive @register="registerChart" /></ItemPage>
          <ItemPage><ItemSix @register="registerChart" /></ItemPage>
        </section>
      </section>
    </div>
</template>

<script>
import ItemPage from "@/components/itemPage.vue";
import ItemOne from "@/components/itemOne.vue";
import ItemTwo from "@/components/itemTwo.vue";
import ItemThree from "@/components/itemThree.vue";
import ItemFour from "@/components/itemFour.vue";
import ItemFive from "@/components/itemFive.vue";
import ItemSix from "@/components/itemSix.vue";
import MapPage from "@/components/mapPage.vue";
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'HomePage',
  components: {
    ItemPage, ItemOne, ItemTwo, ItemThree, ItemFour, ItemFive, ItemSix, MapPage
  },

  setup() {
    const chartInstances = ref([]);
    const linkageEnabled = ref(true);
    const lastInteraction = ref('暂无');
    const interactionLogs = ref([]);
    let updateTimer = null;

    // 添加交互记录
    const addInteractionLog = (chartName, action, details) => {
      const time = new Date().toLocaleTimeString();
      const log = `[${time}] ${chartName}: ${action} ${details ? `- ${details}` : ''}`;
      interactionLogs.value.unshift(log);
      lastInteraction.value = log;
      
      // 只保留最近10条记录
      if (interactionLogs.value.length > 10) {
        interactionLogs.value.pop();
      }
    };

    // 子组件注册图表实例的方法
    const registerChart = (instance) => {
      if (!instance || chartInstances.value.includes(instance)) return;
      
      chartInstances.value.push(instance);
      
      // 获取图表名称（从组件类型推断）
      const chartNames = ['各住院类型分析', 'TOP10疾病费用', '住院类型分布', 
                         '医疗费用与年龄', '医院等级分布', '医保支出结构', '临沂市地图'];
      const chartName = chartNames[chartInstances.value.length - 1] || `图表${chartInstances.value.length}`;
      
      // 为每个图表添加详细的交互事件
      setupChartEvents(instance, chartName);
      
      addInteractionLog(chartName, '图表初始化完成', '已注册到联动系统');
    };

    // 设置图表事件监听
    const setupChartEvents = (chart, chartName) => {
      if (!chart) return;

   
      chart.on('click', (params) => {
        if (!linkageEnabled.value) return;
        
        addInteractionLog(chartName, '点击', `${params.name || params.seriesName}`);
        
        // 联动所有图表
        chartInstances.value.forEach(otherChart => {
          if (otherChart !== chart) {
            try {
              // 尝试根据名称或索引进行联动
              if (params.dataIndex !== undefined) {
                otherChart.dispatchAction({
                  type: 'highlight',
                  seriesIndex: 0,
                  dataIndex: params.dataIndex
                });
              }
              
              // 尝试显示tooltip
              otherChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.dataIndex || 0
              });
            } catch (error) {
              // 某些图表类型可能不支持某些action
            }
          }
        });
      });

      // 鼠标悬停事件
      chart.on('mouseover', (params) => {
        if (!linkageEnabled.value) return;
        
        // 悬停时显示tooltip联动
        chartInstances.value.forEach(otherChart => {
          if (otherChart !== chart && params.dataIndex !== undefined) {
            try {
              otherChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: params.dataIndex
              });
            } catch (error) {
              // 忽略错误
            }
          }
        });
      });

      // 3. 鼠标移出事件
      chart.on('globalout', () => {
        if (!linkageEnabled.value) return;
        
        // 鼠标移出时隐藏所有tooltip
        chartInstances.value.forEach(otherChart => {
          if (otherChart !== chart) {
            try {
              otherChart.dispatchAction({ type: 'hideTip' });
            } catch (error) {
              // 忽略错误
            }
          }
        });
      });

      // 4. 数据选中事件
      chart.on('selectchanged', (params) => {
        if (!linkageEnabled.value) return;
        
        const selectedNames = params.selected.map(item => item.name).join(', ');
        addInteractionLog(chartName, '数据选中', selectedNames || '无');
      });
    };

    // 重置所有联动状态
    const resetLinkage = () => {
      chartInstances.value.forEach(chart => {
        try {
          chart.dispatchAction({ type: 'downplay' });
          chart.dispatchAction({ type: 'hideTip' });
        } catch (error) {
          // 忽略错误
        }
      });
      addInteractionLog('系统', '重置联动', '所有图表状态已重置');
    };

    // 模拟异步数据更新（演示异步加载功能）
    const simulateDataUpdate = () => {
      addInteractionLog('系统', '开始模拟数据更新', '异步加载中...');
      
      // 模拟异步操作
      setTimeout(() => {
        if (chartInstances.value.length > 0) {
          // 随机选择一个图表进行数据更新
          const randomIndex = Math.floor(Math.random() * chartInstances.value.length);
          const chart = chartInstances.value[randomIndex];
          
          try {
            const option = chart.getOption();
            if (option.series && option.series[0]) {
              // 生成一些随机数据
              const newData = option.series[0].data.map(item => {
                if (typeof item === 'number') {
                  return item * (0.9 + Math.random() * 0.2);
                } else if (item && item.value) {
                  return { ...item, value: item.value * (0.9 + Math.random() * 0.2) };
                }
                return item;
              });
              
              chart.setOption({
                series: [{
                  ...option.series[0],
                  data: newData,
                  animationDuration: 1000,
                  animationEasing: 'cubicOut'
                }]
              });
              
              addInteractionLog(`图表${randomIndex + 1}`, '数据已更新', '模拟异步数据加载完成');
            }
          } catch (error) {
            console.log('数据更新失败:', error);
          }
        }
      }, 1500);
    };

    // 切换联动状态
    const toggleLinkage = () => {
      linkageEnabled.value = !linkageEnabled.value;
      addInteractionLog('系统', linkageEnabled.value ? '启用联动' : '禁用联动');
    };

    // 自动模拟定期数据更新（演示异步功能）
    const startAutoUpdate = () => {
      if (updateTimer) clearInterval(updateTimer);
      
      updateTimer = setInterval(() => {
        // 每30秒模拟一次数据更新
        if (chartInstances.value.length > 0 && Math.random() > 0.7) {
          simulateDataUpdate();
        }
      }, 30000);
    };

    // 初始化echarts连接
    const initEchartsConnection = () => {
      if (chartInstances.value.length > 0) {
        try {
          // 1. 基础连接
          echarts.connect(chartInstances.value);
          
          // 2. 添加组连接（将图表分组）
          const groupId = 'dashboard-charts';
          chartInstances.value.forEach((chart) => {
            chart.group = groupId;
          });
          
          addInteractionLog('系统', '图表联动已建立', `已连接${chartInstances.value.length}个图表`);
          
          // 3. 启动自动更新
          startAutoUpdate();
        } catch (error) {
          console.error('图表连接失败:', error);
        }
      }
    };

    const initHeightAdaptation = () => {

      const handleResize = () => {
        chartInstances.value.forEach(chart => {
          if (chart && !chart.isDisposed()) {
            chart.resize();
          }
        });
      };


      const container = document.querySelector('.container');
      if (container) {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        
        // 组件销毁时清理
        onUnmounted(() => {
          resizeObserver.disconnect();
        });
      }

      // 窗口resize监听
      window.addEventListener('resize', handleResize);
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });
    };

    onMounted(() => {
     
      setTimeout(() => {
        initEchartsConnection();
        initHeightAdaptation(); 
      }, 1000);
      

      document.addEventListener('keydown', handleKeyDown);
    });


    const handleKeyDown = (event) => {
      switch(event.key) {
        case 'r':
        case 'R':
          if (event.ctrlKey) {
            resetLinkage();
          }
          break;
        case 'l':
        case 'L':
          if (event.ctrlKey) {
            toggleLinkage();
          }
          break;
        case 'u':
        case 'U':
          if (event.ctrlKey) {
            simulateDataUpdate();
          }
          break;
      }
    };

    // 组件销毁时清理资源
    onUnmounted(() => {
      if (updateTimer) clearInterval(updateTimer);
      document.removeEventListener('keydown', handleKeyDown);
      
      // 清理图表实例
      chartInstances.value.forEach(chart => {
        try {
          chart.dispose();
        } catch (error) {
          // 忽略错误
        }
      });
      chartInstances.value = [];
    });

    return {
      chartInstances,
      linkageEnabled,
      lastInteraction,
      interactionLogs,
      registerChart,
      resetLinkage,
      simulateDataUpdate,
      toggleLinkage
    };
  }
};
</script>

<style lang="less">
header {
  height: 1rem; 
  width: 100%;
  background-color: rgba(0, 0, 255, .2);
  position: relative;
  
  h1 {
    font-size: 0.375rem; 
    color: #fff;
    text-align: center;
    line-height: 1rem; 
    margin: 0;
  }
  
  .dashboard-controls {
    position: absolute;
    top: 1.8px;
    right: 0.2rem;
    display: flex;
    align-items: center;
    gap: 0.1rem;
    
    button {
      padding: 0.03rem 0.08rem;
      background-color: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.12rem;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.25);
      }
      
      &:active {
        background-color: rgba(255, 255, 255, 0.35);
      }
    }
    
    .status {
      color: #4ecdc4;
      font-size: 0.11rem;
      margin-left: 0.15rem;
      background: rgba(0, 0, 0, 0.15);
      padding: 0.03rem 0.06rem;
      border-radius: 2px;
      white-space: nowrap;
    }
  }
}

.container {
  width: 100%;
  min-width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: .125rem .125rem 0;
  display: flex;
  /* 高度自适应核心1：基于视口高度，保留原有的宽度逻辑 */
  height: calc(100vh - 1.25rem); 
  min-height: 600px; /* 兜底最小高度，避免小屏塌陷 */
  margin-bottom: 0.25rem;
  
  .itemLeft,
  .itemRight {
    
    flex: 3.5;
    display: flex;
    flex-direction: column;
    gap: 0.125rem; 
    border: 1px solid rgba(8, 230, 218, 0.3);
  
    height: 100%;
   
    > div {
      flex: 1; 
      min-height: 180px; 
      height: 100%; 
    }
  }
  
  .itemCenter {
 
    flex: 6;
    
    height: 100%; 
    min-height: 400px; 
    border: 1px solid rgba(8, 230, 218, 0.3);
    padding: 0.125rem;
   margin: 3.8px;
    display: flex;
    flex-direction: column;
    

    > div:first-child { 
      flex: 1; 
      min-height: 250px; 
      height: 100%;
    }
    
    .interaction-log {
      flex: 0 1 2.5rem; 
      max-height: 300px; 
      margin-top: 0.1rem;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      padding: 0.08rem;
      overflow: hidden;
     border: 1px solid rgba(8, 230, 218, 0.3); 
      h3 {
        color: #fff;
        font-size: 0.14rem;
        margin: 0 0 0.03rem 0;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        padding-bottom: 0.03rem;
      }
      
      .log-content {
        height: calc(100% - 0.25rem);
        overflow-y: auto;
        padding: 0.03rem;
        
        .log-item {
          color: #a9dfbf;
          font-size: 0.10rem;
          padding: 0.02rem 0.04rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          word-break: break-word;
          line-height: 1.2;
          
          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }
    }
  }
}


.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 180px;
}


.interaction-log .log-content::-webkit-scrollbar {
  width: 3px;
}

.interaction-log .log-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.interaction-log .log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1.5px;
}

.interaction-log .log-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}


@media screen and (max-width: 1600px) {
  .dashboard-controls {
    flex-wrap: wrap;
    justify-content: flex-end;
    
    .status {
      display: none;
    }
  }
}
</style>