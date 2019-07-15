<template>
  <ve-histogram
    :settings="chartSettings"
    :data="chartData"
  />
</template>

<script>
import { VeHistogram } from 'v-charts'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    VeHistogram,
  },
  props: {
    records: { type: Array, required: true },
  },
  computed: {
    ... mapGetters('categories', [ 'categoriesKeys' ]),
    chartSettings() {
      return {
        stack: { price: this.categoriesKeys },
        dataOrder: { label: 'date', order: 'desc', },
      }
    },
    /**
     * Display stacked histogram by category
     *
     * @see https://v-charts.js.org/#/en/histogram
     */
    chartData() {
      const categories = []
      const rows = []
      let idx = -1

      this.records
        .reverse()
        .map((el, i, arr) => {
          // format object for echarts API
          let o = {
            [el.category]: el.price,
            category: el.category,
            date: moment(el.date).format('YYYY-MM-DD'),
            price: el.price,
          }

          // register category
          if (!categories.includes(el.category)) {
            categories.push(el.category)
          }

          return o
        }).forEach((el, i) => {
          idx = rows.findIndex(r => r.date === el.date)

          if (idx === -1) {
            el.total = el.price
            // set missing categories to zero
            for (let c of categories) {
              if (el.category != c)
                el[c] = 0
            }
            rows.push(el)
          } else {
            // summarize quantities
            rows[idx].total += el.price
            rows[idx][el.category] += el.price
          }
        })
      const columns = [ 'date', ... categories ]

      return { columns, rows, }
    },
  },
}
</script>
