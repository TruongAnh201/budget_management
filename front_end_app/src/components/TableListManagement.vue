<template>
    <a-table :columns="columns" :data-source="data" class="small-table">
        <!-- co the bo qua phan nay neu khong can custom header
            generate dua tren so luong  phan tu giong for
        -->
        <template #headerCell="{ column }">
            <template v-if="column.key === 'first_name'">
                <span>
                    <smile-outlined />
                    Name :)
                </span>
            </template>
        </template>

        <!-- body -->
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'first_name'">
                <a>
                    <span>-> </span>{{  record.last_name }}
                </a>
            </template>
            <template v-else-if="column.key === 'action'">
                <span class="wrap-button">
                    <a-button type="primary" size="small" class="btn" @click="handleEdit(record)"><EditOutlined/></a-button>
                    <a-button type="primary" danger size="small" class="btn" @click="handleDelete(record.id)"><DeleteOutlined/></a-button>
                </span>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import {
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons-vue';
const props = defineProps({
    columns: Array,
    data: Array
});
const emit = defineEmits(["edit","delete"]);
const handleEdit = (record) => {
    console.log('emit handle edit:', record);
    emit("edit", record); // Truyền record lên component cha

};
const handleDelete = (id) => {
    console.log('emit handle delete:', id);
    emit("delete", id,true); // Truyền record lên component cha

};
// Kiểm tra xem dữ liệu có được truyền vào không
console.log('Data in table:', props.data);
</script>
<style scoped>
.small-table {
    /* max-width: 800px;  */
    font-size: 14px;
}

.small-table :deep(.ant-table) {
    max-height: 400px;
    overflow: auto;
}
.wrap-button {
    /* display: flex !important; */
    justify-content: flex-start !important;
    /* gap: 5px !important */
}
/*
.small-table :deep(.ant-table-thead > tr > th),
.small-table :deep(.ant-table-tbody > tr > td) {
    padding: 8px;
}

.small-table :deep(.ant-table-thead) {
    background-color: #f5f5f5;
}

.small-table :deep(.ant-table-row) {
    font-size: 13px;
} */
</style>