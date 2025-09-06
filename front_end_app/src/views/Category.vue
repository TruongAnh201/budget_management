<template>
    <!-- table -->
    <div class="category-sc">
        <div class="category-control">
            <a-button type="primary" @click="openCreateModal">Tạo mới danh mục</a-button>
        </div>
        <div class="category-info">
            <TableCommon :columns="CATEGORY_TABLE_COLUMNS" :data=tableData @edit="openEditModal"
                @delete="deleteModalOpen">
            </TableCommon>
        </div>
    </div>
    <!-- edit modal -->
    <a-modal v-model:open="isEditModalOpen" title="Chỉnh sửa danh mục" @ok="handleSave">
        <a-form layout="vertical">
            <a-form-item label="Tên danh mục">
                <a-input v-model:value="editData.name" />
            </a-form-item>
            <a-form-item label="icon">
                <a-select v-model:value="editData.icon_id" placeholder="Chọn icon" style="width: 100%">
                    <a-select-option v-for="item in iconOptions" :key="item.id" :value="item.id">
                        <component :is="iconMap[item.icon_name]" style="margin-right: 8px" />
                        {{ item.icon_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Màu sắc">
                <a-select v-model:value="editData.color" placeholder="Chọn màu" style="width: 100%">
                    <a-select-option v-for="option in colorOptions" :key="option.id" :value="option.color">
                        <span :style="{
                            display: 'inline-block',
                            width: '10%',
                            height: '12px',
                            borderRadius: '10px',
                            backgroundColor: option.color,
                            marginRight: '8px'
                        }" />
                        <!-- <component :is="iconMap[item.icon_name]" style="margin-right: 8px" /> -->

                        <component
                        :is="iconMap[currentIconName] || iconMap[defaultIcon]"
                        :style="{ fontSize: '20px', color: option.color }"
                        />
                      <span v-if="!editData.icon_id">No icon</span>
                        <!-- icon here to example -->
                    </a-select-option>
                </a-select>
            </a-form-item>
             <a-form-item label="Kiểu chi tiêu">
                <a-select v-model:value="editData.spend_type_id" style="width: 100%">
                    <a-select-option v-for="item in spendType" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
    <!-- create new -->
    <a-modal v-model:open="isCreateModalOpen" title="Tạo mới danh mục" @ok="handleSubmitCreate">
        <a-form layout="vertical">
            <a-form-item label="Tên danh mục">
                <a-input v-model:value="formCreate.name" />
            </a-form-item>
            <!-- Select Icon -->
            <a-form-item label="Icon">
                <a-select v-model:value="formCreate.icon_id" placeholder="Chọn icon" style="width: 100%">
                    <a-select-option v-for="item in iconOptions" :key="item.id" :value="item.id">
                        <component :is="iconMap[item.icon_name]" style="margin-right: 8px" />
                        {{ item.icon_name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Màu sắc">
                <a-select v-model:value="formCreate.color" placeholder="Chọn màu" style="width: 100%">
                    <a-select-option v-for="option in colorOptions" :key="option.id" :value="option.color">
                        <span :style="{
                            display: 'inline-block',
                            width: '10%',
                            height: '12px',
                            borderRadius: '10px',
                            backgroundColor: option.color,
                            marginRight: '8px'
                        }" />
                        <!-- <component :is="iconMap[item.icon_name]" style="margin-right: 8px" /> -->

                        <component
                        :is="iconMap[formCreate.icon_id] || iconMap[defaultIcon]"
                        :style="{ fontSize: '20px', color: option.color }"
                        />
                        <span v-if="formCreate.icon_id == undefined || formCreate.icon_id == null || formCreate.icon_id == ''" > No icon </span>

                        <!-- icon here to example -->
                    </a-select-option>
                </a-select>
            </a-form-item>
              <a-form-item label="Loại chi tiêu">
                <a-select v-model:value="formCreate.spend_type" style="width: 100%">
                    <a-select-option v-for="item in spendType" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
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
import { CATEGORY_TABLE_COLUMNS } from "@/constants/ColumnTable.ts";
import { LIST_COLOR } from "@/constants/Color.ts";
import { LIST_ICON } from "@/constants/Icon.ts";
import categoryService from '@/services/categoryService';
import { ref, onMounted, watch } from 'vue';
import spendTypeService from '../services/spendTypeService';
import {
    MailOutlined,
    CalendarOutlined,
    UserSwitchOutlined,
    WomanOutlined,
    ReconciliationOutlined,
    PictureOutlined,
    ManOutlined,
    HeartOutlined,
    SwapOutlined,
    EditOutlined,
    RiseOutlined,
    SketchOutlined,
    BugOutlined,
    GlobalOutlined,
    SkinOutlined,
    HomeOutlined,
    CoffeeOutlined,
    BookOutlined,
    CarOutlined,
    ShoppingCartOutlined,
    WalletOutlined,
    DollarOutlined,
    StopOutlined
} from '@ant-design/icons-vue';
const iconMap = {
    UserSwitchOutlined,
    WomanOutlined,
    ReconciliationOutlined,
    PictureOutlined,
    ManOutlined,
    HeartOutlined,
    SwapOutlined,
    EditOutlined,
    RiseOutlined,
    SketchOutlined,
    BugOutlined,
    GlobalOutlined,
    SkinOutlined,
    HomeOutlined,
    CoffeeOutlined,
    BookOutlined,
    CarOutlined,
    ShoppingCartOutlined,
    WalletOutlined,
    DollarOutlined,
    StopOutlined
}
const tableData = ref([]);
const isEditModalOpen = ref(false);
const editData = ref({});
const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const deleteId = ref();
const colorOptions = LIST_COLOR;
const iconOptions = LIST_ICON;
const formCreate = ref({
    name: '',
    icon_id: '',
    color: '',
    spend_type:null
});
const currentIconName = ref('');
const defaultIcon = "StopOutlined";
const spendType = ref([]);

// Mở Modal
const openCreateModal = () => {
    isCreateModalOpen.value = true;
};

const deleteModalOpen = (id) => {
    isDeleteModalOpen.value = true;
    deleteId.value = id;
}

const mapSpendTypeName = () => {
  if (!spendType.value.length) return;

  tableData.value.forEach(category => {
    category.spend_type_name =
      spendType.value.find(type => type.id === category.spend_type_id)?.name || "Không rõ";
  });
}

// Hàm gọi API để lấy danh sách user
const fetchTableData = async () => {
    try {
        const response = await categoryService.categoryList();
        if (response.status != 200) throw new Error('Failed to get data');
        tableData.value = response.data; // Gán dữ liệu vào tableData
        console.log("category data :", tableData.value);
        const spendResponse = await spendTypeService.spendTypeList();
        if (spendResponse.status != 200) throw new Error('Failed to get data');
        spendType.value = spendResponse.data;
        console.log('spendType : ',spendType.value);
        // mapSpendTypeName();
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};
// Nhận dữ liệu từ component con khi bấm "Edit"
const openEditModal = (record) => {
    editData.value = { ...record };
    console.log('edit data : ',editData.value);
    isEditModalOpen.value = true;
};
// Lưu dữ liệu khi nhấn OK
const handleSave = async () => {
    isEditModalOpen.value = false;
    const id = editData.value.id;
    delete editData.value.id;
    const response = await categoryService.categoryEdit(id, editData.value);
    if (response.status != 200) throw new Error('Failed to save data');
    let responseGetList = await categoryService.categoryList();
    tableData.value = responseGetList.data;
    window.$notify({ description:"Sao mà hay thay đổi quá à" });
};
const handleDelete = async () => {
    const response = await categoryService.categoryDelete(deleteId.value);

    //status 201 is create
    if (response.status != 200) throw new Error('Failed to delete data');

    isDeleteModalOpen.value = false;
    console.log('Delete success ! ');
    //recall api list
    let responseGetList = await categoryService.categoryList();
    tableData.value = responseGetList.data; // Gán dữ liệu vào tableData
}

const handleSubmitCreate = async () => {
    try {
        let data = JSON.stringify(formCreate.value);
        console.log('form create : ',data);
        const response = await categoryService.categoryCreate(data);
        console.log("response : ", response);
        //status 201 is create
        if (response.status != 201) throw new Error('Failed to save data');

        isCreateModalOpen.value = false;

        // Reset form sau khi gửi thành công
        resetForm();
        window.$notify({ description:"Tạo mới thành công" });
        //recall api list
        let responseGetList = await categoryService.categoryList();
        tableData.value = responseGetList.data; // Gán dữ liệu vào tableData
    } catch (error) {
        console.log("error:", error);
    }
};
const resetForm = () => {
    formCreate.value.name = '';
    formCreate.value.icon_id = '';
    formCreate.value.color = '';
};

// Gọi API khi component được mounted
onMounted(async () => {
  await fetchTableData();
  mapSpendTypeName();
});
watch(
  () => editData.value.icon_id,
  (newId) => {
    const matchedIcon = LIST_ICON.find(icon => icon.id === newId);
    currentIconName.value = matchedIcon ? matchedIcon.icon_name : 'defaultIcon';
  },
  { immediate: true } // nếu muốn chạy ngay khi mounted
);
watch(tableData, (newVal) => {
  if (spendType.value.length) {
    mapSpendTypeName();
  }
});
</script>
<style scoped>
.category-sc {
    /* padding: 10px; */
}

.category-sc .category-control {
    /* height: 50px;
    padding: 10px, 20px; */
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
