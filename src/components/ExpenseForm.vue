<template>
	<article>
		<sui-button @click.native="toggleModal(true)" v-if="!hideBtn" positive>Add expense</sui-button>

		<sui-modal v-model="expenseModal" size="tiny">
			<sui-modal-header>Add expense</sui-modal-header>

			<sui-modal-content scrolling>
				<sui-form name="expense" method="POST">
					<sui-form-field>
						<label for="price">Price</label>
						<sui-input
							type="number"
							name="price"
							min="0.1"
							step="any"
							required
							v-model="price"
						/>
            <p v-for="(err, i) in expenseErrors.price" :key="i" class="red text">
              {{ err }}
            </p>
					</sui-form-field>

					<sui-form-field>
						<label for="date">Date</label>
						<datetime v-model="date" type="datetime" />
            <p v-for="(err, i) in expenseErrors.date" :key="i" class="red text">
              {{ err }}
            </p>
					</sui-form-field>

					<sui-form-field>
						<label for="qty">Quantity</label>
						<sui-input
							type="number"
							name="qty"
							min="1"
							step="1"
							required
							v-model="qty"
						/>
            <p v-for="(err, i) in expenseErrors.qty" :key="i" class="red text">
              {{ err }}
            </p>
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
            <p v-for="(err, i) in expenseErrors.category" :key="i" class="red text">
              {{ err }}
            </p>
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
            <p v-for="(err, i) in expenseErrors.subcategory" :key="i" class="red text">
              {{ err }}
            </p>
					</sui-form-field>

					<sui-form-field>
						<label for="description">Description</label>
						<sui-input
							name="description"
							minlength="1"
							pattern=".+"
							required
							v-model="description"
						/>
            <p v-for="(err, i) in expenseErrors.description" :key="i" class="red text">
              {{ err }}
            </p>
					</sui-form-field>
				</sui-form>
			</sui-modal-content>

			<sui-modal-actions>
				<sui-button @click="toggleModal">Close</sui-button>
				<sui-button positive @click="submitExpense">{{ action }}</sui-button>
			</sui-modal-actions>
		</sui-modal>
	</article>
</template>

<script>
	import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
	import { Datetime } from 'vue-datetime'

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
        this.$store.dispatch('expenses/submitExpense')
          .catch((err) => {
            console.error('expenseForm:', err, err.stack)
          })
			}
		},
		computed: {
			... mapGetters('categories', [ 'expenseCategories' ]),
			... mapState('categories', [ 'categories', 'subcategories' ]),
			... mapState('expenses', [ 'currentExpense', 'expenseErrors', 'openModal' ]),
			expenseSubcategories() {
				const list = []
				let c = null

				for (const i in this.subcategories) {
					c = this.subcategories[i]
					if (c.key.startsWith(this.category)) {
						list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon })
					}
				}

				return list
			},
			action() {
				return this.currentExpense.id ? 'Update' : 'Save'
			},
			description: {
				get() { return this.$store.state.expenses.currentExpense.description },
				set(v) { this.$store.commit('expenses/updateCurrentExpenseDescription', v) },
			},
			price: {
				get() { return this.$store.state.expenses.currentExpense.price },
				set(v) { this.$store.commit('expenses/updateCurrentExpensePrice', v) },
			},
			qty: {
				get() { return this.$store.state.expenses.currentExpense.qty },
				set(v) { this.$store.commit('expenses/updateCurrentExpenseQty', v) },
			},
			category: {
				get() { return this.$store.state.expenses.currentExpense.category },
				set(v) { this.$store.commit('expenses/updateCurrentExpenseCategory', v) },
			},
			subcategory: {
				get() { return this.$store.state.expenses.currentExpense.subcategory },
				set(v) { this.$store.commit('expenses/updateCurrentExpenseSubcategory', v) },
			},
			date: {
				// TODO: fix warning when setting the input[type=date] with this
				get() { return this.$store.state.expenses.currentExpense.date },
				set(v) { this.$store.commit('expenses/updateCurrentExpenseDate', v) },
			},

			expenseModal: {
				get() { return this.$store.state.expenses.openModal },
				set(v) { return this.$store.commit('expenses/toggleModal') },
			},
		}
	}
</script>
