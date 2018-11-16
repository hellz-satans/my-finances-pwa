Vue.component('balance-summary', {
	template: `
	<section class="balance-summary">
		<h2 :class="cssClasses">Summary: \${{ balanceSummary }}</h2>
		<h3>Goal: \${{ goal }}</h3>
	</section>
	`,
	computed: {
		cssClasses() {
			return {
				orange: this.balanceSummary < 0
			};
		},
		... Vuex.mapState([ 'goal' ]),
		... Vuex.mapGetters([ 'balanceSummary' ])
	}
});

Vue.component('user-accounts', {
	template: `
	<section class="accounts">
		<h2>Accounts</h2>
		<account-list></account-list>
		<account-form></account-form>
	</section>
	`
});

Vue.component('account-list', {
	template: `
	<article class="account-list">
		<h3>Total balance: \${{ totalBalance }}</h3>
		<ul>
			<li v-for="acc in accounts">
				<b>{{ acc.name }}</b>: {{ acc.balance }}
				<button @click="editAccount(acc.id)">
					Edit &#9998;
				</button>
				<button class="white bg-red" @click="deleteAccount(acc.id)">
					Delete &#128465;
				</button>
			</li>
		</ul>
	</article>
	`,
	methods: {
		... Vuex.mapActions([ 'editAccount', 'deleteAccount' ])
	},
	computed: {
		... Vuex.mapState([ 'accounts' ]),
		... Vuex.mapGetters([ 'totalBalance' ])
	}
});

Vue.component('account-form', {
	template: `
	<form
		name="account"
		method="POST"
		@submit.prevent="submitAccount"
		class="account-form"
	>
		<fieldset class="flex">
			<legend>{{ action }} account</legend>

			<label class="form-field">
				Name:
				<input
					name="account_name"
					id="account_name"
					minlength="1"
					pattern="[\\w\\+\\-=]+(\\s+[\\w\\+\\-=]+)*"
					required
					v-model="name"
				>
			</label>

			<label class="form-field">
				Balance:
				<input
					type="number"
					name="account_balance"
					id="account_balance"
					step="any"
					required
					v-model="balance"
				>
			</label>

			<button
				type="button"
				@click.prevent.stop="unsetCurrentAccount"
				v-if="action === 'Update'"
				class="white bg-danger form-reset"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="form-submit"
			>
				{{ action }}
			</button>
		</fieldset>
	</form>
	`,

	methods: {
		... Vuex.mapMutations([ 'unsetCurrentAccount' ]),
		submitAccount() {
			if (document.forms.account.checkValidity()) {
				const data = {
					name: this.name,
					balance: this.balance
				};
				this.$store.dispatch('submitAccount', this.currentAccount)
				.catch((err) => {
					console.error('submitAccount:', err, err.stack);
				});
			} else {
				document.forms.account.reportValidity();
				console.error('submitAccount: invalid data');
			}
		}
	},

	computed: {
		... Vuex.mapState([ 'currentAccount' ]),
		action() {
			return this.currentAccount.id ? 'Update' : 'Add';
		},
		name: {
			get() { return this.$store.state.currentAccount.name; },
			set(value) {
				return this.$store.commit('updateCurrentAccountName', value);
			},
		},
		balance: {
			get() { return this.$store.state.currentAccount.balance; },
			set(value) {
				return this.$store.commit('updateCurrentAccountBalance', value);
			},
		}
	}
});

Vue.component('expenses', {
	template: `
	<section class="expenses">
		<h2>Expenses</h2>
		<expense-form></expense-form>
		<expense-list></expense-list>
	</section>
	`
});

Vue.component('expense-filters', {
	template: `
	<nav class="expense-filter">
		<h3 class="expense-filter-title">Filters</h3>
		<form
			name="filters"
			method="GET"
			@submit.prevent="filter"
			class="expense-filter-form"
		>
			<label class="form-field">
				From
				<input
					type="date"
					name="start_date"
					v-model="startDate"
				>
			</label>
			<label class="form-field">
				Until
				<input
					type="date"
					name="end_date"
					v-model="endDate"
				>
			</label>

			<fieldset>
				<legend>Price</legend>
				<label class="form-field">
					<span hidden>Comparator</span>
					<select name="price_comparator" v-model="comparator">
						<option value="<=">Up to</option>
						<option value=">=">At least</option>
					</select>
				</label>
				<label class="form-field">
					<span hidden>Unit price</span>
					<input
						type="number"
						name="grand_total"
						step="any"
						v-model="price"
					>
				</label>
			</fieldset>

			<button
				type="reset"
				class="form-reset"
				@click="resetFilters"
			>
				Reset
			</button>
			<button
				type="submit"
				class="form-submit"
			>
				Apply
			</button>
		</form>
	</nav>
	`,

	data() {
		return {
			startDate: null,
			endDate: null,
			comparator: '>=',
			price: 0
		};
	},

	methods: {
		filter() {
			console.info('filtering: from',
				this.startDate,
				'until',
				this.endDate,
				'. Price',
				this.comparator,
				this.price
			);

			this.$store.dispatch('filterExpenses', {
				startDate: this.startDate,
				endDate: this.endDate,
				comparator: this.comparator,
				price: this.price,
			});
		},
		resetFilters() {
			this.startDate = this.endDate = null;
			this.comparator = '>=';
			this.price = 0;
			this.$store.dispatch('filterExpenses', {});
		}
	}
});

