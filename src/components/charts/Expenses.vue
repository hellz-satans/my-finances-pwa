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
    <histogram v-if="chartType === 'histogram'" :records="expensesList" />
    <line-chart v-if="chartType === 'line'" :records="expensesList" />
    <pie v-if="chartType === 'pie'" :records="expensesList" />

    <footer class="expenses-chart-controls">
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
import { filterExpenses } from '@/stores/filters';
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
    filters: { type: Array, required: false, default: () => { return [] } },
  },
  data() {
    return {
      chartType: 'histogram',
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
  },
}
</script>
