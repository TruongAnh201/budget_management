<template>
    <div class="control">
        <a-button type="primary" @click="showPopupCreate">Thêm mới</a-button>
        <template v-if="isSelectTemplate">
            <a-button type="primary" @click="showCompare">So sánh</a-button>
        </template>
    </div>
    <div class="template-container">
        <div class="list-template">
            <table>
                <tr>
                    <th>Tên mẫu</th>
                </tr>
                <template v-for="(value) in templateData">
                    <tr :class="{ active: value.id == templateSelect.id }" class="template-row-value">
                        <td class="row-value">
                            <span class="value" @click="viewDetailTemplate(value)">{{ value.template_name }}</span>
                            <a-button type="primary" danger size="small" class="btn"
                                @click="openModelDeleteTemplate(value.id)">
                                <DeleteOutlined />
                            </a-button>
                        </td>
                    </tr>
                </template>

            </table>
        </div>
        <div class="detail">
            <template v-if="isSelectTemplate">
                <table>
                    <tr>
                        <th>Tên danh mục</th>
                        <th>Giới hạn</th>
                    </tr>
                    <template v-if="Object.keys(templateSelect.category_and_budget_for_month).length > 0">
                        <template v-for="(value, key) in templateSelect.category_and_budget_for_month">
                            <tr>
                                <td>{{ getCategoryNameById(Number(key)) }}</td>
                                <td>
                                    <div class="amount-with-edit">
                                        <span class="amount">{{ new Intl.NumberFormat('vi-VN').format(value) }}</span>
                                        <div class="wrap-button">
                                            <a-popover title="" trigger="click" v-model:open="popoverOpen[key]"
                                                @openChange="(visible) => onPopoverVisibleChange(visible, key, value)">
                                                <template #content>
                                                    <div class="wrapper-edit">
                                                        <a-input-number v-model:value="tempBudgets[key]" :min="0"
                                                            style="width: 150px"
                                                            :formatter="value => `${new Intl.NumberFormat('vi-VN').format(value)}`"
                                                            :parser="value => value.replace(/[^\d]/g, '')" />
                                                        <a-button type="primary" size="small" class="btn"
                                                            @click="saveBudgetEdit(key)">
                                                            Lưu
                                                        </a-button>
                                                    </div>

                                                </template>
                                                <a-button type="primary" size="small" class="btn">
                                                    <EditOutlined />
                                                </a-button>
                                            </a-popover>
                                            <a-button type="primary" danger size="small" class="btn"
                                                @click="openModelDelete(key)">
                                                <DeleteOutlined />
                                            </a-button>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-show="showNewInput">
                            <td>
                                <a-select ref="select" v-model:value="newCategoryIdSelect" style="width: 120px"
                                    @focus="focus">
                                    <template v-for="(value) in categories">
                                        <template
                                            v-if="!(Object.keys(templateSelect.category_and_budget_for_month)).includes(value.id.toString())">
                                            <a-select-option :value="value.id">{{ value.name }}</a-select-option>
                                        </template>
                                    </template>

                                </a-select>
                            </td>
                            <td>
                                <div class="amount-with-edit">
                                    <a-input-number v-model:value="newLimitInput" style="width: 220px; height: 40px;"
                                        :min="0" placeholder="Số tiền"
                                        :formatter="value => `${new Intl.NumberFormat('vi-VN').format(value)}`"
                                        :parser="value => value.replace(/[^\d]/g, '')" />
                                    <div class="wrap-button">
                                        <a-button type="primary" size="small" @click="saveNewItemTemplate" class="btn">
                                            <PlusOutlined />
                                        </a-button>
                                        <a-button type="primary" danger size="small" class="btn"
                                            @click="clearSaveNewItemTemplate">
                                            <DeleteOutlined />
                                        </a-button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <a-button type="primary" class="add-new-category-limit"
                                    @click="showNewForUserInput">Thêm mới</a-button>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="2">Không có dữ liệu</td>
                        </tr>
                    </template>
                </table>
            </template>
            <template v-else>
                <h4>Chọn để xem chi tiết</h4>
            </template>
        </div>
        <div class="group-spending">
            <template v-if="isSelectTemplate">
                <table>
                    <tr>
                        <th>Tên danh mục</th>
                        <th>Đã tiêu</th>
                    </tr>
                    <template v-for="(value, key) in groupCategorySpending">
                        <tr>
                            <td>{{ getCategoryNameById(Number(key)) }}</td>
                            <td>{{ new Intl.NumberFormat('vi-VN').format(value) }}</td>
                        </tr>
                    </template>

                </table>
            </template>
        </div>
    </div>

    <a-modal v-model:open="isCreateModalOpen" title="Tạo mới mẫu chi tiêu" @ok="handleSubmitCreate"
        :style="{ top: '150px' }">
        <div class="create-modal">
            <div class="template-create-header">
                <p>Tên mẫu</p>
                <a-input v-model:value="templateCreateValue.template_name" style="width: 220px; height: 40px;"
                    placeholder="Nhập tên mẫu" />
            </div>
            <div v-for="(item, index) in categories" :key="index" class="template-create-item">
                <p>{{ item.name }}</p>
                <a-input-number v-model:value="templateCreateValue.category_and_budget_for_month[item.id]"
                    style="width: 220px; height: 40px;" :min="0" placeholder="Số tiền"
                    :formatter="value => `${new Intl.NumberFormat('vi-VN').format(value)}`"
                    :parser="value => value.replace(/[^\d]/g, '')" />


            </div>
        </div>
    </a-modal>

    <!-- delete confirm modal -->
    <a-modal v-model:open="isDeleteModalOpen" title="Xóa bản ghi" @ok="handleDeleteCategoryForMonth()">
        <p>Xóa thật đó, Chắc chưa ?</p>
    </a-modal>
    <!-- compare modal -->
    <a-modal v-model:open="isCompareModalOpen" title="So sánh" footer="" :style="{ top: '150px' }">
        <table>
            <tr>
                <th>Danh mục</th>
                <th>Đã tiêu</th>
                <th>Giới hạn</th>
                <th>Còn lại</th>
            </tr>
            <template v-for="(value, key) in compareInfos">
                <tr class="">
                    <td class="row-value">
                        <span>{{ getCategoryNameById(Number(key)) }}</span>
                    </td>
                    <td class="row-value">
                        <span class="value">{{ new Intl.NumberFormat('vi-VN').format(value['spent_info']) }}</span>
                    </td>
                    <td class="row-value">
                        <span class="value">{{ new Intl.NumberFormat('vi-VN').format(value['template_info']) }}</span>
                    </td>
                    <td class="row-value">
                        <span class="value">{{ new Intl.NumberFormat('vi-VN').format(value['remaining']) }}</span>
                    </td>
                </tr>
            </template>

        </table>
    </a-modal>
    <!-- template modal -->
    <a-modal v-model:open="isDeleteTemplateModalOpen" title="Xóa template" @ok="handleDeleteTemplate">
        <p>Xóa template đấy. chắc chưa? </p>
    </a-modal>
