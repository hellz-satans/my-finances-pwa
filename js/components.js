Vue.component('balance-summary', {
	template: `
	<div class="balance-summary">
		<h2 :class="cssClasses">Summary: \${{ balanceSummary }}</h2>
		<h3>Goal: \${{ goal }}</h3>
	</div>
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
	<article class="accounts">
		<h2>Accounts</h2>
		<account-list></account-list>
		<account-form></account-form>
	</article>
	`
});

Vue.component('account-list', {
	template: `
	<div class="account-list">
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
	</div>
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
		<fieldset>
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
				console.debug('submitAccount:', data);
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

Vue.component('expense-list', {
	template: `
	<div class="expense-list">
		<h3>Total \${{ totalExpenses }}</h3>
		<ul>
			<li v-for="e in expenses">
				<b>\${{ e.qty * e.price }}</b>:
				{{ e.description }} (\${{ e.price }}) x {{ e.qty }}
				<span class="smaller gray">{{ e.date }}</span>
				<button @click="editExpense(e.id)">
					Edit &#9998;
				</button>
				<button class="white bg-red" @click="deleteExpense(e.id)">
					Delete &#128465;
				</button>
			</li>
		</ul>
	</div>
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
		<fieldset>
			<legend>{{ action }} expense</legend>

			<label class="form-field">
				Description:
				<input
					name="expense_description"
					id="expense_description"
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
					name="expense_price"
					id="expense_price"
					min="0"
					required
					v-model="price"
				>
			</label>

			<label class="form-field">
				Quantity:
				<input
					type="number"
					name="expense_qty"
					min="1"
					required
					v-model="qty"
				>
			</label>

			<label class="form-field">
				Date:
				<input
					type="date"
					name="expense_date"
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
		... Vuex.mapState([ 'currentExpense' ]),
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
		date: {
			get() { return this.$store.state.currentExpense.date; },
			set(value) {
				return this.$store.commit('updateCurrentExpenseDate', value);
			},
		},
	}
});
