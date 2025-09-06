<template>
    <!-- table -->
    <div class="category-sc">
        <div class="category-control">
            <a-button type="primary" @click="openCreateModal">Tạo mới kiểu</a-button>
        </div>
        <div class="category-info">
            <TableCommon :columns="SPEND_TYPE_TABLE_COLUMNS" :data=tableDataWithCategory @edit="openEditModal"
                @delete="deleteModalOpen">
            </TableCommon>
        </div>
    </div>
    <!-- edit modal -->
    <a-modal v-model:open="isEditModalOpen" title="Chỉnh sửa ngân sách" @ok="handleSave">
        <a-form layout="vertical">
            <a-form layout="vertical">
            <a-form-item label="Tên kiểu">
                <a-input v-model:value="editData.name" type="text"/>
            </a-form-item>
             <a-form-item label="Ghi chú">
                <a-input v-model:value="editData.note" type="text"/>
            </a-form-item>
        </a-form>
        </a-form>
    </a-modal>
    <!-- create new -->
    <a-modal v-model:open="isCreateModalOpen" title="Tạo mới kiểu" @ok="handleSubmitCreate">
        <a-form layout="vertical">
            <a-form-item label="Tên kiểu">
                <a-input v-model:value="formCreate.name" type="text"/>
            </a-form-item>
             <a-form-item label="Ghi chú">
                <a-input v-model:value="formCreate.note" type="text"/>
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- delete confirm modal -->
    <a-modal v-model:open="isDeleteModalOpen" title="Xóa bản ghi" @ok="handleDelete">
        <p>Xóa thật đó, Chắc chưa ?</p>
    </a-modal>
</template>
<script setup>
import TableCommon from '@/components/TableListManagement.vue';
import { SPEND_TYPE_TABLE_COLUMNS } from "@/constants/ColumnTable.ts";
import spendTypeService from '@/services/spendTypeService.js';
import categoryService from '@/services/categoryService.js';
import { ref, onMounted, watch,computed } from 'vue';
import { authStore } from '@/stores/authStore.js';
import {
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons-vue';

const tableData = ref([]);
const categories = ref([]);
const isEditModalOpen = ref(false);
const editData = ref({});
const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteId = ref();
const formCreate = ref({
    user_id:null,
    name: '',
    note: ''
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
        const response = await spendTypeService.spendTypeList();
        tableData.value = response.data; // Gán dữ liệu vào tableData
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};
// Nhận dữ liệu từ component con khi bấm "Edit"
const openEditModal = (record) => {
    editData.value = { ...record };
    isEditModalOpen.value = true;
};
// Lưu dữ liệu khi nhấn OK
const handleSave = async () => {
    isEditModalOpen.value = false;
    const id = editData.value.id;
    delete editData.value.id;
    const response = await spendTypeService.spendTypeEdit(id, editData.value);
    if (response.status != 200) throw new Error('Failed to save data');
    let responseGetList = await spendTypeService.spendTypeList();
    tableData.value = responseGetList.data;
    let description = "Cập nhật thành công!"
    window.$notify({ description });
};
const handleDelete = async () => {
    const response = await spendTypeService.spendTypeDelete(deleteId.value);

    //status 201 is create
    if (response.status != 200) throw new Error('Failed to delete data');

    isDeleteModalOpen.value = false;
    let description = "Xóa thành công!"
    window.$notify({ description });
    //recall api list
    let responseGetList = await spendTypeService.spendTypeList();
    tableData.value = responseGetList.data; // Gán dữ liệu vào tableData
}

const handleSubmitCreate = async () => {
    try {
        const auth = authStore();
        formCreate.value.user_id = auth.user.id;
        let data = JSON.stringify(formCreate.value);
        const response = await spendTypeService.spendTypeCreate(data);
        if (response.status != 201) throw new Error('Failed to save data');

        isCreateModalOpen.value = false;

        // // Reset form sau khi gửi thành công
        resetForm();
        // //recall api list and compute value
        let responseGetList = await spendTypeService.spendTypeList();
        tableData.value = responseGetList.data; //
        let description = "Tạo kiểu chi tiêu thành công!"
        window.$notify({ description });
    } catch (error) {
        console.log("error:", error);
    }
};
const resetForm = () => {
    formCreate.value.name = '';
    formCreate.value.note = '';
};

// Gọi API khi component được mounted
onMounted(fetchTableData);

const tableDataWithCategory = computed(() => {
  return tableData.value.map(budget => {
    const category = categories.value.find(cat => cat.id === budget.category_id);
    return {
      ...budget,
      category_name: category ? category.name : 'Unknown',
    };
  });
});
</script>
<style scoped>
.category-sc {
    /* padding: 10px; */
}

.category-sc .category-control {
    /* height: 50px; */
    /* padding: 10px, 20px; */
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    /* Đẩy sang phải */
    align-items: center;
    /* Căn giữa theo chiều dọc */
}

.category-sc .category-info {}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}

:deep(.ant-input) {
    width: 100%;
}
</style>
