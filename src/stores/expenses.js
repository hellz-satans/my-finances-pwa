import db from '../db';
import { filterExpenses } from './filters';
import moment from 'moment';

const ExpensesStore = {
  namespaced: true,

  state: {
    currentExpense: { 
      description: null,
      price: 0,
      qty: 1,
      date: moment().format('YYYY-MM-DD'),
      tags: [],
    },
    expenses: [],
    expensesFilters: [],
  },

  mutations: {
    getExpenses(state, options = {}) {
      options.sort = options.sort || 1;

      db.expenses.toArray()
        .then((arr) => {
          if (options.sort) {
            arr.sort((a, b) => a.date - b.date);
          } else {
            // sort by date in decreasing order
            arr.sort((a, b) => b.date - a.date);
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
        state.currentExpense = { tags: [] };
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