</template>
<script setup>
import { SPENDING_TABLE_COLUMNS, SPENDING_CHILD_COLUMNS } from "@/constants/ColumnTable.ts";
import templateService from '@/services/templateService.js';
import categoryService from '@/services/categoryService.js';
import { ref, onMounted, watch, computed } from 'vue';
import { authStore } from '@/stores/authStore.js';
import spendingService from "../services/spendingService";
import {
    format,
} from 'date-fns'
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons-vue';
import { useCommon } from "../composables/useCommon";
const { getGroupSpendingByCategory } = useCommon();
const templateData = ref([]);
const isSelectTemplate = ref(false);
const categories = ref([]);
const templateSelect = ref([]);
const spendingList = ref([]);
const groupCategorySpending = ref([]);
const isCreateModalOpen = ref(false);
const templateCreateValue = ref({
    template_name: null,
    user_id: null,
    created_at: null,
    updated_at: null,
    category_and_budget_for_month: {}
});
const popoverOpen = ref([]);
const tempBudgets = ref({});
const isDeleteModalOpen = ref(false);
const isCompareModalOpen = ref(false);
const isDeleteTemplateModalOpen = ref(false);
const templateDeleteId = ref('');
const compareInfos = ref([]);
const categoryForMonthDeleteId = ref('');
const showNewInput = ref(false);
const newCategoryIdSelect = ref(null);
const newLimitInput = ref(0);


