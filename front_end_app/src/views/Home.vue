<template>
    <div class="home-container">
        <div class="month-select">
            <span @click="goToPrevMonth">
                <LeftOutlined />
            </span>
            <a-date-picker v-model:value="selectMonth" picker="month" />
            <span @click="goToNextMonth">
                <RightOutlined />
            </span>
        </div>

        <div class="calendar">
            <!-- Header -->
            <div class="calendar-header">
                <div v-for="day in weekDays" :key="day" class="calendar-cell header">
                   <p class="header-day">
                     {{ day }}
                   </p>
                </div>
            </div>

            <!-- Dates -->
            <div class="calendar-grid">
                <!-- Padding for starting day -->
                <div v-for="n in startPadding" :key="'pad-' + n" class="calendar-cell empty"></div>

                <!-- Actual days -->
                <div v-for="day in daysInMonth" :key="'day-' + day" class="calendar-cell">
                    <div class="cell-actual">
                        <p class="day-label" @click="showPopupSpending(day)">{{ day }}</p>
                        <div class="info">
                            <span class="plus">+ 0</span>
                            <span class="detail-btn">Chi tiết</span>
                            <span class="minus">-
                                {{ new Intl.NumberFormat('vi-VN').format(totalByDate[day.toString().padStart(2, "0")] ?? 0) }}</span>
                            <span @click="showSpendingList(day)" class="detail-btn">Chi tiết</span>
                        </div>
                    </div>
                </div>

                <!-- Padding for ending day -->
                <div v-for="n in endPadding" :key="'pad-end-' + n" class="calendar-cell empty">

                </div>

            </div>
        </div>
    </div>

    <!-- create new -->
    <a-modal v-model:open="isCreateModalOpen" title="Tạo mới chi tiêu" @ok="handleSubmitCreate"
        :style="{ top: '150px' }">
        <div>
            <a-form layout="vertical">
                <a-form-item label="Danh mục">
                    <a-select v-model:value="formCreate.category_id" placeholder="Chọn danh mục" style="width: 100%">
                        <a-select-option v-for="item in categories" :key="item.id" :value="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <!-- Select Icon -->
                <a-form-item label="Đã chi">
                    <a-input v-model:value="formCreate.spent_money" type="number" />
                </a-form-item>
                <a-form-item label="Ghi chú">
                    <a-input v-model:value="formCreate.note" type="text" />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
    <!-- show detail spending  -->
    <a-modal v-model:open="isShowSpending" title="Chi tiết chi tiêu" width="1000px" :style="{ top: '170px' }"
        :footer='null' >
        <a-table :dataSource="currentDayData" :columns="SPENDING_CHILD_COLUMNS" />
    </a-modal>


</template>

