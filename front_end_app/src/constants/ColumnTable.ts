export const USER_TABLE_COLUMNS = [
  {
    title: 'First name',
    dataIndex: 'first_name', //match field data
    key: 'first_name',
  },
  {
    title: 'Last name',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Gender',
    key: 'gender',
    dataIndex: 'gender',
  },
  {
    title: 'IP address',
    key: 'ip_address',
    dataIndex: 'ip_address',
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
  }
];

export const CATEGORY_TABLE_COLUMNS = [
  {
    title: 'Tên danh mục',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Icon',
    dataIndex: 'icon_id',
    key: 'icon_id',
  },

  {
    title: 'Màu sắc',
    dataIndex: 'color',
    key: 'color',
  },
     {
    title: 'Kiểu chi tiêu',
    dataIndex: 'spend_type_name',
    key: 'spend_type_name',
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
  }
];
export const SPEND_TYPE_TABLE_COLUMNS = [
  {
    title: 'Tên kiểu',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
  }
];
export const SPENDING_TABLE_COLUMNS = [
  {
    title: 'Ngày',
    dataIndex: 'spend_date',
    key: 'spend_date',
  },
  {
    title: 'Tổng đã chi',
    dataIndex: 'total_spent',
    key: 'total_spent',
  },
  {
    title: 'Cập nhật lần cuối',
    dataIndex: 'lasted_update',
    key: 'lasted_update',
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
  }
];
export const SPENDING_CHILD_COLUMNS = [
  {
    title: 'Danh mục',
    dataIndex: 'category_name',
    key: 'category_name',
  },
  {
    title: 'Đã chi',
    dataIndex: 'spent_money',
    key: 'spent_money',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
  }
];