const showNewForUserInput = () => {
    showNewInput.value = true;
}
const clearSaveNewItemTemplate = () => {
    resetNewInputAndDisable();
}
const saveNewItemTemplate = async () => {
    if (newCategoryIdSelect.value === null || newLimitInput.value == 0) {
        window.$notify({ description: "Điền đầy đủ thông tin đi con lợn!" });
        return;
    }
    templateSelect.value.category_and_budget_for_month[newCategoryIdSelect.value] = newLimitInput.value;
    templateData.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    const res = await templateService.templateEdit(templateSelect.value.id, templateSelect.value);
    if (res.status != 200) throw new Error('Chỉnh sửa  không thành công');
    let responseGetList = await templateService.templateList();
    templateData.value = responseGetList.data;
    console.log('templateSelect', templateSelect.value);
    window.$notify({ description: "Thay đổi thành công rồi đấy nhé !" });
    resetNewInputAndDisable();

}
const resetNewInputAndDisable = () => {
    newCategoryIdSelect.value = null;
    newLimitInput.value = 0;
    showNewInput.value = false;

}
// const tempBudgets = ref(false)

const onPopoverVisibleChange = (visible, key, value) => {
    if (visible) {
        tempBudgets.value[key] = value;
        popoverOpen.value[key] = true;
        console.log("tempBudgets", tempBudgets.value);
    }
}
const openModelDeleteTemplate = (delId) => {
    isDeleteTemplateModalOpen.value = true;
    templateDeleteId.value = delId;
    console.log('temp del id : ', templateDeleteId.value);


}
const openModelDelete = (categoryId) => {
    isDeleteModalOpen.value = true;
    categoryForMonthDeleteId.value = categoryId;
}
const showCompare = () => {
    isCompareModalOpen.value = true;
    //get compare data
    const templateInfo = templateSelect.value.category_and_budget_for_month;
    const spentInfo = groupCategorySpending.value ?? [];
    console.log("group spending : ", spentInfo);
    console.log("templateInfo : ", templateInfo);
    let compareInfo = {};
    for (let category of categories.value) {
        // console.log('compare info : ',compareInfo);

        const limit = templateInfo.hasOwnProperty(category.id) && templateInfo[category.id] ? templateInfo[category.id] : 0;
        const spent = spentInfo.hasOwnProperty(category.id) && spentInfo[category.id] ? spentInfo[category.id] : 0;
        // console.log('category.id : ',category.id);

        compareInfo[category.id.toString()] = {
            'template_info': limit,
            'spent_info': spent,
            'remaining': Number(limit) - Number(spent)
        }
        // console.log('compare info item : ',compareInfo);

    }

    compareInfos.value = compareInfo;
    console.log('compare info : ', compareInfo);
    // getTemplateByIdCategory("");

}
// const getTemplateByIdCategory = (categoryId) => {
//     for(let cateId in templateSelect.value.category_and_budget_for_month){
//         console.log('cateId : ',cateId);

//     }
// }
const handleDeleteCategoryForMonth = async () => {
    delete templateSelect.value.category_and_budget_for_month[categoryForMonthDeleteId.value];
    console.log('temp select : ', templateSelect.value);
    templateSelect.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    const res = await templateService.templateEdit(templateSelect.value.id, templateSelect.value);
    isDeleteModalOpen.value = false;
    if (res.status != 200) throw new Error('Chỉnh sửa  không thành công');
    let responseGetList = await templateService.templateList();
    templateData.value = responseGetList.data;
    window.$notify({ description: "Thay đổi thành công rồi đấy nhé !" });
}
const handleDeleteTemplate = async () => {
    console.log('temp del id : ', templateDeleteId.value);

    const res = await templateService.templateDelete(templateDeleteId.value);
    //status 201 is create
    if (res.status != 200) throw new Error('Xóa không thành công');

    isDeleteTemplateModalOpen.value = false;
    let description = "Xóa thành công!"
    window.$notify({ description });
    //recall api list
    let responseGetList = await templateService.templateList();
    templateData.value = responseGetList.data; // Gán dữ liệu vào tableData
    isSelectTemplate.value = false;
}


const saveBudgetEdit = async (key) => {
    const newValue = Number(tempBudgets.value[key])
    popoverOpen.value[key] = false;

    templateSelect.value.category_and_budget_for_month[key] = newValue
    console.log(templateSelect.value);
    templateData.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    const res = await templateService.templateEdit(templateSelect.value.id, templateSelect.value);
    if (res.status != 200) throw new Error('Chỉnh sửa  không thành công');
    let responseGetList = await templateService.templateList();
    templateData.value = responseGetList.data;
    window.$notify({ description: "Thay đổi thành công rồi đấy nhé !" });
}

