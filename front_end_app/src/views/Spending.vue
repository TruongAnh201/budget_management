<template>
    <!-- table -->

    <div class="category-control">
        <a-button type="primary" @click="openCreateModal">Tạo mới chi tiêu</a-button>
    </div>
    <div class="category-info">
        <a-table :columns="SPENDING_TABLE_COLUMNS" :data-source="tableDataHeader" row-key="spend_date" :scroll="{ y: 530 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                         <a-button type="primary" danger size="small" @click="handleDeleteParent()"><DeleteOutlined /></a-button>
                    </span>
                </template>
            </template>

            <template #expandedRowRender="{ record }">
                <a-table :columns="SPENDING_CHILD_COLUMNS" :data-source="innerDataGrouped[record.spend_date]"
                    :pagination="false" row-key="created_at">
                    <template #bodyCell="{ column, record }">

                        <template v-if="column.key === 'action'">
                            <span class="wrap-button">
                                <a-button type="primary"  size="small"  @click="openEditModal(record)"><EditOutlined /></a-button>
                                <!-- <a @click="openEditModal(record)"> <EditOutlined /></a> -->
                                <a-button type="primary" danger size="small" @click="deleteModalOpen(record.id)"><DeleteOutlined /></a-button>
                            </span>
                        </template>
                    </template>
                </a-table>
            </template>
        </a-table>
    </div>

    <!-- edit modal -->
    <a-modal v-model:open="isEditModalOpen" title="Chỉnh sửa ngân sách" @ok="handleSave">
        <a-form layout="vertical">
            <a-form-item label="Danh mục">
                <a-select v-model:value="editData.category_id" placeholder="Chọn danh mục" style="width: 100%">
                    <a-select-option v-for="item in categories" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Đã chi">
                <a-input v-model:value="editData.spent_money" type="number"
                    @change="(e) => editData.spent_money = Number(e.target.value)" />
            </a-form-item>
            <a-form-item label="Ghi chú">
                <a-input v-model:value="editData.note" type="text" />
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- create new -->
    <a-modal v-model:open="isCreateModalOpen" title="Tạo mới chi tiêu (cho ngày hôm nay)" @ok="handleSubmitCreate">
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
                <a-input v-model="formCreate.spent_money" type="number"
                    @change="(e) => formCreate.spent_money = Number(e.target.value)" />
            </a-form-item>
            <a-form-item label="Ghi chú">
                <a-input v-model:value="formCreate.note" type="text" />
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- delete confirm modal -->
    <a-modal v-model:open="isDeleteModalOpen" title="Xóa bản ghi" @ok="handleDelete">
        <p>Xóa thật đó, Chắc chưa ?</p>
    </a-modal>
    <a-modal v-model:open="isDeleteParentModalOpen" title="Xóa toàn bộ " @ok="">
        <p>Chức năng chưa support đâu =))</p>
    </a-modal>
</template>
<script setup>
import { SPENDING_TABLE_COLUMNS, SPENDING_CHILD_COLUMNS } from "@/constants/ColumnTable.ts";
import spendingService from '@/services/spendingService.js';
import categoryService from '@/services/categoryService.js';
import { ref, onMounted, watch, computed } from 'vue';
import { authStore } from '@/stores/authStore.js';
import { format } from "date-fns";
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';


const innerData = ref([]);
const categories = ref([]);
const isEditModalOpen = ref(false);
const editData = ref({});
const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDeleteParentModalOpen = ref(false);

const deleteId = ref();
const formCreate = ref({
    user_id: null,
    category_id: null,
    spent_money: 0,
    note: ""
});

// Mở Modal
const openCreateModal = () => {
    isCreateModalOpen.value = true;
};

const deleteModalOpen = (id) => {
    isDeleteModalOpen.value = true;
    deleteId.value = id;
}


// Biến lưu dữ liệu bảng (reactive)