<script setup>
import {
    startOfMonth,
    endOfMonth,
    getDate,
    eachDayOfInterval,
    getDay,
    getMonth,
    getYear,
    format,
    endOfDay,
    parse,

} from 'date-fns'
import {
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons-vue';
import { ref, onMounted, watch } from 'vue';
import dayjs from 'dayjs'

import spendingService from '@/services/spendingService.js';
import categoryService from '@/services/categoryService.js';
import { authStore } from '@/stores/authStore.js';
// import { SPENDING_CHILD_COLUMNS } from "@/constants/ColumnTable.ts";

const SPENDING_CHILD_COLUMNS = [
    {
        title: 'Danh mục',
        dataIndex: 'category_name',
        key: 'category_name',
    },
    {
        title: 'Số tiền đã chi',
        dataIndex: 'spent_money',
        key: 'spent_money',
    },
    {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
    },
    {
        title: 'Tạo lúc',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Cập nhật lần cuối',
        dataIndex: 'updated_at',
        key: 'updated_at',
    }
];

// Tuần bắt đầu từ Thứ 2 → Chủ nhật
const weekDays = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật']

const selectMonth = ref(dayjs()) // dayjs object ( today)
const daysInMonth = ref([])
const startPadding = ref(0)
const endPadding = ref(0)
const currentYear = ref(null);
const currentMonth = ref(null);
const spendingList = ref([]);
const totalByDate = ref([]);
const isCreateModalOpen = ref(false);
const categories = ref([]);
const formCreate = ref({
    category_id: null,
    spent_money: 0,
    note: '',
});
const currentDay = ref(null);
const isShowSpending = ref(false);
const currentDayData = ref([]);

const showSpendingList = async (targetDay) => {
    // const response = await spendingService.spendingList();
    // if (response.status != 200) {
    //     let description = "Lấy dữ liệu chi tiêu không thành công !"
    //     window.$notify({ description });
    // }

    let rs = [];
    spendingList.value.forEach((item) => {
        const date = parse(item.spend_date, "dd-MM-yyyy", new Date());
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Tháng 0-11
        const day = date.getDate();
        if (year == currentYear.value && month == currentMonth.value && day == targetDay) {
            console.log('day ', day);

            console.log('targetDay ', targetDay);

            rs.push({
                ...item,
                category_name: categories.value.find(cat => cat.id === item.category_id)?.name || 'Không rõ'
            });
        }

    });
    currentDayData.value = rs;
    console.log('curren day data: ', currentDayData.value);
    isShowSpending.value = true;
}
const calculateCalendar = (dateObj) => {
    if (dateObj === null) {
        selectMonth.value = dayjs();
        return;
    };
    const start = startOfMonth(dateObj.toDate())
    const end = endOfMonth(dateObj.toDate())

    // Các ngày trong tháng
    const allDays = eachDayOfInterval({ start, end })
    daysInMonth.value = allDays.map((d) => getDate(d)) // chỉ lấy ngày

    // Tính padding đầu
    let startDay = getDay(start) // Chủ nhật = 0
    startDay = startDay === 0 ? 6 : startDay - 1 // Chủ nhật thành 6 ( theo mảng của các thứ chủ nhật là phần tử thứ 6)
    startPadding.value = startDay

    // Tính padding cuối
    let endDay = getDay(end)
    endDay = endDay === 0 ? 7 : endDay
    endPadding.value = 7 - endDay

    currentMonth.value = getMonth(dateObj) + 1;
    currentYear.value = getYear(dateObj);
}
const goToPrevMonth = () => {
    selectMonth.value = selectMonth.value.subtract(1, 'month');
}
const goToNextMonth = () => {
    selectMonth.value = selectMonth.value.add(1, 'month');
}
const showPopupSpending = (day) => {
    currentDay.value = day;
    isCreateModalOpen.value = true;
}
const fetchInfo = async () => {
    const categoryListRes = await categoryService.categoryList();
    categories.value = categoryListRes.data;
}
const fetchSpendingByMonthData = async () => {

    const response = await spendingService.spendingList();
    if (response.status != 200) {
        let description = "Lấy dữ liệu chi tiêu không thành công !"
        window.$notify({ description });
    }
    spendingList.value = response.data; // Gán dữ liệu vào inner

    let result = {};
    spendingList.value.forEach((item) => {
        const date = parse(item.spend_date, "dd-MM-yyyy", new Date());
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Tháng 0-11
        const day = date.getDate().toString().padStart(2, '0');
        if (!result[year]) {
            result[year] = {}
        }

        if (!result[year][month]) {
            result[year][month] = {}
        }

        if (!result[year][month][day]) {
            result[year][month][day] = 0
        }

        result[year][month][day] += item.spent_money
    });
    totalByDate.value = result[currentYear.value][currentMonth.value.toString().padStart(2, "0")] ?? []

}
const handleSubmitCreate = async () => {

    const auth = authStore();
    formCreate.value.user_id = auth.user.id;
    formCreate.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    formCreate.value.created_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    formCreate.value.spend_date = currentDay.value.toString().padStart(2, '0') + "-" + currentMonth.value.toString().padStart(2, '0') + "-" + currentYear.value;

    formCreate.value.spent_money = Number(formCreate.value.spent_money);
    let data = JSON.stringify(formCreate.value);
    const response = await spendingService.spendingCreate(data);
    if (response.status != 201) throw new Error('Failed to save data');



    resetForm();
    isCreateModalOpen.value = false;
    let description = "Thêm mới thành công!"
    window.$notify({ description });
    fetchSpendingByMonthData();
}

const resetForm = () => {
    formCreate.value = {
        category_id: null,
        spent_money: 0,
        note: '',
        spend_date: ""
    };
};


onMounted(() => {
    calculateCalendar(selectMonth.value),
    fetchSpendingByMonthData(),
    fetchInfo()
})

watch(selectMonth, (newDate, oldDate) => {
    calculateCalendar(newDate),
        fetchSpendingByMonthData()
})

</script>

<style scoped>
.home-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.month-select {
    /* margin: 15px 0px; */
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    /* căn giữa theo chiều dọc */
    justify-content: center;
    /* căn giữa theo chiều ngang */
    gap: 10px;
    /* khoảng cách giữa các phần tử */

}

.month-select span {
    cursor: pointer;
}

.calendar {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.calendar-header,
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.header {
    text-align: center;
    margin: auto;
}
.header .header-day{
    margin: 0px;
    padding: 15px 0px;
}

.calendar-cell {
    border: 1px solid #ccc;
    padding: 6px;
    /* height: 100px; */
    box-sizing: border-box;
    min-width: 130px;
}

.cell-actual {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.day-label {
    font-weight: bold;
    flex: 0 0 60%;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
}

.info {
    display: grid;
    grid-template-columns: auto auto;
    /* flex-direction: column;
    flex: 1; */
}

.info .detail-btn {
    font-size: 12px;
    text-align: center;
    cursor: pointer;
}

.plus {
    color: green;
    font-size: 12px;
}

.minus {
    color: red;
    font-size: 12px;
}

.cell-actual p {
    margin: 0;
    padding: 10px 0px;
    font-weight: 600;
    font-size: 1.3rem;
}

/* .cell-actual .info{

} */
.header {
    font-weight: bold;
    background-color: #f2f2f2;
}

.empty {
    background-color: #fafafa;
}

.model-create {
    width: 900px;
}
</style>