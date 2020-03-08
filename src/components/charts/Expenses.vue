<template>
  <article class="expenses-chart">
    <histogram v-if="chartType === 'histogram'" />
    <line-chart v-if="chartType === 'line'" />
    <pie v-if="chartType === 'pie'" />

    <h3 class="text-center" v-if="expenses.length === 0">
      Nothing to show here. Try changing the filters!
    </h3>

    <footer class="expenses-chart-controls">
      <sui-button-group>
        <sui-button type="button" content="week" @click="filter('week')" />
        <sui-button type="button" content="month" @click="filter('month')" />
        <sui-button type="button" content="year" @click="filter('year')" />
      </sui-button-group>

      <sui-button-group>
        <sui-button
          :active="chartType === 'histogram'"
          icon="chart bar"
          @click="chartType = 'histogram'"
        />
        <sui-button
          :active="chartType === 'pie'"
          icon="chart pie"
          @click="chartType = 'pie'"
        />
        <sui-button
          :active="chartType === 'line'"
          icon="chart area"
          @click="chartType = 'line'"
        />
      </sui-button-group>
    </footer>
  </article>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import Histogram from '@/components/charts/histogram'
import LineChart from '@/components/charts/line'
import Pie from '@/components/charts/pie'

export default {
  components: {
    Histogram,
    LineChart,
    Pie,
  },

  props: {
  },

  data() {
    return {
      chartType: 'pie',
      onlyNegative: {
        histogram: false,
        line: true,
        pie: true,
      },
    }
  },

  methods: {
    /**
     * Set filters for expenses.
     *
     * If the optional argument is given, filter expenses in that time lapse,
     * this will be overrun by the startDate and the endDate
     *
     * @param lapse Enumerator[ null, 'week', 'month', 'year' ]
     */
    filter(lapse) {
      const newFilters = []
      const lapseFilter = {
        field: 'date',
        op: '>=',
        value: moment().startOf(lapse).toDate(),
        name: 'lapse',
      }
      // override black listed filters
      const blackList = [
        'onlyNegative',
      ]

      this.filters.forEach((el) => {
        if (el.field === 'date') {
          if (!newFilters.some(e => e.name === 'lapse')) {
            newFilters.push(lapseFilter)
          }
        } else if (blackList.indexOf(el.name) === -1) {
          newFilters.push(el)
        }
      })

      // insert lapse filter if the date filter was not set
      if (!newFilters.some(el => el.field === 'lapse')) {
        newFilters.push(lapseFilter)
      }

      // insert only-negative filter if set for the chart type
      if (this.onlyNegative[this.chartType]) {
        newFilters.push({ field: 'price', op: '<', value: 0, name: 'onlyNegative' })
      }

      this.$store.dispatch('expenses/setFilters', newFilters)
    },
  },

  computed: {
    ... mapState('expenses', [ 'expenses', 'filters', ]),
  },
}
</script>

<style lang="scss">
.expenses-chart {
  .expenses-chart-controls {
    display: flex;
    justify-content: space-between;
    padding: 0 0 1rem;
  }
}
</style>