// Hàm gọi API để lấy danh sách user
const fetchTableData = async () => {
    try {
        const response = await spendingService.spendingList();
        if (response.status != 200) throw new Error('Failed to get data');

        innerData.value = response.data; // Gán dữ liệu vào inner
        console.log('innerData.value : ',innerData.value);

        const categoryListRes = await categoryService.categoryList();
        categories.value = categoryListRes.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};
const fetchCategoryData = async () => {
    try {
        const response = await categoryService.categoryList();
        categories.value = response.data; // Gán dữ liệu vào inner
        // const categoryListRes = await categoryService.categoryList();
        // categories.value = categoryListRes.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};
// Nhận dữ liệu từ component con khi bấm "Edit"
const openEditModal = (record) => {
    editData.value = {
        category_id: record.category_id,
        id: record.id,
        spent_money: record.spent_money,
        note: record.note,
        updated_at: '',
        created_at: record.created_at,
        user_id: record.user_id,
        spend_date: record.spend_date
    };
    isEditModalOpen.value = true;
    console.log('editData', editData.value);
};
// Lưu dữ liệu khi nhấn OK
const handleSave = async () => {
    isEditModalOpen.value = false;
    const id = editData.value.id;
    delete editData.value.id;
    editData.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    const response = await spendingService.spendingEdit(id, editData.value);
    if (response.status != 200) throw new Error('Failed to save data');
    let responseGetList = await spendingService.spendingList();
    innerData.value = responseGetList.data;
    let description = "Cập nhật thành công!"
    window.$notify({ description });
};
const handleDelete = async () => {
    const response = await spendingService.spendingDelete(deleteId.value);

    //status 201 is create
    if (response.status != 200) throw new Error('Failed to delete data');

    isDeleteModalOpen.value = false;
    let description = "Xóa thành công!"
    window.$notify({ description });
    //recall api list
    let responseGetList = await spendingService.spendingList();
    innerData.value = responseGetList.data; // Gán dữ liệu vào tableData
}
const handleDeleteParent = () => {
    isDeleteParentModalOpen.value = true;
}

const handleSubmitCreate = async () => {
    try {
        const auth = authStore();
        formCreate.value.user_id = auth.user.id;
        formCreate.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
        formCreate.value.created_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
        formCreate.value.spend_date = format(new Date(), 'dd-MM-yyyy');

        let data = JSON.stringify(formCreate.value);
        const response = await spendingService.spendingCreate(data);
        if (response.status != 201) throw new Error('Failed to save data');

        isCreateModalOpen.value = false;

        // // Reset form sau khi gửi thành công
        resetForm();
        // //recall api list and compute value
        let responseGetList = await spendingService.spendingList();
        innerData.value = responseGetList.data; // Gán dữ liệu vào tableData
        let description = "Thêm mới thành công!"
        window.$notify({ description });
    } catch (error) {
        console.log("error:", error);
    }
};
const resetForm = () => {
    formCreate.value.category_name = '';
    formCreate.value.spent_money = 0;
    formCreate.value.category_id = null;
    formCreate.value.note = '';
    console.log('form reset : ', formCreate.value);
};

// Gọi API khi component được mounted
onMounted(() => {
    fetchTableData();
    fetchCategoryData();
});

const tableDataHeader = computed(() => {
    const data = innerData.value.sort((a, b) => b.id - a.id).reduce((newVal, item) => {
        if (!newVal[item.spend_date]) {
            newVal[item.spend_date] = {
                spend_date: item.spend_date,
                total_spent: 0,
                lasted_update: item.updated_at,
            };
            newVal[item.spend_date].inner = [];
        }
        newVal[item.spend_date].total_spent += item.spent_money;
        return newVal;
    }, {});
    return Object.values(data);
});

const innerDataGrouped = computed(() => {
    const grouped = {};
    innerData.value.forEach(item => {
        if (!grouped[item.spend_date]) {
            grouped[item.spend_date] = [];
        }
        const category = categories.value.find(cat => cat.id === item.category_id);
        item.category_name = category.name;
        grouped[item.spend_date].push(item);
    });
    return grouped;
});
</script>
<style scoped>
.category-control {
    float: right;
    margin-bottom: 10px;
}

.category-info {

}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}

:deep(.ant-input) {
    width: 100%;
}
</style>