Vue.component('expense-list', {
	template: `
	<article class="expense-list">
		<h3>Total \${{ totalExpenses }}</h3>
		<expense-filters></expense-filters>
		<table>
			<thead>
				<tr>
					<th scope="col"></th>
					<th scope="col">Grand total</th>
					<th scope="col">Price</th>
					<th scope="col">Qty</th>
					<th scope="col">Description</th>
					<th scope="col">Tags</th>
					<th scope="col">Date &darr;</th>
					<th scope="col" colspan="2">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(e, i) in expenses">
					<th scope="row">{{ i+1 }}</th>
					<td><b>\${{ e.qty * e.price }}</b></td>
					<td>\${{ e.price }}</td>
					<td>{{ e.qty }}</td>
					<td>{{ e.description }}</td>
					<td class="smaller">{{ e.tags.join(', ') }}</td>
					<td class="smaller">
						{{ e.date.getUTCMonth() + 1 }}/{{ e.date.getUTCDate() }}/{{ e.date.getUTCFullYear() }}
					</td>
					<td>
						<button @click="editExpense(e.id)">
							Edit &#9998;
						</button>
					</td>
					<td>
						<button class="white bg-red" @click="deleteExpense(e.id)">
							Delete &#128465;
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</article>
	`,

	methods: {
		... Vuex.mapActions([ 'editExpense', 'deleteExpense' ])
	},
	computed: {
		... Vuex.mapState([ 'expenses' ]),
		... Vuex.mapGetters([ 'totalExpenses' ])
	}
});

Vue.component('expense-form', {
	template: `
	<form
		name="expense"
		method="POST"
		@submit.prevent="submitExpense"
		class="expense-form"
	>
		<fieldset class="flex">
			<legend>{{ action }} expense</legend>

			<label class="form-field">
				Description:
				<input
					name="description"
					minlength="1"
					pattern="[\\w\\+\\-=]+(\\s+[\\w\\+\\-=]+)*"
					required
					v-model="description"
				>
			</label>

			<label class="form-field">
				Price:
				<input
					type="number"
					name="price"
					min="0"
					step="any"
					required
					v-model="price"
				>
			</label>

			<label class="form-field">
				Quantity:
				<input
					type="number"
					name="qty"
					min="0.01"
					step="any"
					required
					v-model="qty"
				>
			</label>

			<label class="form-field">
				Tags:
				<select
					multiple
					name="tags"
					required
					size="3"
					v-model="tags"
				>
					<option v-for="c in categories">{{ c }}</option>
				</select>
			</label>

			<label class="form-field">
				Date:
				<input
					type="date"
					name="date"
					required
					v-model="date"
				>
			</label>

			<button
				type="button"
				@click.prevent.stop="unsetCurrentExpense"
				v-if="action === 'Update'"
				class="white bg-danger form-reset"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="form-submit"
			>
				{{ action }}
			</button>
		</fieldset>
	</form>
	`,

	methods: {
		... Vuex.mapMutations([ 'unsetCurrentExpense' ]),

		submitExpense() {
			if (document.forms.expense.checkValidity()) {
				this.$store.dispatch('submitExpense', this.currentExpense)
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
		... Vuex.mapState([ 'currentExpense', 'categories' ]),
		action() {
			return this.currentExpense.id ? 'Update' : 'Add';
		},
		description: {
			get() { return this.$store.state.currentExpense.description; },
			set(value) {
				return this.$store.commit('updateCurrentExpenseDescription', value);
			},
		},
		price: {
			get() { return this.$store.state.currentExpense.price; },
			set(value) {
				return this.$store.commit('updateCurrentExpensePrice', value);
			},
		},
		qty: {
			get() { return this.$store.state.currentExpense.qty; },
			set(value) {
				return this.$store.commit('updateCurrentExpenseQty', value);
			},
		},
		tags: {
			get() { return this.$store.state.currentExpense.tags; },
			set(value) {
				return this.$store.commit('updateCurrentExpenseTags', value);
			},
		},
		date: {
			get() { return this.$store.state.currentExpense.date; },
			set(value) {
				return this.$store.commit('updateCurrentExpenseDate', value);
			},
		},
	}
});

Vue.component('expenses-chart', {
	extends: VueChartJs.Line,
	mixins: [ VueChartJs.mixins.reactiveProp ],
	mounted() {
		this.renderChart(this.chartData, this.options);
	}
});