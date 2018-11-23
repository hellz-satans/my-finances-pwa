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
						{{ getCategoryName(e.category) }},
						{{ getCategoryName(e.subcategory, true) }}
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

	export default {
		name: 'ExpenseList',
		props: {
			amount: { type: Number, required: false, default: null },
			sort: { type: Number, required: false, default: 1 },
		},
		methods: {
			... mapActions('expenses', [ 'editExpense', 'deleteExpense' ]),
			/**
			 * Return category name for given key.
			 *
			 * TODO: extract this function, maybe add a component or filter (?)
			 *
			 * @param key String Category key as found in DB
			 * @param isSubcategory Boolean Flag to indicate if it is a subcategory
			 * @return String
			 */
			getCategoryName(key, isSubcategory = false) {
				let cat = null;

				if (isSubcategory) {
					cat = this.subcategories.find(el => el.key === key);
				} else {
					cat = this.categories.find(el => el.key === key);
				}

				return cat
					? cat.name
					: key.replace(/^\w/, key.charAt(0).toUpperCase());
			},
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
