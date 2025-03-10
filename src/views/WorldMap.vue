<template>
    <div ref="mapContainer" class="world-map"></div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'
  import worldJSON from '@/assets/maps/world.json' // 调整路径匹配你的实际位置
  
  const mapContainer = ref(null)
  
  // 注册地图数据
  echarts.registerMap('world', worldJSON)
  
  onMounted(() => {
    const chart = echarts.init(mapContainer.value)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      geo: {
        map: 'world',
        roam: true, // 开启拖拽和缩放
        label: {
          show: true, // 显示国家名称
          fontSize: 10
        },
        itemStyle: {
          areaColor: '#E6F7FF', // 区域颜色
          borderColor: '#1890FF' // 边界线颜色
        },
        emphasis: {
          itemStyle: {
            areaColor: '#91D5FF' // 悬停颜色
          }
        }
      }
    }
  
    chart.setOption(option)
  })
  </script>
  
  <style scoped>
  .world-map {
    width: 100%;
    height: 600px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  </style>