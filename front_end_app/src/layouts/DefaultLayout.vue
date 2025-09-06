<template>
    <div class="wrapper">
        <section class="header">
            <h3>
                Header
            </h3>
        </section>
        <section class="main-container">
            <!-- nav -->
            <div class="nav">
                <div>
                    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 256px"
                        mode="vertical" :items="items" @click="handleClick" />
                </div>

                <div class="nav-foot">
                    <h3>Nav foot</h3>
                </div>
            </div>

            <!-- view -->
             <div class="container">
                <router-view />
             </div>
        </section>
    </div>
</template>
<script setup>
import { ref, h } from 'vue';
import { useRouter } from 'vue-router';
import {
    DashboardOutlined,
    UserOutlined,
    ControlOutlined,
    DiffOutlined,
    WalletOutlined,
    DollarOutlined,
    UnorderedListOutlined
} from '@ant-design/icons-vue';
// Biến lưu dữ liệu bảng (reactive)
const isEditModalOpen = ref(false);
const router = useRouter();

// nav
const selectedKeys = ref(['/']);
const openKeys = ref([]);
const items = ref([
    {
        key: '/',
        icon: () => h(DashboardOutlined),
        label: 'Tổng quan',
        title: 'Tổng quan',
    },
    {
        key: '/user',
        icon: () => h(UserOutlined),
        label: 'User',
        title: 'User',
    },
    {
        key: '/home',
        icon: () => h(ControlOutlined),
        label: 'Trang chính',
        title: 'Trang chính',
    },
    {
        key: '/categories',
        icon: () => h(DiffOutlined),
        label: 'Danh mục',
        title: 'Danh mục',
    },
    {
        key: '/spend-type',
        icon: () => h(WalletOutlined),
        label: 'Kiểu chi tiêu',
        title: 'Kiểu chi tiêu',
    },
    {
        key: '/spending',
        icon: () => h(DollarOutlined),
        label: 'Chi tiết chi tiêu',
        title: 'Chi tiết chi tiêu',
    },
    {
        key: '/template',
        icon: () => h(UnorderedListOutlined),
        label: 'Mẫu chi tiêu',
        title: 'Mẫu chi tiêu',
    },
    // {
    //     key: '/quick-spent',
    //     icon: () => h(TagsOutlined),
    //     label: 'quick-spent',
    //     title: 'quick-spent',
    // },
    //   {
    //     key: 'sub2',
    //     icon: () => h(SettingOutlined),
    //     label: 'Navigation Four',
    //     title: 'Navigation Four',
    //     children: [
    //       {
    //         key: '7',
    //         label: 'Option 7',
    //         title: 'Option 7',
    //       },
    //       {
    //         key: '8',
    //         label: 'Option 8',
    //         title: 'Option 8',
    //       },
    //       {
    //         key: '9',
    //         label: 'Option 9',
    //         title: 'Option 9',
    //       },
    //       {
    //         key: '10',
    //         label: 'Option 10',
    //         title: 'Option 10',
    //       },
    //     ],
    //   },
]);
const handleClick = menuInfo => {
    console.log('click ', menuInfo.key);
    router.push(menuInfo.key);
};

// Gọi API khi component được mounted
// onMounted(fetchTableData);
</script>
<style scoped>
.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    background-color: rgb(92, 8, 85);
    /* min-height: 10vh; */
}

.header h3 {
    color: white;
    font-size: larger;
    text-align: center;
    padding: 20px 0px;
    margin: 0px;
}

.main-container {
    display: flex;
    flex: 1;
    /* gap: 16px; */
    /* height: 100%; */
    /* height: 85vh; */
}
.container{
    margin: 15px;
    width: 100%;
    /* max-height:82vh; */
    /* overflow: hidden; */
}

.nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: .5px solid rgb(204, 199, 204);
    /* height: 60vh; */
    /* height: 100%; */
}

.nav .nav-foot {
    background-color: rgb(92, 8, 85);
}

.nav .nav-foot h3 {
    color: white;
    text-align: center;
    padding: 10px 0px;
}
</style>
