import db from '@/db';
import { categories as seeds } from '@/db/seeds';

const CategoriesStore = {
	state: {
		categories: [],
		subcategories: [],
	},

	mutations: {
		getCategories(state) {
			db.categories
				.toArray()
				.then(arr => arr.filter(el => !el.isSubcategory))
				.then(arr => state.categories = arr)
				.catch((err) => {
					console.error('getCategories:', err);
					throw err;
				});
		},
		getSubcategories(state) {
			db.categories
				.toArray()
				.then(arr => arr.filter(el => el.isSubcategory))
				.then(arr => state.subcategories = arr)
				.catch((err) => {
					console.error('getSubcategories:', err);
					throw err;
				});
		},
	},

	actions: {
		seedData({ commit }) {
			db.categories
				.toArray()
				.then((arr) => {
					let i = 0,
						j = 0,
						cat = null,
						subCat = null,
						subCatKey = null;

					for (i = 0; i < seeds.categories.length; ++i) {
						cat = seeds.categories[i];

						// insert categories
						if (!arr.some(el => el.key == cat.key)) {
							db.categories.add({
								key: cat.key,
								name: cat.name,
								icon: cat.icon,
								isSubcategory: false
							})
						}

						// insert subcategories
						for (j = 0; j < cat.subcategories.length; ++j) {
							subCat = cat.subcategories[j];
							subCatKey = `${cat.key}_${subCat.key}`;

							if (!arr.some(el => el.key == subCatKey)) {
								db.categories.add({
									key: subCatKey,
									name: subCat.name,
									icon: subCat.icon,
									isSubcategory: true
								});
							}
						}
					}
				})
				.then(() => commit('getCategories'))
				.then(() => commit('getSubcategories'));
		},
	},

	getters: {

		/**
		 * Semantic-UI-dropdown compatible options.
		 *
		 * <sui-dropdown multiple fluid selection> requires that the provided
		 * options have the format:
		 *
		 * ```
		 * 	{ key: '', text: '', value: '' }
		 * ```
		 *
		 * @return [Object]
		 */
		expenseCategories(state) {
			const list = [];
			let c = null;

			for (const i in state.categories) {
				c = state.categories[i];
				list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
			}

			return list;
		}
	},
};

export { CategoriesStore };
