<template>
  <sui-accordion exclusive class="expense-filters">
    <sui-accordion-title>
      <sui-icon name="dropdown" />
      <strong>Filters</strong>: {{ filtersSummary }}
    </sui-accordion-title>
    <sui-accordion-content class="ui form expense-filters-form">
      <sui-grid>
        <sui-grid-row>
          <sui-grid-column :mobile="8" :tablet="3" :computer="3">
            <sui-form-field>
              <label class="hidden" hidden for="startDate">Start date</label>
              <input type="date" v-model="startDate" placeholder="Start date" />
            </sui-form-field>
          </sui-grid-column>

          <sui-grid-column :mobile="8" :tablet="3" :computer="3">
            <sui-form-field>
              <label for="date">End date</label>
              <input type="date" v-model="endDate" placeholder="End date" />
            </sui-form-field>
          </sui-grid-column>

          <sui-grid-column :mobile="8" :tablet="6" :computer="6">
            <fieldset>
              <legend>Price</legend>
              <label for="comparator">
                <span hidden>Price Comparator</span>
                <sui-dropdown
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
          </sui-grid-column>

          <sui-grid-column :mobile="8" :tablet="3" :computer="3">
            <sui-form-field>
              <label for="category">Category</label>
              <sui-dropdown
                placeholder="Category"
                fluid
                selection
                :options="categoryOptions"
                v-model="category"
              />
            </sui-form-field>
          </sui-grid-column>
        </sui-grid-row>

        <sui-grid-row>
          <sui-grid-column></sui-grid-column>
          <sui-grid-column align="right" floated="right" :mobile="12">
            <sui-form-field>
              <label hidden for="actions">Actions</label>
              <sui-button @click="resetFilters" icon="undo" content="Reset" />
              <sui-button @click="filter" icon="filter" content="Filter" />
            </sui-form-field>
          </sui-grid-column>
        </sui-grid-row>
      </sui-grid>
      </div>
    </sui-accordion-content>
  </sui-accordion>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import MoneyInput from '@/components/MoneyInput'

export default {
  name: 'ExpenseFilters',

  components: {
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
        { text: 'Up to', value: '<=' },
        { text: 'At least', value: '>=' },
      ]
    };
  },

  methods: {
    filter() {
      const filters = [];

      if (this.startDate) {
        filters.push({
          field: 'date',
          op: '>=',
          value: moment(this.startDate).startOf('day'),
        })
      }

      if (this.endDate) {
        filters.push({
          field: 'date',
          op: '<=',
          value: moment(this.endDate).endOf('day'),
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
          str += moment(f.value).format('MMM D YYYY')
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
