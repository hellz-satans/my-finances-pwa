<template>
	<nav class="expense-filter">
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
      this.$store.dispatch('expenses/filterExpenses', {
        startDate: this.startDate,
        endDate: this.endDate,
        category: this.category,
        comparator: this.comparator,
        price: this.price,
      });
    },
    resetFilters() {
      this.startDate = this.endDate = null;
      this.comparator = '>=';
      this.price = 0;
      this.$store.dispatch('expenses/filterExpenses', {});
    }
  },
  computed: {
    ... mapGetters('categories', [ 'expenseCategories' ]),
  },
}
</script>
