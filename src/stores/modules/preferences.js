import db from '@/db';

const requiredFields = [
	'key',
	'value',
]

const PreferencesStore = {
	state: {
		preferences: {},
		modals: {
			// TODO: remove this -- if not hard-coded, reactiveness doesn't trigger
			goal: false,
		},
	},

	mutations: {
		getPreferences(state) {
			db.preferences
				.toArray()
				.then(arr => {
          for (let el of arr) {
            for (let k in el) {
              state.preferences[k] = el
            }
          }
        })
				.catch((err) => {
					console.error('preferences/getPreferences:', err)
					throw err
				})
		},

		createPreference(state, data) {
			db.preferences.add(data)
			state.modals[data.key] = !state.modals[data.key]
		},

		updatePreference(state, data) {
			db.preferences.update(data.key, data)
			state.modals[data.key] = !state.modals[data.key]
		},

		toggleModal(state, key) {
			state.modals[key] = !state.modals[key]
		},
	},

	actions: {
		createPreference({ commit, state }, data) {
			for (const k of requiredFields) {
				if (!data[k] || data[k] === '' || data[k].trim && data[k].trim() === '') {
					console.error('preferences/createPreference: missing', k, data)
					return false
				}
			}

      // preference already exists
      if (state.preferences[data.key]) {
        commit('updatePreference', data)
      } else {
        commit('createPreference', data)
      }
			commit('getPreferences')
		},

		updatePreference({ commit }, data) {
			for (const k of requiredFields) {
				if (!data[k] || data[k] === '' || data[k].trim && data[k].trim() === '') {
					console.error('preferences/updatePreference: missing', k, data)
					return false
				}
			}

			commit('updatePreference', data)
			commit('getPreferences')
		},

		toggleModal({ commit }, key) {
			commit('toggleModal', key)
		},

		importPreferences({ dispatch }, newData) {
			db.preferences
				.toArray()
				.then((arr) => {
          let exists = false

          for (let pref of newData) {
            exists = arr.some((el) => {
              return el.key === pref.key
            })

            if (exists) {
              dispatch('updatePreference', pref)
            } else {
              dispatch('createPreference', pref)
            }
          }
				})
				.catch((err) => {
					console.error('preferences/importPreference:', err)
					throw err
				})
		},
	},

	getters: {
		goal(state) {
			const goalPreference = state.preferences['goal']

			if (goalPreference) {
				return goalPreference.value
			}

			return 0
		},
	},
}

export { PreferencesStore }
