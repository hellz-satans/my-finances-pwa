import Vue from 'vue'
import Vuex from 'vuex'
import { Accounts, Expenses, Categories } from '@/stores/modules'
import { downloadJsonUsingBrowser } from '@/download'

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
    /**
     * Export data in a secure fashion.
     *
     * Maybe ask the user for a passphrase or something like that.
     * First encode data and then cipher it, see
     * https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
     */
    exportData({ state }) {
      const data = {
        expenses: state.expenses.expenses,
        accounts: state.accounts.accounts,
      };

      downloadJsonUsingBrowser('my_finances.json', data)
    },

    /**
     * Import secured data.
     *
     * Maybe ask the user for a passphrase or something like that and
     * decipher before inserting.
     */
    importData(ctx, data) {
      console.debug('Bleep-bloop, importing data');
    },
  },

  getters: {
    balanceSummary: (state, getters, rootGetters) => {
			return getters['accounts/totalBalance'] - getters['expenses/totalExpenses'];
    },
  }
})