const fetchTableData = async () => {
    try {
        const response = await templateService.templateList();
        templateData.value = response.data;
        const categoryListRes = await categoryService.categoryList();
        categories.value = categoryListRes.data;
        console.log('template data : ', templateData.value);
        const spendingRest = await spendingService.spendingList();
        spendingList.value = spendingRest.data;
        console.log('spending list : ', spendingList.value)


    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}
const viewDetailTemplate = (template) => {
    isSelectTemplate.value = true;
    templateSelect.value = template;
}
const showPopupCreate = () => {
    isCreateModalOpen.value = true;
}
const handleSubmitCreate = async () => {
    console.log('template value : ', templateCreateValue.value);
    const auth = authStore();
    templateCreateValue.value.user_id = auth.user.id;
    templateCreateValue.value.updated_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    templateCreateValue.value.created_at = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

    let data = JSON.stringify(templateCreateValue.value);
    const response = await templateService.templateCreate(data);
    if (response.status != 201) throw new Error('Failed to save data');

    isCreateModalOpen.value = false;

    // // Reset form sau khi gửi thành công
    resetForm();
    // //recall api list and compute value
    let responseGetList = await templateService.templateList();
    templateData.value = responseGetList.data; // Gán dữ liệu vào tableData
    let description = "Thêm mới thành công!"
    window.$notify({ description });

}
const resetForm = () => {
    templateCreateValue.value = {
        created_at: null,
        updated_at: null,
        category_and_budget_for_month: {},
        template_name: null

    };
};

// Hàm lấy tên danh mục theo id
const getCategoryNameById = (id) => {
    const category = categories.value.find(c => c.id === id)
    return category ? category.name : 'Không rõ'
}
const getSpendingAndGroup = () => {
    // const now = new Date();
    // const currentMonth = now.getMonth()
    // const currentYear = now.getFullYear()
    // let result = [];

    // spendingList.value = spendingList.value.filter((item) => {
    //     const date = parse(item.spend_date, "dd-MM-yyyy", new Date());
    //     const month = date.getMonth() // Tháng 0-11 (ví dụ 06 sau khi parse sẽ thành 5)

    //     const year = getYear(date)
    //     if (!result[year]) {
    //         result[year] = {}
    //     }

    //     if (!result[year][month]) {
    //         result[year][month] = {}
    //     }
    //     if (!result[year][month][item.category_id]) {
    //         result[year][month][item.category_id] = 0;
    //     }
    //     result[year][month][item.category_id] += item.spent_money;
    // });
    groupCategorySpending.value = getGroupSpendingByCategory(spendingList.value);
    console.log("groupCategory : ", groupCategorySpending.value);
}

onMounted(
    async () => {
        await fetchTableData();
        getSpendingAndGroup();
    }
)
watch(templateSelect, () => {
    tempBudgets.value = {};
    popoverOpen.value = [];
})

</script>
<style scoped>
/* .container {
    margin: 15px 15px 15px 0px;
    width: 100%;
} */

.control {
    display: flex;
    gap: 10px;
    /* justify-content: flex-end; */
    margin-bottom: 15px;
}

.control button {
    min-width: 100px;
}

.template-container {
    width: 100%;
    display: flex;
    gap: 15px
}

.template-container .list-template {
    width: 20%;
}

.template-container .detail {
    width: 40%;
}

.template-container .group-spending {
    width: 40%;
}

.detail h4 {
    text-align: center;
    padding: 10px 0px;
    color: rgb(206, 205, 204);
}

table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td,
th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}

td[colspan] {
    align-items: center;
    text-align: center;
}

.template-row-value .row-value {
    display: flex;
    justify-content: space-between;
}

.template-row-value .row-value .value {
    width: 100%;
    cursor: pointer;
}

tr.active td {
    background-color: rgb(92, 8, 85);
    /* màu nền khi active */
    color: white;
}

.template-item {
    /* margin-bottom: 12px; */
    display: flex;
    justify-content: space-between;
}

.template-item p {
    padding: 10px;
    width: 100px;
}

.create-modal {
    display: flex;
    flex-direction: column;
    align-content: sp;
}

.create-modal .template-create-item,
.template-create-header {
    display: flex;
    justify-content: space-between;
    margin: 5px 0px;

}

.template-create-header input {
    width: 80%;
}

.template-general {
    margin: 10px;
    display: flex;
    /* justify-content: space-around; */
}

.template-general p {
    width: 100px;

}

.amount-with-edit,
.wrapper-edit {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: space-between;
    /* khoảng cách giữa số tiền và nút */
}

.add-new-category-limit {
    width: 100%;
}

.amount {
    font-weight: 500;
    min-width: 100px;
}

/* .btn {
    padding: 0 6px;
    font-size: 12px;
    height: 22px;
    line-height: 1;
} */
</style>
