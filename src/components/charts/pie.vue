<template>
  <ve-pie
    :settings="chartSettings"
    :data="chartData"
  />
</template>

<script>
import { VePie } from 'v-charts'
import moment from 'moment'

export default {
  components: {
    VePie,
  },
  props: {
    records: { type: Array, required: true },
  },
  computed: {
    chartSettings() {
      return {
        dimension: 'category',
        metrics: 'total',
      }
    },
    /**
     * Display pie chart by category
     *
     * @see https://v-charts.js.org/#/en/pie
     */
    chartData() {
      const columns = [ 'category', 'total' ]
      const table = {}
      const rows = []

      this.records
        .forEach((el, i, arr) => {
          if (!table[el.category]) {
            table[el.category] = 0
          }

          table[el.category] += el.price
        })

      for (let k in table) {
        rows.push({ category: k, total: table[k] })
      }

      return { columns, rows, }
    },
  },
}
</script>
