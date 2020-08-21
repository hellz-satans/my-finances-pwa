import db from '@/db';

const SKIP_DEFAULT_ACCOUNT = 'SKIP_DEFAULT_ACCOUNT'
const DEFAULT_ACCOUNT = {
  key: 'cash',
  name: 'Cash',
  balance: 0,
  color: '#2ecc70',
}

const AccountsStore = {
	state: {
		accounts: [],
    cache: {},
	},

	mutations: {
    addAccount(state, account) {
      state.accounts.push(account)
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

    toggleIncludeAccount(state, id) {
      db.accounts.get(id)
        .then((acc) => {
          return db.accounts.update(acc.id, {
            includeInSummary: !acc.includeInSummary,
          });
        })
        .catch((err) => {
          console.warn('account not found:', id);
          throw err;
        });
    },
	},

	actions: {

    createAccount({ commit }, account) {
      if (!account.key && account.name) {
        // TODO: add filter for account name
        account.key = account.name.toLowerCase()
      }
      return db.accounts.add(account)
        .then((id) => {
          account.id = id;
          commit('addAccount', account);
          return id;
        })
        .catch((err) => {
          console.error('[ACTION] createAccount:', err);
          throw err
        });
    },

    toggleIncludeAccount({ commit }, id) {
      commit('toggleIncludeAccount', id);
      // give it time to update the record
      window.setTimeout((ev) => { commit('getAccounts'); }, 180);
    },

		submitAccount({ commit, dispatch, state }, data) {
			const actionName = (data.key)
				? 'updateAccount'
				: 'createAccount';

      console.debug('[ACTION] submitAccount:', actionName, data);
			return dispatch(actionName, data)
				.then((id) => {
					return id;
				});
		},

    updateAccount({ commit, state }, data) {
      return db.accounts.get({ key: data.key })
        .then((acc) => {
          data.id = acc.id;
          return db.accounts.update(data.id, data);
        })
        .then((n) => {
          if (n > 0) {
            // update cached record
            state.accounts
              .map((el) => {
                if (el.id === data.id) {
                  for (let k in data) {
                    el[k] = data[k];
                  }
                }
              });
          }

          return n;
        });
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
          if (!account) {
            throw `Account not found: ${data.key}`;
          }

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
      if (!state.cache[data.from] || !state.cache[data.to])
        throw "Invalid accounts";
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
        return true;
      })
    },

		deleteAccount({ commit, dispatch }, account) {
      if (account.key == DEFAULT_ACCOUNT.key) {
        dispatch('preferences/createPreference', {
          key: SKIP_DEFAULT_ACCOUNT,
          value: true,
        },
        { root: true })
      }

			return db.accounts.delete(account.id)
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
						dispatch('deleteAccount', arr[i])
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

    /**
     * Default account.
     */
    createCashAccount({ commit }) {
      // make sure the preferences table exists
      if (db.preferences) {
        db.preferences
          .where('key').equals(SKIP_DEFAULT_ACCOUNT)
          .toArray()
          .then((arr) => {
            return arr.length === 0 || !arr[0].value
          })
          .then((shouldCreate) => {
            if (shouldCreate) {
              return db.accounts
                .where('key').equals(DEFAULT_ACCOUNT.key)
                .toArray()
            }
          })
          .then((arr) => {
            if (arr && arr.length === 0) {
              db.accounts.add(DEFAULT_ACCOUNT)
                .then((id) => {
                  commit('addAccount', DEFAULT_ACCOUNT)
                })
            }
          })
      }
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

      db.accounts.add({
        key: 'cash',
        name: 'Cash',
        balance: i * 100,
        color: '#00dd00',
      })
      commit('getAccounts')
    },
	},

	getters: {
    totalBalance: (state) => {
      if (state.accounts.length === 0)
        return 0;

      return state.accounts
        .filter(acc => acc.includeInSummary)
        .map(acc => acc.balance)
        .reduce((total, curr) => total + curr, 0);
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
