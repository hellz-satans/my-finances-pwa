<template>
	<div>
		<sui-button @click.native="toggleModal(true)" v-if="!hideBtn" positive>Add expense</sui-button>

		<sui-modal v-model="expenseModal" size="tiny">
			<sui-modal-header>Add expense</sui-modal-header>

			<sui-modal-content>
				<sui-form name="expense" method="POST">
					<sui-form-field>
						<label for="price">Price</label>
						<sui-input
							type="number"
							name="price"
							min="0.1"
							step="any"
							required
							data-rules="min_value:0.1"
							data-vv-name="price"
							v-validate
							v-model="price"
						/>
					</sui-form-field>

					<sui-form-field>
						<label for="date">Date</label>
						<datetime v-model="date" type="datetime" v-validate="'required'">
						</datetime>
					</sui-form-field>

					<sui-form-field>
						<label for="quantity">Quantity</label>
						<sui-input
							type="number"
							name="quantity"
							min="0.01"
							step="any"
							required
							data-rules="min_value:0.1"
							data-vv-name="quantity"
							v-validate
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
							data-rules="required"
							data-vv-name="category"
							v-validate
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
							data-rules="required"
							data-vv-name="subcategory"
							v-validate
							v-model="subcategory"
						/>
					</sui-form-field>

					<sui-form-field>
						<label for="description">Description</label>
						<sui-input
							name="description"
							minlength="1"
							pattern="[\w\+\-=]+(\s+[\w\+\-=]+)*"
							required
							data-rules="required"
							data-vv-name="description"
							v-validate
							v-model="description"
						/>
					</sui-form-field>
				</sui-form>
			</sui-modal-content>

			<sui-modal-actions>
				<sui-button @click="toggleModal">Close</sui-button>
				<sui-button positive @click="submitExpense">{{ action }}</sui-button>
			</sui-modal-actions>
		</sui-modal>
	</div>
</template>

<script>
	import { mapMutations, mapActions, mapGetters, mapState } from 'vuex';
	import { Datetime } from 'vue-datetime';

	export default {
		name: 'ExpenseForm',
		props: ['hideBtn'],
		components: {
			datetime: Datetime,
		},
		methods: {
			... mapMutations('expenses', [ 'unsetCurrentExpense' ]),
			... mapActions('expenses', [ 'toggleModal' ]),
			submitExpense() {
				if (document.forms.expense.checkValidity()) {
					this.$store.dispatch('expenses/submitExpense')
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
			... mapGetters('categories', [ 'expenseCategories' ]),
			... mapState('categories', [ 'categories', 'subcategories' ]),
			... mapState('expenses', [ 'currentExpense', 'openModal' ]),
			expenseSubcategories() {
				const list = [];
				let c = null;

				for (const i in this.subcategories) {
					c = this.subcategories[i];
					if (c.key.startsWith(this.category)) {
						list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
					}
				}

				return list;
			},
			action() {
				return this.currentExpense.id ? 'Update' : 'Save';
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

			expenseModal: {
				get() { return this.$store.state.expenses.openModal; },
				set(value) { return this.$store.commit('expenses/toggleModal'); },
			},
		}
	}
</script>
