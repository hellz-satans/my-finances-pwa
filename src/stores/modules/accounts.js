import db from '@/db';

const AccountsStore = {
	state: {
		currentAccount: {
			name: null,
			balance: 0,
			color: '#1fbc9c',
		},
		openModal: false,
    transferModal: false,
		accounts: [],
    cache: {},
	},

	mutations: {
		createAccount(state, account) {
			db.accounts.add(account);
		},

		getAccounts(state) {
			db.accounts.toArray()
				.then(arr => state.accounts = arr)
        .then(() => {
          state.accounts.forEach((acc, i) => {
            state.cache[acc.key] = acc
          })
        })
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

		updateCurrentAccountName(state, name) { state.currentAccount.name = name; },
		updateCurrentAccountBalance(state, balance) { state.currentAccount.balance = Number(balance); },
		updateCurrentAccountColor(state, color) { state.currentAccount.color = color; },
		toggleModal(state) { state.openModal = !state.openModal; },
    toggleTransferModal(state) { state.transferModal = !state.transferModal },
	},

	actions: {
		toggleModal({ commit }, unsetAccount = false) {
			if (unsetAccount) {
				commit('unsetCurrentAccount');
			}
			commit('toggleModal');
		},

		toggleTransferModal({ commit }) { commit('toggleTransferModal') },

		createAccount({ commit }, account) {
      if (!account.key && account.name) {
        account.key = account.name.toLowerCase()
      }
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

    /**
     * Add (or deduct, if given a negative amount) credits from account.
     *
     * @option data {Number} amount If negative, deduct amount from balance
     * @option data {String} key Account key
     * @param {Object} data
     */
    add({ commit }, data) {
      return db.accounts.get({ key: data.key })
        .then((account) => {
          const fields = {
            // be paranoid about data types 'cuz JS
            balance: Number(account.balance + data.amount),
          }
          return db.accounts.update(account.id, fields)
        })
        .then((id) => {
          commit('getAccounts')
          return id
        })
        .catch((err) => {
          console.error('accounts/add:', err)
        })
    },

    /**
     * Transfer amount from one account to another
     *
     * @option data {Number} amount
     * @option data {String} from Account key
     * @option data {String} to Account key
     * @param {Object} data
     */
    transfer({ commit, dispatch, state }, data) {
      if (state.cache[data.from] && state.cache[data.to]) {
        let amount = Number(data.amount)

        dispatch('add', {
          amount: (amount * -1),
          key: state.cache[data.from].key,
        }).then((fromId) => {
          return dispatch('add', {
            amount: amount,
            key: state.cache[data.to].key,
          })
        }).then((toId) => {
					commit('toggleTransferModal');
        })
      }
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

		importAccounts({ dispatch }, newData) {
			db.accounts
				.toArray()
				.then((arr) => {
          let exists = false

          for (let acc of newData) {
            exists = arr.some((el) => {
              return el.id === acc.id && el.name === acc.name
            })

            if (!exists) {
              dispatch('createAccount', acc)
            }
					}
				})
				.catch((err) => {
					console.error('accounts/importAccount:', err)
					throw err
				})
		},

    seedData({ commit, state }) {
      const n = 2
      let i = 0,
        account = {}

      for (i = 1; i <= n; ++i) {
        account = {
          key: `account${i}`,
          name: `Account #${i}`,
          balance: i * 100,
          color: `#${i*2}${i*4+1}${i*2+3}`,
        }
        db.accounts.add(account)
      }
      commit('getAccounts')
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
