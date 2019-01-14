<template>
	<div>
		<table class="ui table">
			<thead>
				<tr>
					<th scope="col">Grand total</th>
					<th scope="col">Price</th>
					<th scope="col">Qty</th>
					<th scope="col">Description</th>
					<th scope="col">Category</th>
					<th scope="col">Date &darr;</th>
					<th scope="col">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="e in expensesList" :key="e.id">
					<td><b>{{ e.qty * e.price | currency }}</b></td>
					<td>{{ e.price | currency}}</td>
					<td>{{ e.qty }}</td>
					<td>{{ e.description }}</td>
					<td>
						<sui-icon :name="getIcon(e.subcategory, true)" />
						{{ getName(e.category) }},
						{{ getName(e.subcategory, true) }}
					</td>
					<td :title="e.date | format">{{ e.date | ago }}</td>
					<td>
						<sui-button size="mini" animated="vertical" @click="deleteExpense(e.id)">
							<sui-button-content visible>
								<sui-icon name="trash" />
							</sui-button-content>
							<sui-button-content hidden>Delete</sui-button-content>
						</sui-button>

						<sui-button size="mini" animated="vertical" @click="editExpense(e.id)">
							<sui-button-content visible>
								<sui-icon name="pencil" />
							</sui-button-content>
							<sui-button-content hidden>Edit</sui-button-content>
						</sui-button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { filterExpenses } from '@/stores/filters';

export default {
  name: 'ExpenseList',
  props: {
    amount: { type: Number, required: false, default: null },
    sort: { type: Number, required: false, default: 1 },
    filters: { type: Array, required: false, default: () => { return [] } },
  },
  methods: {
    ... mapActions('expenses', [ 'editExpense', 'deleteExpense' ]),

    /**
     * Return category name for given key.
     *
     * @param key String Category key as found in DB
     * @param isSubcategory Boolean Flag to indicate if it is a subcategory
     * @return String
     */
    getName(key = '', isSubcategory = false) {
      let cat = null

      if (isSubcategory) {
        cat = this.subcategories.find(el => el.key === key)
      } else {
        cat = this.categories.find(el => el.key === key)
      }

      if (!cat) {
        return key.replace(/^\w/, key.charAt(0).toUpperCase())
      }

      return cat.name
    },

    /**
     * Return category icon for given key.
     *
     * @param key String Category key as found in DB
     * @param isSubcategory Boolean Flag to indicate if it is a subcategory
     * @return String
     */
    getIcon(key = '', isSubcategory = false) {
      let cat = null

      if (isSubcategory) {
        cat = this.subcategories.find(el => el.key === key)
      } else {
        cat = this.categories.find(el => el.key === key)
      }

      if (!cat) {
        return key
      }

      return cat.icon
    }
  },
  computed: {
    ... mapState('expenses', [ 'expenses' ]),
    ... mapState('categories', [ 'categories', 'subcategories' ]),
    ... mapGetters('expenses', [ 'totalExpenses' ]),
    expensesList() {
      let list = [],
        i = 0,
        n = this.amount || this.expenses.length;

      // if we don't traverse the array manually, Vue reactivity kicks in
      // and messes with this.expenses, affecting the whole application.
      // tl;dr: do NOT use splice on this.expenses
      //
      // TODO: make it so that we take the _last_ n elements
      for (i = 0; i < n && i < this.expenses.length; ++i) {
        list.push(this.expenses[i]);
      }
      list = list.filter(exp => filterExpenses(exp, this.filters))

      if (this.sort) {
        list.sort((a, b) => moment(b.date) - moment(a.date));
      } else {
        list.sort((a, b) => moment(a.date) - moment(b.date));
      }

      return list;
    },
  },
}
</script>
