import db from '@/db';
import { filterExpenses } from '@/stores/filters';
import moment from 'moment';

function newExpense () {
	return {
		description: null,
		price: 0,
		qty: 1,
		date: moment().format(),
		tags: [],
		category: 'other',
		subcategory: 'other_other',
	}
}

const ExpensesStore = {
	namespaced: true,

	state: {
		currentExpense: {
			description: null,
			price: 0,
			qty: 1,
			date: moment().format(),
			tags: [],
			category: 'other',
			subcategory: 'other_other',
		},
		expenses: [],
		expensesFilters: [],
		openModal: false,
	},

	mutations: {
		createExpense(state, expense) {
			expense.date = new Date(expense.date);
			db.expenses.add(expense);
		},
		setNewExpense(state) {
			state.expense = newExpense;
		},
		getExpenses(state, options = {}) {
			options.sort = options.sort || 1;

			db.expenses.toArray()
				.then((arr) => {
					if (options.sort) {
						// sort by date in decreasing order
						arr.sort((a, b) => moment(b.date) - moment(a.date));
					} else {
						arr.sort((a, b) => moment(a.date) - moment(b.date));
					}
					return arr;
				}).then((arr) => {
					return arr.filter((exp) => filterExpenses(exp, state.expensesFilters));
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
					expense.date = moment(expense.date).format();
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
		updateCurrentExpenseCategory(state, category) {
			state.currentExpense.category = category;
		},
		updateCurrentExpenseSubcategory(state, subcategory) {
			state.currentExpense.subcategory = subcategory;
		},
		updateCurrentExpenseDate(state, date) {
			state.currentExpense.date = date;
		},
		toggleModal(state) {
			state.openModal = !state.openModal;
		},
	},

	actions: {
		toggleModal({ commit }, unsetExpense) {
			if(unsetExpense) {
				commit('unsetCurrentExpense');
			}
			commit('toggleModal');
		},
		createExpense({ commit }, expense) {
			commit('createExpense', expense)
			window.setTimeout(ev => commit('getExpenses'), 10)
		},
		editExpense({ commit }, id) {
			commit('setCurrentExpense', id);
			commit('toggleModal');
		},
		/**
		 * Submit current expense for storage.
		 */
		submitExpense({ commit, dispatch, state }) {
			const actionName = (state.currentExpense.id)
				? 'updateExpense'
				: 'createExpense';
			const data = {
				category: state.currentExpense.category,
				date: state.currentExpense.date,
				description: state.currentExpense.description,
				price: state.currentExpense.price,
				qty: state.currentExpense.qty,
				subcategory: state.currentExpense.subcategory
			}

			return dispatch(actionName, data)
				.then((id) => {
					commit('getExpenses');
					commit('unsetCurrentExpense');
					commit('toggleModal');
					commit('setNewExpense');
					return id;
				});
		},
		updateExpense({ commit, state }, data) {
			// convert date input to Date type
			if (data.date) {
				data.date = new Date(data.date);
			}

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
		deleteAll({ dispatch }) {
			db.expenses
				.toArray()
				.then((arr) => {
					for (let i in arr) {
						dispatch('deleteExpense', arr[i].id)
					}
				})
				.catch((err) => {
					console.error('expenses/deleteAll:', err)
					throw err
				})
		},
		filterExpenses({ commit, state }, data) {
			const filters = [];
			if (data.startDate) {
				filters.push({ field: 'date', op: '>=', value: new Date(data.startDate) });
			}

			if (data.endDate) {
				filters.push({ field: 'date', op: '<=', value: new Date(data.endDate) });
			}

			if (data.price) {
				filters.push({
					field: 'price',
					op: (data.comparator === '<=') ? '<=' : '>=',
					value: data.price
				});
			}

			state.expensesFilters = filters;
			commit('getExpenses');
		},

		/**
		 * Seed random data to the DB.
		 */
		seedData({ commit, state }, data) {
			db.expenses
				.toArray()
				.then((arr) => {
					if (arr.length > 0)
						return undefined;

					const n = 15;
					let i = 0,
						j = 0,
						expense = {};
					for (i = 0; i < n; ++i) {
						j = Math.random() * (20 - 1) + 1; // day range
						expense.description = `Expense ${i}`;
						expense.price = Math.floor(Math.random() * (100 - 20) + 20);
						expense.qty = 1;
						expense.category = 'other';
						expense.subcategory = 'other_other';
						if (Math.random() < 0.50) {
							expense.date = new Date(moment().subtract(j, 'd').toISOString());
						} else {
							expense.date = new Date(moment().add(j, 'd').toISOString());
						}

						db.expenses.add(expense);
					}
				})
				.then(() => commit('getExpenses'));
		},
		importExpense({ commit, dispatch }, exp) {
			db.expenses
				.toArray()
				.then((arr) => {
					let exists = false

					exists = arr.some((el) => {
						return el.id === exp.id && el.date === exp.date
					})

					if (!exists) {
						dispatch('createExpense', exp)
					}
				})
				.catch((err) => {
					console.error('expenses/importExpense:', err)
					throw err
				})
		},
	},

	getters: {
		totalExpenses: (state) => {
			if (state.expenses.length === 0)
				return 0;

			return state.expenses
				.map(expense => expense.price * expense.qty)
				.reduce((total, curr) => total + curr);
		},
	}
};

export { ExpensesStore };
