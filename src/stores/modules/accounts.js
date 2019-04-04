import db from '@/db';

const AccountsStore = {
	state: {
		currentAccount: {
			name: null,
			balance: 0,
			color: '#1fbc9c',
		},
		openModal: false,
		accounts: [],
	},

	mutations: {
		createAccount(state, account) {
			db.accounts.add(account);
		},
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
			}
		},
		updateCurrentAccountName(state, name) {
			state.currentAccount.name = name;
		},
		updateCurrentAccountBalance(state, balance) {
			state.currentAccount.balance = Number(balance);
		},
		updateCurrentAccountColor(state, color) {
			state.currentAccount.color = color;
		},
		toggleModal(state) {
			state.openModal = !state.openModal;
		},
	},

	actions: {
		toggleModal({ commit }, unsetAccount = false) {
			if (unsetAccount) {
				commit('unsetCurrentAccount');
			}
			commit('toggleModal');
		},
		createAccount({ commit }, account) {
			commit('createAccount', account)
		},
		editAccount({ commit }, id) {
			commit('setCurrentAccount', id);
			commit('toggleModal');
		},
		submitAccount({ commit, dispatch, state }, data) {
			const actionName = (state.currentAccount.id)
				? 'updateAccount'
				: 'createAccount';

			return dispatch(actionName, data)
				.then((id) => {
					commit('getAccounts');
					commit('unsetCurrentAccount');
					commit('toggleModal');
					return id;
				});
		},
		updateAccount({ commit, state }, data) {
			return db.accounts.update(state.currentAccount.id, data);
		},
    deduct({ commit }, data) {
      return db.accounts.get(data.id)
        .then((account) => {
          const fields = {
            balance: account.balance - data.amount,
          }

          return db.accounts.update(account.id, fields)
        })
        .then((id) => {
          commit('getAccounts')
          return id
        })
    },
		deleteAccount({ commit }, id) {
			// on success, resolves with an undefined result
			return db.accounts.delete(id)
				.then((whatever) => {
					commit('getAccounts');
					return whatever;
				});
		},
		deleteAll({ dispatch }) {
			db.accounts
				.toArray()
				.then((arr) => {
					for (let i in arr) {
						dispatch('deleteAccount', arr[i].id)
					}
				})
				.catch((err) => {
					console.error('accounts/deleteAll:', err)
					throw err
				})
		},
		importAccount({ dispatch }, acc) {
			db.accounts
				.toArray()
				.then((arr) => {
					let exists = false

					exists = arr.some((el) => {
						return el.id === acc.id && el.name === acc.name
					})

					if (!exists) {
						dispatch('createAccount', acc)
					}
				})
				.catch((err) => {
					console.error('accounts/importAccount:', err)
					throw err
				})
		},
	},

	getters: {
		totalBalance: (state) => {
			if (state.accounts.length === 0)
				return 0;

			return state.accounts
				.map(acc => acc.balance)
				.reduce((total, curr) => total + curr);
		},
    /**
     * Return SUI-compatible options for dropdown component.
     *
     * @return [Object]
     */
    accountsOptions(state) {
      const list = []
      let a = null

      for (const i in state.accounts) {
        a = state.accounts[i]
        list.push({ key: a.id, text: a.name, value: a.id })
      }

      return list
    },
	},
};

export { AccountsStore };
