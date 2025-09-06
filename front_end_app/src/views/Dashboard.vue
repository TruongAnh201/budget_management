<template>
  <div class="dashboard-container">
    <div class="grid-container">
      <div class="grid-item"><VChart :option="chartOptions" autoresize /></div>
      <div class="grid-item"><VChart :option="chartOptions" autoresize /></div>
      <div class="grid-item"><VChart :option="chartOptions" autoresize /></div>
      <div class="grid-item"><VChart :option="chartOptions" autoresize /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted } from 'vue'

// 🧩 Import ECharts core và các thành phần cần dùng
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import spendingService from '@/services/spendingService.js';
import categoryService from '@/services/categoryService.js';

const spendingList = ref([]);
const categoryList = ref([]);
const barChartData = ref([]);

// 🧠 Đăng ký các thành phần vào ECharts
echarts.use([
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
])

// 📦 Import component VueECharts (chú ý lấy default export)
const VChart = defineAsyncComponent(() =>
  import('vue-echarts').then(mod => mod.default)
)
const fetchData = async () => {
  // lấy thông tin của spending
  const spendingResponse = await spendingService.spendingList();
  if (spendingResponse.status != 200) throw new Error('Failed to get data');
  spendingList.value = spendingResponse.data;

  // lấy thông tin chung category
  const categoryResponse = await categoryService.categoryList();
  if (categoryResponse.status != 200) throw new Error('Failed to get data');
  categoryList.value = categoryResponse.data;
  console.log('spending list : ',spendingList.value);
  console.log('category list : ',categoryList.value);
  // map thông tin cho bar chart.
}
const getCurrentSpendingList = () => {

}
onMounted(() => fetchData());

//bar chart
const chartOptions = ref({
  title: {
    text: 'Thống kê theo danh mục',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: [200, 300, 400, 500, 600, 550, 700],
      itemStyle: {
        color: '#409EFF'
      }
    }
  ]
})

</script>

<style scoped>
.dashboard-container {
  padding: 16px;
  box-sizing: border-box;
}

/* 2 columns equal width, 2 rows equal height */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  gap: 16px;
  height: 80vh;
}

/* mỗi grid-item là 1 container cho VChart */
.grid-item {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* đảm bảo VChart (hoặc component con) mở rộng đầy container */
.grid-item > * {
  flex: 1 1 auto;
  min-height: 180px;
  width: 100%;
  height: 100%;
}

/* Responsive: chuyển sang 1 cột khi màn hình nhỏ */
@media (max-width: 640px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    height: auto;
  }
}
</style>
