import Vue from 'vue'
import Vuex from 'vuex'
import { Accounts, Expenses, Categories } from './stores'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accounts: {
      namespaced: true,
      ... Accounts,
    },
    categories: {
      namespaced: true,
      ... Categories,
    },
    expenses: {
      namespaced: true,
      ... Expenses,
    },
  },

  state: {
    // TODO: get goal & categories from db
    goal: 200000,
    categories: [
      'food', 'dinner', 'transport',
      'date', 'friends', 'others'
    ]
  },

  mutations: {
  },

  actions: {
  },

  getters: {
    balanceSummary: (state, getters, rootGetters) => {
			return getters['accounts/totalBalance'] - getters['expenses/totalExpenses'];
    },
  }
})
