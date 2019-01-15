import db from '@/db';

const requiredFields = [
	'key',
	'value',
]

const PreferencesStore = {
	state: {
		preferences: [],
	},

	mutations: {
		getPreferences(state) {
			db.preferences
				.toArray()
				.then(arr => state.preferences = arr)
				.catch((err) => {
					console.error('preferences/getPreferences:', err);
					throw err;
				});
		},
		createPreference(state, data) {
			db.preferences.add(data)
		},
		updatePreference(state, data) {
			db.preferences.update(data.key, data)
		},
	},

	actions: {
		createPreference({ commit }, data) {
			for (const k in requiredFields) {
				if (!data[k] || data[k] === '' || data[k].trim && data[k].trim() === '') {
					console.error('preferences/createPreferences: missing', k, data)
					return false
				}
			}

			commit('createPreference', data)
		},
		updatePreference({ commit }, data) {
			for (const k in requiredFields) {
				if (!data[k] || data[k] === '' || data[k].trim && data[k].trim() === '') {
					console.error('preferences/updatePreferences: missing', k, data)
					return false
				}
			}

			commit('updatePreference', data)
		},
	},

	getters: {
		goal(state) {
			const goalPreference = state.preferences.find(el => el.key === 'goal')

			if (goalPreference) {
				return goalPreference.value
			}

			return 0
		},
	},
}

export { PreferencesStore }
