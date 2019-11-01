import db from '@/db'
import { expensesInRange, filterExpenses } from '@/stores/filters'
import { expenseConstraints } from '@/stores/constraints'
import moment from 'moment'
import validate from 'validate.js'

function newExpense() {
  return {
    description: null,
    price: 0,
    date: moment().format(),
    tags: [],
    category: 'other',
    subcategory: 'other_other',
    account: 'cash',
    sign: -1,
  }
}

const ExpensesStore = {
  namespaced: true,

  state: {
    currentExpense: {
      description: null,
      price: 0,
      date: moment().format(),
      tags: [],
      category: 'other',
      subcategory: 'other_other',
      account: 'cash',
      sign: -1,
    },
    expenseErrors: {},
    expenses: [],
    filters: [
      {
        field: 'date',
        op: '>=',
        value: moment().startOf('month').toDate(),
        name: 'lapse',
      },
      { field: 'price', op: '<', value: 0, name: 'onlyNegative', },
    ],
    openModal: false,
  },

  mutations: {
    createExpense(state, expense) {
      expense.date = new Date(expense.date)
      return db.expenses.add(expense)
    },
    setNewExpense(state) {
      state.currentExpense = newExpense()
    },
    getExpenses(state, options = {}) {
      options.decreasing = options.decreasing || true

      db.expenses.toArray()
        .then((arr) => {
          // convert dates to moment instances
          for (const exp of arr) {
            exp.date = moment(exp.date)
          }
          return arr
        }).then((arr) => {
          return arr.filter(exp => filterExpenses(exp, state.filters))
        }).then((arr) => {
          if (options.decreasing) {
            // sort by date in decreasing order
            arr.sort((a, b) => b.date - a.date)
          } else {
            arr.sort((a, b) => a.date - b.date)
          }
          return arr
        }).then((arr) => {
          state.expenses = arr
        }).catch((err) => {
          console.error('getExpenses:', err)
          throw err
        })
    },
    setFilters(state, newFilters) {
      state.filters = newFilters
    },
    setCurrentExpense(state, id) {
      db.expenses.get(id)
        .then((expense) => {
          expense.date = moment(expense.date).format()
          expense.sign = (expense.price < 0) ? -1 : 1
          expense.price = Math.abs(expense.price)
          state.currentExpense = expense
          return id
        })
        .catch((err) => {
          console.warn('expense not found:', id)
          throw err
        })
    },
    updateCurrentExpenseDescription(state, description) {
      state.currentExpense.description = description
    },
    updateCurrentExpensePrice(state, price) {
      state.currentExpense.price = Number(price)
    },
    updateCurrentExpenseCategory(state, category) {
      state.currentExpense.category = category
    },
    updateCurrentExpenseSubcategory(state, subcategory) {
      state.currentExpense.subcategory = subcategory
    },
    updateCurrentExpenseDate(state, date) {
      state.currentExpense.date = date
    },
    updateCurrentExpenseAccount(state, account) {
      state.currentExpense.account = account
    },
    updateCurrentExpenseSign(state, sign) {
      if (sign === 1 || sign === -1) {
        state.currentExpense.sign = sign
      } else {
        state.currentExpense.sign = -1
      }
    },
    toggleModal(state) {
      state.openModal = !state.openModal
    },
  },

  actions: {
    toggleModal({ commit }, unsetExpense) {
      if (unsetExpense) {
        commit('setNewExpense')
      }
      commit('toggleModal')
    },
    createExpense({ commit, dispatch }, expense) {
      commit('createExpense', expense)

      if (expense.account) {
        const deduct = {
          key: expense.account,
          amount: expense.price,
        }
        dispatch('accounts/add', deduct, { root: true })
      }
    },
    updateExpense({ commit, state }, data) {
      // convert date input to Date type
      if (data.date) {
        data.date = new Date(data.date)
      }
      // TODO: update account balance

      return db.expenses.update(state.currentExpense.id, data)
    },
    editExpense({ commit }, id) {
      commit('setCurrentExpense', id)
      commit('toggleModal')
    },
    /**
     * Submit current expense for storage.
     */
    submitExpense({ commit, dispatch, state }) {
      const actionName = (state.currentExpense.id)
        ? 'updateExpense'
        : 'createExpense'
      const data = {
        account: state.currentExpense.account,
        category: state.currentExpense.category,
        date: state.currentExpense.date,
        description: ((state.currentExpense.description != null)
          ? state.currentExpense.description.trim()
          : null),
        price: state.currentExpense.price * state.currentExpense.sign,
        subcategory: state.currentExpense.subcategory,
      }
      const errors = validate(data, expenseConstraints)

      if (!errors) {
        return dispatch(actionName, data)
          .then((id) => {
            commit('getExpenses')
            commit('toggleModal')
            commit('setNewExpense')
            state.expenseErrors = {}
            return id
          })
      } else {
        console.error('submitExpense:', errors)
        state.expenseErrors = errors
      }
    },
    deleteExpense({ commit }, id) {
      // on success, resolves with an undefined result
      return db.expenses.delete(id)
        .then((whatever) => {
          commit('getExpenses')
          return whatever
        })
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
    setFilters({ commit }, filters) {
      commit('setFilters', filters)
      window.setTimeout(() => { commit('getExpenses') }, 5)
    },
    importExpenses({ commit, dispatch }, newData) {
      db.expenses
        .toArray()
        .then((arr) => {
          arr.forEach((el) => el.date = moment(el.date))
          return arr
        })
        .then((arr) => {
          let exists = false

          for (let exp of newData) {
            // convert newData's date to moment instance
            exp.date = moment(exp.date)

            // compare price & moment's dates
            exists = arr.some((el) => el.price == exp.price && exp.date.isSame(el.date))

            if (!exists) {
              delete exp.id
              dispatch('createExpense', exp)
            }
          }
        })
        .then(() => {
          commit('getExpenses')
        })
        .catch((err) => {
          console.error('expenses/importExpense:', err)
          throw err
        })
    },
    seedData({ commit, state }) {
      db.categories
        .toArray()
        .then(arr => arr.filter(c => c.isSubcategory))
        .then((categories) => {
          const n = 15
          let i = 0,
            cat = null

          for (i = 1; i <= n; ++i) {
            cat = categories[Math.floor(Math.random() * (categories.length))]
            let expense = {
              description: `Example expense #${i}`,
              price: Math.floor(Math.random() * (100 - 20) + 20) * -1,
              category: cat.key.split('_')[0],
              subcategory: cat.key,
              date: new Date(moment().subtract(i, 'd').toISOString()),
            }
            db.expenses.add(expense)
          }
          commit('getExpenses')
        })
    },
  },

  getters: {
    totalExpenses: (state) => {
      if (state.expenses.length === 0)
        return 0

      return state.expenses
        .filter(expense => expense.price < 0)
        .map(expense => expense.price)
        .reduce((total, curr) => total + curr)
    },
    expensesPastWeek: (state) => {
      return expensesInRange(state.expenses, 1, 'week', { onlyNegative: true })
    },
    expensesPastMonth: (state) => {
      return expensesInRange(state.expenses, 1, 'month', { onlyNegative: true })
    },
  },
}

export { ExpensesStore }
