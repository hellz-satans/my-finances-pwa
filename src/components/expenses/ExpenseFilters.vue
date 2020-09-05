<template>
  <details class="expense-filters">
    <summary>
      <strong>Filters</strong>: {{ filtersSummary }}
    </summary>

    <form
      @submit.stop.prevent="filterExpenses"
      class="expense-filters-form w-full mt-4"
    >
      <div class="flex flex-row flex-no-wrap">
        <div class="w-1/2 pr-2">
          <label for="startDate">Start date</label>
          <input
            type="date"
            id="startDate"
            v-model="startDate"
            placeholder="Start date"
          />
        </div>

        <div class="w-1/2 pl-2">
          <label for="date">End date</label>
          <input
            type="date"
            v-model="endDate"
            placeholder="End date"
          />
        </div>
      </div>

      <fieldset>
        <legend>Price</legend>
        <label for="comparator">
          <span hidden>Price Comparator</span>
          <dropdown
            v-model="comparator"
            :options="comparatorOptions"
            placeholder="Price Comparator"
          />
        </label>

        <label for="price">
          <span hidden>Price</span>
          <money-input
            id="price"
            name="price"
            v-model.lazy="price"
            :value="price"
          />
        </label>
      </fieldset>

      <div class="w-full">
        <label for="category">Category</label>
        <dropdown
          placeholder="Category"
          fluid
          selection
          :options="categoryOptions"
          v-model="category"
        />
      </div>

      <footer class="actions text-right mt-4">
        <button
          type="reset"
          @click="resetFilters"
          class="btn"
        >Reset</button>
        <button
          type="submit"
          class="btn"
        >Filter</button>
      </footer>
    </form>
  </details>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import dayjs from 'dayjs'
import Dropdown from '@/components/Dropdown'
import MoneyInput from '@/components/MoneyInput'

export default {
  name: 'ExpenseFilters',

  components: {
    Dropdown,
    MoneyInput,
  },

  props: {
  },

  data() {
    return {
      startDate: null,
      endDate: null,
      category: null,
      comparator: '>=',
      price: 0,
      comparatorOptions: [
        { text: 'Up to (<=)', value: '<=' },
        { text: 'At least (>=)', value: '>=' },
      ]
    };
  },

  methods: {
    filterExpenses() {
      const filters = [];

      if (this.startDate) {
        filters.push({
          field: 'date',
          op: '>=',
          value: dayjs(this.startDate).startOf('day'),
        })
      }

      if (this.endDate) {
        filters.push({
          field: 'date',
          op: '<=',
          value: dayjs(this.endDate).endOf('day'),
        })
      }

      if (this.price) {
        filters.push({
          field: 'price',
          op: (this.comparator === '<=') ? '<=' : '>=',
          value: this.price
        })
      }

      if (this.category) {
        filters.push({
          field: 'category',
          op: '===',
          value: this.category,
        })
      }

      this.$store.dispatch('expenses/setFilters', filters)
    },

    resetFilters() {
      this.startDate = this.endDate = this.category = null
      this.comparator = '>='
      this.price = 0
      this.$store.dispatch('expenses/setFilters', [])
    }
  },

  computed: {
    ... mapGetters('categories', [ 'categoryOptions' ]),
    ... mapState('expenses', [ 'filters' ]),

    filtersSummary() {
      let filtersStr = []
      let str = null

      for (let f of this.filters) {
        str = `${f.field} ${f.op} `
        if (f.field === 'date') {
          str += dayjs(f.value).format('MMM D YYYY')
        } else {
          str += f.value
        }

        filtersStr.push(str)
      }

      if (filtersStr.length == 0) {
        return 'show all'
      }

      return filtersStr.join(', ')
    },
  },
}
</script>

<style lang="scss" scoped>
.expense-filters {
  margin-bottom: 1rem;

  .expense-filters-form {
    fieldset {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-evenly;
      align-items: center;
      align-content: space-around;
      border: 1px solid #ccc;
      border-radius: 0.3rem;

      legend {
        padding: 0 0.5rem;
        font-weight: 600;
      }

      label {
        flex-grow: 1;
      }
    }

    label[for=actions] {
      display: none !important;
    }
  }
}
</style>
