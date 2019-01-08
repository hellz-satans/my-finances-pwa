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
			return db.accounts.add(account);
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
			commit('toggleModal');
			return db.accounts.update(state.currentAccount.id, data);
		},
		deleteAccount({ commit }, id) {
			// on success, resolves with an undefined result
			return db.accounts.delete(id)
				.then((whatever) => {
					commit('getAccounts');
					return whatever;
				});
		},
		importAccount({ commit, state }, acc) {
			console.info('accounts/importAccount:', acc)
			// TODO: check if acc.name exists (===), if so, update balance
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
	},
};

export { AccountsStore };
