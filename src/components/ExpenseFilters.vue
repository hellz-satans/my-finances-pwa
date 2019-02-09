<style lang="scss" scoped>
.expense-filters {
  margin-bottom: 1rem;
}
</style>

<template>
	<nav class="expense-filters">
		<sui-form
			name="filters"
			method="GET"
			@submit.prevent="filter"
			class="expense-filter-form"
		>
			<sui-grid >
				<sui-grid-row>
					<sui-grid-column :mobile="8" :tablet="3" :computer="3">
						<sui-form-field>
							<label for="date">Start date</label>
							<datetime v-model="startDate" placeholder="Start date"></datetime>
						</sui-form-field>
					</sui-grid-column>

					<sui-grid-column :mobile="8" :tablet="3" :computer="3">
						<sui-form-field>
							<label for="date">End date</label>
							<datetime v-model="endDate" placeholder="End date"></datetime>
						</sui-form-field>
					</sui-grid-column>

					<sui-grid-column :mobile="8" :tablet="3" :computer="3">
						<sui-form-field>
							<label for="date">To</label>
							<sui-dropdown
								placeholder="Comparator"
								selection
								:options="comparatorOptions"
								v-model="comparator"
							/>
						</sui-form-field>
					</sui-grid-column>

					<sui-grid-column :mobile="8" :tablet="3" :computer="3">
						<sui-form-field>
							<label for="date">Price</label>
							<sui-input
								id="grand_total"
								name="grand_total"
								placeholder="Unit price"
								type="number"
								step="any"
								v-model="price"
							/>
						</sui-form-field>
					</sui-grid-column>

          <sui-grid-column :mobile="8" :tablet="3" :computer="3">
            <sui-form-field>
              <label for="category">Category</label>
              <sui-dropdown
                placeholder="Category"
                fluid
                selection
                :options="expenseCategories"
                data-rules="required"
                data-vv-name="category"
                v-validate
                v-model="category"
              />
            </sui-form-field>
          </sui-grid-column>

					<sui-grid-column :mobile="8" :tablet="3" :computer="3">
						<sui-form-field>
							<label for="date">Actions</label>

							<sui-button @click="resetFilters" animated="vertical">
								<sui-button-content hidden>Reset</sui-button-content>
								<sui-button-content visible>
									<sui-icon name="undo" />
								</sui-button-content>
							</sui-button>

							<sui-button type="submit" animated="vertical">
								<sui-button-content hidden>Filter</sui-button-content>
								<sui-button-content visible>
									<sui-icon name="filter" />
								</sui-button-content>
							</sui-button>
						</sui-form-field>
					</sui-grid-column>
				</sui-grid-row>
			</sui-grid>
		</sui-form>
	</nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { Datetime } from 'vue-datetime'

export default {
  name: 'ExpenseFilters',
  components: {
    datetime: Datetime,
  },
  props: {
    filters: { type: Array, required: false, default: () => { return [] } },
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
          value: moment(this.endDate).startOf('day'),
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

      this.$emit('setFilters', filters)
    },
    resetFilters() {
      this.startDate = this.endDate = this.category = null;
      this.comparator = '>=';
      this.price = 0;
      this.$emit('setFilters', [])
    }
  },
  computed: {
    ... mapGetters('categories', [ 'expenseCategories' ]),
  },
}
</script>
