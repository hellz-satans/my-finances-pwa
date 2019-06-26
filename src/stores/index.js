import Vue from 'vue'
import Vuex from 'vuex'
import modules from '@/stores/modules'
import { downloadJsonUsingBrowser } from '@/download'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		accounts: {
			namespaced: true,
			... modules.accounts,
		},
		categories: {
			namespaced: true,
			... modules.categories,
		},
		expenses: {
			namespaced: true,
			... modules.expenses,
		},
		preferences: {
			namespaced: true,
			... modules.preferences,
		},
	},

	state: {
	},

	mutations: {
	},

	actions: {
		/**
		 * Destroy local data:
		 *
		 * 	* accounts
		 * 	* expenses
		 *
		 * @return void
		 */
		deleteData({ dispatch }) {
			dispatch('accounts/deleteAll')
			dispatch('expenses/deleteAll')
		},

		/**
		 * Export data in a secure fashion.
		 *
		 * Maybe ask the user for a passphrase or something like that.
		 * First encode data and then cipher it, see
		 * https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
		 */
		exportData({ state }) {
			const data = {
				accounts: state.accounts.accounts,
				expenses: state.expenses.expenses,
				preferences: state.preferences.preferences,
			};

			downloadJsonUsingBrowser('my_finances.json', data)
		},

		/**
		 * Import secured data.
		 *
		 * Maybe ask the user for a passphrase or something like that and
		 * decipher before inserting.
		 */
		importData({ dispatch }, data) {
			if (data.accounts) {
        dispatch('accounts/importAccounts', data.accounts)
			}
			if (data.expenses) {
        dispatch('expenses/importExpenses', data.expenses)
			}
			if (data.preferences) {
        dispatch('preferences/importPreferences', data.preferences)
			}
		},
	},

	getters: {
		balanceSummary: (state, getters, rootGetters) => {
			return getters['accounts/totalBalance'] - getters['expenses/totalExpenses'];
		},
	}
})
