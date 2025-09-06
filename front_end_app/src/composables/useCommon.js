// src/composables/useCommon.js
import {
    parse,
    getYear
} from 'date-fns'
export function useCommon() {
    const getGroupSpendingByCategory = (spendingList) => {
        const now = new Date();
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        let result = [];

        spendingList = spendingList.filter((item) => {
            const date = parse(item.spend_date, "dd-MM-yyyy", new Date());
            const month = date.getMonth() // Tháng 0-11 (ví dụ 06 sau khi parse sẽ thành 5)

            const year = getYear(date)
            if (!result[year]) {
                result[year] = {}
            }

            if (!result[year][month]) {
                result[year][month] = {}
            }
            if (!result[year][month][item.category_id]) {
                result[year][month][item.category_id] = 0;
            }
            result[year][month][item.category_id] += item.spent_money;
        });
        return result[currentYear][currentMonth];
    }

  return {
    getGroupSpendingByCategory,
  }
}