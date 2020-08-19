import db from '@/db';

const requiredFields = [
	'key',
	'value',
]

const PreferencesStore = {
	state: {
		preferences: {},
	},

	mutations: {
		getPreferences(state) {
			db.preferences
				.toArray()
				.then(arr => {
          for (let el of arr) {
            state.preferences[el.key] = el.value
          }
        })
				.catch((err) => {
					console.error('preferences/getPreferences:', err)
					throw err
				})
		},

    setPreference(state, data) {
      state.preferences[data.key] = data.value;
    },
	},

	actions: {
    submitPreference({ commit, dispatch, state }, data) {
      let prom = null;

			for (const k of requiredFields) {
				if (!data[k]
            || data[k] === ''
            || data[k].trim && data[k].trim() === ''
        ) {
					console.error('preferences/updatePreference: missing', k, data);
					return false;
				}
			}

      // preference already exists
      if (state.preferences[data.key]) {
        prom = db.preferences.update(data.key, data);
      } else {
        prom = db.preferences.add(data);
      }

      return prom.then((n) => {
          commit('setPreference', data);
          return n
        });
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
	},
}

export { PreferencesStore }
