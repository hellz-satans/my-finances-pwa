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
  }
}

const ExpensesStore = {
  namespaced: true,

  state: {
    expenseErrors: {},
    expenses: [],
    filters: [
      {
        field: 'date',
        op: '>=',
        value: moment().startOf('month').toDate(),
        name: 'lapse',
      },
      // { field: 'price', op: '<', value: 0, name: 'onlyNegative', },
    ],
  },

  mutations: {
    createExpense(state, expense) {
      expense.date = new Date(expense.date)
      return db.expenses.add(expense)
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
  },

  actions: {
    createExpense({ commit, dispatch }, expense) {
      commit('createExpense', expense)

      if (expense.account) {
        const deduct = {
          key: expense.account,
          amount: expense.price,
        }
        dispatch('accounts/add', deduct, { root: true })
      }

      // 1 does NOT mean it was successful, as the mutation
      // `createExpense` might have failed. We cannot know.
      // We should probably move the `db` call here and then commit the
      // `getExpenses` mutation
      return 1
    },

    updateExpense({ commit, state }, data) {
      // convert date input to Date type
      if (data.date) {
        data.date = new Date(data.date)
      }

      return db.expenses.update(data.id, data)
    },

    /**
     * Submit expense expense for storage.
     */
    submitExpense({ commit, dispatch, state }, input) {
      const actionName = (input.id)
        ? 'updateExpense'
        : 'createExpense'
      const data = {
        account: input.account,
        category: input.category,
        date: input.date,
        description: ((input.description != null)
          ? input.description.trim()
          : null),
        price: input.price,
        subcategory: input.subcategory,
      }

      if (input.id) {
        data.id = Number(input.id) // make sure we use the correct data type for id
      }
      const errors = validate(data, expenseConstraints)

      if (!errors) {
        return dispatch(actionName, data)
          .then((resp) => {
            commit('getExpenses')
            state.expenseErrors = {}
            return true
          })
      } else {
        console.error('submitExpense:', errors)
        state.expenseErrors = errors
        return false
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
              // dispatch will trigger an event for the account, so we trigger
              // the mutation instead
              commit('createExpense', exp)
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
