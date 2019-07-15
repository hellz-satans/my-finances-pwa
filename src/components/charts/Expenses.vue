<style lang="scss">
.expenses-chart {
  .expenses-chart-controls {
    text-align: right;
    padding: 0 0 1rem;
  }
}
</style>

<template>
  <article class="expenses-chart">
    <ve-histogram
      :settings="chartSettings"
      :data="chartData"
      v-if="chartType === 'area'"
    />
    <ve-pie
      :settings="chartSettings"
      :data="chartData"
      v-if="chartType === 'pie'"
    />

    <footer class="expenses-chart-controls">
      <sui-button-group>
        <sui-button icon="chart area" @click="chartType = 'area'"></sui-button>
        <sui-button icon="chart pie" @click="chartType = 'pie'"></sui-button>
      </sui-button-group>
    </footer>
  </article>
</template>

<script>
import { VeHistogram, VePie } from 'v-charts'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import { filterExpenses } from '@/stores/filters';

export default {
  components: {
    VeHistogram,
    VePie,
  },
  props: {
    filters: { type: Array, required: false, default: () => { return [] } },
  },
  data() {
    return {
      chartType: 'area',
    }
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

      // summarize total by pivot (date)
      data.forEach((el, i, arr) => {
        if (!dict[el[pivot]]) {
          dict[el[pivot]] = 0;
        }
        dict[el[pivot]] += el[summarizable];
      });

      // push day entry
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
    ... mapGetters('categories', [ 'categoriesKeys' ]),
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
        stack: { price: this.categoriesKeys },
        dataOrder: { label: 'date', order: 'desc', },
      };
    },
    chartDataByDate() {
      const columns = [ 'date', 'Total expense', ];

      const rows = this.expensesList
        .map((el, i, arr) => {
          return {
            'Total expense': el.price,
            date: moment(el.date).format('YYYY-MM-DD'),
          };
        });

      return { columns, rows: this.mergeData(rows, ... columns) };
    },
    /**
     * Display stacked histogram by category
     *
     * TODO: move the histogram chart to it's own component that receives
     * list of records, the same for pie chart. Each component configures itself
     *
     * @see https://v-charts.js.org/#/en/histogram
     */
    chartData() {
      const categories = this.categoriesKeys
      const columns = [ 'date', ... categories ];
      let rows = []
      let idx = -1

      this.expensesList
        .reverse()
        // format object for echarts API
        .map((el, i, arr) => {
          let o = {
            category: el.category,
            date: moment(el.date).format('YYYY-MM-DD'),
            price: el.price,
          }

          for (let c of categories) {
            if (el.category == c)
              o[c] = el.price
            else
              o[c] = 0
          }

          return o
        }).forEach((el, i) => {
          idx = rows.findIndex(r => r.date === el.date)

          if (idx === -1) {
            el.total = el.price
            rows.push(el)
          } else {
            // summarize quantities
            rows[idx].total += el.price
            rows[idx][el.category] += el.price
          }
        })

      return { columns, rows, };
    },
  },
}
</script>
