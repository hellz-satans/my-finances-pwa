<template>
  <ve-line :settings="chartSettings" :extend="chartOptions" :data="chartData"></ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import { mapState } from 'vuex'
import moment from 'moment'
import { filterExpenses } from '@/stores/filters';

export default {
  components: {
    VeLine,
  },
  props: {
    filters: { type: Array, required: false, default: () => { return [] } },
  },
  methods: {
    /**
     * Summarize data by a given field.
     *
     * Suppose you have an array of data like this:
     *
     * 	[
     * 		{ date: '2018-01-01', price: 100 },
     * 		{ date: '2018-02-02', price: 100 },
     * 		{ date: '2018-01-01', price: 150 }
     * 	]
     *
     * 	This function returns as summarized array like this:
     *
     * 	[
     * 		{ date: '2018-01-01', price: 250 },
     * 		{ date: '2018-02-02', price: 100 },
     * 	]
     *
     * @param  data [Object]
     * @param  key String
     * @return [Object]
     */
    mergeData(data, pivot, summarizable) {
      const result = [],
        dict = {};
      let tmpObj = null;

      data.forEach((el, i, arr) => {
        if (!dict[el[pivot]]) {
          dict[el[pivot]] = 0;
        }
        dict[el[pivot]] += el[summarizable];
      });

      for (const key in dict) {
        tmpObj = {};
        tmpObj[pivot] = key;
        tmpObj[summarizable] = dict[key];
        result.push(tmpObj)
      }

      return result;
    }
  },
  computed: {
    ... mapState('expenses', [ 'expenses' ]),
    expensesList() {
      let i = 0,
        list = []

      for (i = 0; i < this.expenses.length; ++i) {
        list.push(this.expenses[i])
      }
      list = list.filter(exp => filterExpenses(exp, this.filters))

      return list
    },
    chartSettings() {
      return {
        area: true,
      };
    },
    chartOptions() {
      return {
        series: {
          smooth: false,
        },
      };
    },
    chartData() {
      const columns = [ 'date', 'Total expense', ];

      const rows = this.expensesList
        .map((el, i, arr) => {
          return {
            'Total expense': el.price,
            date: moment(el.date).format('YYYY-MM-DD'),
          };
        });

      return { columns, rows: this.mergeData(rows, 'date', 'Total expense') };
    },
  },
}
</script>
