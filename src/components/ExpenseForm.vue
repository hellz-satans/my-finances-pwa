<template>
	<sui-form name="expense" method="POST" @submit.prevent="submitExpense">
		<sui-form-field>
			<label for="description">Description</label>
			<sui-input
				name="description"
				minlength="1"
				pattern="[\w\+\-=]+(\s+[\w\+\-=]+)*"
				required
				v-model="description"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="price">Price</label>
			<sui-input
				type="number"
				name="price"
				min="0"
				step="any"
				required
				v-model="price"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="quantity">Quantity</label>
			<sui-input
				type="number"
				name="quantity"
				min="0.01"
				step="any"
				required
				v-model="qty"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="category">Category</label>
			<sui-dropdown
				placeholder="Category"
				fluid
				selection
				:options="expenseCategories"
				v-model="category"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="subcategory">Subcategory</label>
			<sui-dropdown
				placeholder="Subcategory"
				fluid
				selection
				:options="expenseSubcategories"
				v-model="subcategory"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="date">Date</label>
			<datetime v-model="date" type="datetime"></datetime>
		</sui-form-field>

		<sui-button
			type="button"
			@click.prevent.stop="unsetCurrentExpense"
			v-if="action === 'Update'"
		>
			Cancel
		</sui-button>

		<sui-button text-align="right" type="submit">{{ action }}</sui-button>
	</sui-form>
</template>

<script>
	import { mapMutations, mapState } from 'vuex';
	import { Datetime } from 'vue-datetime';

	export default {
		name: 'ExpenseForm',
		components: {
			datetime: Datetime,
		},
		methods: {
			... mapMutations('expenses', [ 'unsetCurrentExpense' ]),

			submitExpense() {
				if (document.forms.expense.checkValidity()) {
					this.$store.dispatch('expenses/submitExpense', this.currentExpense)
						.catch((err) => {
							console.error('submitExpense:', err, err.stack);
						});
				} else {
					document.forms.expense.reportValidity();
					console.error('submitExpense: invalid data');
				}
			}
		},
		computed: {
			... mapState('categories', [ 'categories', 'subcategories' ]),
			... mapState('expenses', [ 'currentExpense' ]),

			/**
			 * Semantic-UI-dropdown compatible options.
			 *
			 * <sui-dropdown multiple fluid selection> requires that the provided
			 * options have the format:
			 *
			 * ```
			 * 	{ key: '', text: '', value: '' }
			 * ```
			 *
			 * @return [Object]
			 */
			expenseCategories() {
				const list = [];
				let c = null;

				for (const i in this.categories) {
					c = this.categories[i];
					list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
				}

				return list;
			},
			expenseSubcategories() {
				const list = [];
				let c = null;

				for (const i in this.subcategories) {
					c = this.subcategories[i];
					if (c.key.startsWith(this.category)) {
						console.debug('subcategory found', JSON.stringify(c));
						list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
					} else {
						console.debug('does NOT match', c);
					}
				}

				return list;
			},
			action() {
				return this.currentExpense.id ? 'Update' : 'Add';
			},
			description: {
				get() { return this.$store.state.expenses.currentExpense.description; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseDescription', value);
				},
			},
			price: {
				get() { return this.$store.state.expenses.currentExpense.price; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpensePrice', value);
				},
			},
			qty: {
				get() { return this.$store.state.expenses.currentExpense.qty; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseQty', value);
				},
			},
			category: {
				get() { return this.$store.state.expenses.currentExpense.category; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseCategory', value);
				},
			},
			subcategory: {
				get() { return this.$store.state.expenses.currentExpense.subcategory; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseSubcategory', value);
				},
			},
			date: {
				// TODO: fix warning when setting the input[type=date] with this
				get() { return this.$store.state.expenses.currentExpense.date; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseDate', value);
				},
			},
		}
	}
</script>
