<template>
    <!-- table -->
    <div class="user-sc">
        <div class="user-control">
            <a-button type="primary" @click="openCreateModal">Create new</a-button>
        </div>
        <div class="user-info">
            <TableCommon :columns="USER_TABLE_COLUMNS" :data=tableData @edit="openEditModal" @delete="deleteModalOpen">
            </TableCommon>
        </div>
    </div>
    <!-- edit modal -->
    <a-modal v-model:open="isEditModalOpen" title="Edit User" @ok="handleSave">
        <a-form layout="vertical">
            <a-form-item label="First Name">
                <a-input v-model:value="editData.first_name" />
            </a-form-item>
            <a-form-item label="Last Name">
                <a-input v-model:value="editData.last_name" />
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- create new -->
    <a-modal v-model:open="isCreateModalOpen" title="Create New User" @ok="handleSubmitCreate">
        <a-form layout="vertical">
            <a-form-item label="First Name">
                <a-input v-model:value="form.first_name" placeholder="Enter First Name" />
            </a-form-item>

            <a-form-item label="Last Name">
                <a-input v-model:value="form.last_name" placeholder="Enter Last Name" />
            </a-form-item>

            <a-form-item label="Email">
                <a-input v-model:value="form.email" placeholder="Enter Email" type="email" />
            </a-form-item>

            <a-form-item label="Gender">
                <a-select v-model:value="form.gender" placeholder="Select Gender">
                    <a-select-option value="Male">Male</a-select-option>
                    <a-select-option value="Female">Female</a-select-option>
                    <a-select-option value="Other">Other</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="IP Address">
                <a-input v-model:value="form.ip_address" placeholder="Enter IP Address" />
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
import { USER_TABLE_COLUMNS } from "@/constants/ColumnTable.ts";
import userService from '@/services/userService';
import { ref, onMounted, h, reactive, watch } from 'vue';
import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from '@ant-design/icons-vue';

const tableData = ref([]);
const isEditModalOpen = ref(false);
const editData = ref({});
const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteId = ref();
const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    ip_address: ''
});
// Mở Modal
const openCreateModal = () => {
    isCreateModalOpen.value = true;
};

const deleteModalOpen = (id)=>{
    isDeleteModalOpen.value = true;
    deleteId.value = id;
}


// Biến lưu dữ liệu bảng (reactive)

// Hàm gọi API để lấy danh sách user
const fetchTableData = async () => {
    try {
        const response = await userService.userList();
        tableData.value = response.data; // Gán dữ liệu vào tableData
        console.log("user data :", tableData.value);

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
    const response = await userService.userEdit(id, editData.value);
    if (response.status != 200) throw new Error('Failed to save data');
    let responseGetList = await userService.userList();
    tableData.value = responseGetList.data;
    window.$notify({ description:"Sao mà hay thay đổi quá à, cập nhật thành công rồi đấy :)" });
};
const handleDelete = async () => {
    console.log('id in parent : ',deleteId.value);
    const response = await userService.userDelete(deleteId.value);
    console.log('res : ', response);

    //status 201 is create
    if (response.status != 200) throw new Error('Failed to delete data');

    isDeleteModalOpen.value = false;
    console.log('Delete success ! ');
    //recall api list
    let responseGetList = await userService.userList();
    tableData.value = responseGetList.data; // Gán dữ liệu vào tableData
}

const handleSubmitCreate = async () => {
    try {
        let data = JSON.stringify(form.value);
        const response = await userService.userCreate(data);
        console.log("response : ", response);
        //status 201 is create
        if (response.status != 201) throw new Error('Failed to save data');

        isCreateModalOpen.value = false;

        // Reset form sau khi gửi thành công
        resetForm();
        console.log('Create success : ', form.value);
        //recall api list
        let responseGetList = await userService.userList();
        tableData.value = responseGetList.data; // Gán dữ liệu vào tableData
    } catch (error) {
        console.log("error:", error);
    }
};
const resetForm = () => {
    form.value.first_name = '';
    form.value.last_name = '';
    form.value.email = '';
    form.value.gender = '';
    form.value.ip_address = '';
    console.log(form);
};

// Gọi API khi component được mounted
onMounted(fetchTableData);
</script>
<style scoped>
.user-sc {
    /* width: 100vw; */
    /* padding: 10px; */
}

.user-sc .user-control {
    height: 50px;
    /* padding: 10px, 20px; */
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    /* Đẩy sang phải */
    align-items: center;
    /* Căn giữa theo chiều dọc */
}

.user-sc .user-info {}
</style>
