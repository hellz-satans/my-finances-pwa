'use strict';

try {
	// setup db
	// TODO: extract db definition to its own file/module
	const db = new Dexie('Finances');
	db.version(1).stores({
		accounts: '++id,name,balance',
		expenses: '++id,description,price,qty,date'
	});
	db.version(2).stores({
		accounts: '++id,name,balance',
		expenses: '++id,description,price,qty,tags,date'
	}).upgrade((trans) => {
		return trans.expenses
			.toCollection()
			.modify((exp) => {
				if (!exp.tags)
					exp.tags = [];
			});
	});
	db.version(3).upgrade((trans) => {
		return trans.expenses
			.toCollection()
			.modify((exp) => {
				exp.date = new Date(exp.date);
			});
	});

	// setup Vuex store
	// TODO: use store modules
	const store = new Vuex.Store({
		state: {
			goal: 200000,
			currentAccount: {},
			currentExpense: {},
			accounts: [],
			expenses: [],
			expensesFilters: [],
			categories: [
				'food', 'dinner', 'transport',
				'date', 'friends', 'others'
			]
		},
		mutations: {
			// accounts
			getAccounts(state) {
				db.accounts.toArray()
					.then(arr => state.accounts = arr)
					.catch((err) => {
						console.error('getAccounts:', err);
						throw err;
					});
			},
			setCurrentAccount(state, id) {
				db.accounts.get(id)
					.then((account) => {
						state.currentAccount = account;
						return id;
					})
					.catch((err) => {
						console.warn('account not found:', id);
						throw err;
					});
			},
			unsetCurrentAccount(state) {
				if (state.currentAccount.id) {
					state.currentAccount = {};
					window.setTimeout(ev => document.forms.account.reset(), 100);
				}
			},
			updateCurrentAccountName(state, name) {
				state.currentAccount.name = name;
			},
			updateCurrentAccountBalance(state, balance) {
				state.currentAccount.balance = Number(balance);
			},
			// expenses
			getExpenses(state) {
				db.expenses.toArray()
					.then((arr) => {
						// sort by date in decreasing order
						arr.sort((a, b) => b.date - a.date);
						return arr;
					}).then((arr) => {
						// filter results -- TODO: extract this function
						return arr.filter((exp) => {
							let f = null, // current filter
								allow = true;

							for (const i in state.expensesFilters) {
								f = state.expensesFilters[i];

								switch (f.op) {
									case '<':
										allow = exp[f.field] < f.value;
										break;
									case '<=':
										allow = exp[f.field] <= f.value;
										break;
									case '>':
										allow = exp[f.field] > f.value;
										break;
									case '>=':
										allow = exp[f.field] >= f.value;
										break;
									case '==':
										allow = exp[f.field] == f.value;
										break;
									case '===':
										allow = exp[f.field] === f.value;
										break;
									default:
										console.debug('filter: entered default case');
										allow = true;
								}

								// if a single restriction fails, abort
								if (!allow)
									return false;
							}

							return allow;
						});
					}).then((arr) => {
						state.expenses = arr;
					}).catch((err) => {
						console.error('getExpenses:', err);
						throw err;
					});
			},
			setCurrentExpense(state, id) {
				return db.expenses.get(id)
					.then((expense) => {
						state.currentExpense = expense;
						return id;
					})
					.catch((err) => {
						console.warn('expense not found:', id);
						throw err;
					});
			},
			unsetCurrentExpense(state) {
				if (state.currentExpense.id) {
					state.currentExpense = {};
					window.setTimeout(ev => document.forms.expense.reset(), 100);
				}
			},
			updateCurrentExpenseDescription(state, description) {
				state.currentExpense.description = description;
			},
			updateCurrentExpensePrice(state, price) {
				state.currentExpense.price = Number(price);
			},
			updateCurrentExpenseQty(state, qty) {
				state.currentExpense.qty = Number(qty);
			},
			updateCurrentExpenseTags(state, tags) {
				state.currentExpense.tags = tags;
			},
			updateCurrentExpenseDate(state, date) {
				state.currentExpense.date = date;
			},
		},
		actions: {
			// accounts
			createAccount({ commit }, account) {
				return db.accounts.add(account);
			},
			editAccount({ commit }, id) {
				commit('setCurrentAccount', id);
			},
			submitAccount({ commit, dispatch, state }, data) {
				const actionName = (state.currentAccount.id)
					? 'updateAccount'
					: 'createAccount';

				return dispatch(actionName, data)
					.then((id) => {
						commit('getAccounts');
						commit('unsetCurrentAccount');
						return id;
					});
			},
			updateAccount({ commit, state }, data) {
				return db.accounts.update(state.currentAccount.id, data);
			},
			deleteAccount({ commit }, id) {
				// on success, resolves with an undefined result
				return db.accounts.delete(id)
					.then((whatever) => {
						commit('getAccounts');
						return whatever;
					});
			},
			// expenses
			/**
			 * Create expense record.
			 *
			 * Dexies takes a reactive Vue object and, if the transaction
			 * is successful, adds the property `id` to the object.
			 * That's why `unsetCurrentExpense` works, 'cuz the object is
			 * being passed around by reference.
			 *
			 * @return Promise
			 */
			createExpense({ commit }, expense) {
				expense.date = new Date(expense.date);
				return db.expenses.add(expense);
			},
			editExpense({ commit }, id) {
				commit('setCurrentExpense', id);
			},
			submitExpense({ commit, dispatch, state }, data) {
				const actionName = (state.currentExpense.id)
					? 'updateExpense'
					: 'createExpense';

				return dispatch(actionName, data)
					.then((id) => {
						commit('getExpenses');
						commit('unsetCurrentExpense');
						return id;
					});
			},
			updateExpense({ commit, state }, data) {
				// convert date input to Date type
				if (data.date)
					data.date = new Date(data.date);
				return db.expenses.update(state.currentExpense.id, data);
			},
			deleteExpense({ commit }, id) {
				// on success, resolves with an undefined result
				return db.expenses.delete(id)
					.then((whatever) => {
						commit('getExpenses');
						return whatever;
					});
			},
		},
		getters: {
			totalExpenses: state => {
				if (state.expenses.length === 0)
					return 0;
				return state.expenses
					.map(expense => expense.price * expense.qty)
					.reduce((total, curr) => total + curr);
			},
			totalBalance: state => {
				if (state.accounts.length === 0)
					return 0;
				return state.accounts
					.map(acc => acc.balance)
					.reduce((total, curr) => total + curr);
			},
			balanceSummary: (state, getters) => {
				return getters.totalBalance - getters.totalExpenses;
			}
		}
	});

	window.myfin = new Vue({
		el: '#app',
		store,
		data() {
			return {};
		},
		created() {
			this.$store.commit('getAccounts');
			this.$store.commit('getExpenses');
		}
	});
} catch(err) {
	window.alert("Could not load dependencies");
	console.error(err, err.stack);
}