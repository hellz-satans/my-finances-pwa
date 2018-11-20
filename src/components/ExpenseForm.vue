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
			<label for="tags">Tags</label>
			<sui-dropdown
				placeholder="Tags"
				fluid
				multiple
				selection
				:options="expenseTags"
				v-model="tags"
			/>
		</sui-form-field>

		<sui-form-field>
			<label for="date">Date</label>
			<sui-input
				name="date"
				placeholder="Date"
				type="date"
				v-model="date"
			/>
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

	export default {
		name: 'ExpenseForm',
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
			... mapState([ 'categories' ]),
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
			expenseTags() {
				const tags = [];
				let c = null;

				for (const i in this.categories) {
					c = this.categories[i];
					tags.push({ key: c, text: c, value: c });
				}

				return tags;
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
			tags: {
				get() { return this.$store.state.expenses.currentExpense.tags; },
				set(value) {
					return this.$store.commit('expenses/updateCurrentExpenseTags', value);
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
