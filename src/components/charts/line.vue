<template>
  <ve-line
    :settings="chartSettings"
    :extend="chartOptions"
    :data="chartData"
  />
</template>

<script>
import { VeLine } from 'v-charts'
import moment from 'moment'
import { mergeData } from '@/stores/filters'

export default {
  components: {
    VeLine,
  },
  props: {
    records: { type: Array, required: true },
  },
  computed: {
    chartSettings() {
      return {
        area: true,
      }
    },
    chartOptions() {
      return {
        series: {
          smooth: true
        }
      }
    },
    chartData() {
      const columns = [ 'date', 'Total expense', ];

      const rows = this.records
        .map((el, i, arr) => {
          return {
            'Total expense': el.price,
            date: moment(el.date).format('YYYY-MM-DD'),
          };
        });

      return { columns, rows: mergeData(rows,  'date', 'Total expense') };
    },
  },
}
</script>
