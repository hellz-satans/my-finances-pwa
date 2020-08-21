import db from '@/db';
import { CategoriesService } from '@/services/categories';
import { categories as seeds } from '@/db/seeds';

const CategoriesStore = {
  state: {
    categories: [],
    subcategories: [],

    /**
     * Key-based cache for categories & subcategories
     */
    cache: {},
  },

	mutations: {
    addCategory(state, category) {
      state.categories.push(category);
    },

    addSubcategory(state, subcategory) {
      state.subcategories.push(subcategory);
    },

    getCategories(state) {
      db.categories
        .toArray()
        // set cache entries -- we can get away with only doin' it here
        .then((arr) => {
          for (let el of arr)
            state.cache[el.key] = el;
          return arr;
        })
        .then(arr => arr.filter(el => !el.deleted))
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
        .then(arr => arr.filter(el => !el.deleted))
        .then(arr => arr.filter(el => el.isSubcategory))
        .then(arr => state.subcategories = arr)
        .catch((err) => {
          console.error('getSubcategories:', err);
          throw err;
        });
    },
  },

	actions: {
    async submitCategory({ dispatch, commit, state }, input) {
      let category = null,
        data = null,
        subcategory = null;

      data = {
        key:  input.categoryKey,
        name: input.category,
        isSubcategory: false,
      }
      // do NOT update category icon when we edit a subcategory
      if (!input.isSubcategory) data.icon = input.icon;
      category = await CategoriesService.upsert(input.categoryKey, data);

      if (input.isSubcategory) {
        data = {
          key:  input.subcategoryKey,
          name: input.subcategory,
          icon: input.icon,
          isSubcategory: true,
        };
        if (!data.key) {
          data.key = CategoriesService.generateKey(data.name);
          data.key = `${category.key}_${data.key}`;
        }

        subcategory = await CategoriesService.upsert(data.key, data);
      }

      // expensive, but I'm lazy
      commit('getCategories');
      commit('getSubcategories');

      return input.isSubcategory
        ? subcategory
        : category;
    },

    async deleteCategory({ commit, state }, input) {
      let category = {
        key: input.subcategoryKey || input.categoryKey,
        isSubcategory: input.isSubcategory,
      }
      const count = await CategoriesService.deleteCategory(category);
      console.info(`Deleted ${count} categories`);

      // expensive, but I'm lazy
      commit('getCategories');
      commit('getSubcategories');

      return count;
    },

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
		categoryOptions(state) {
			const list = [];
			let c = null;

			for (const i in state.categories) {
				c = state.categories[i];
				list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
			}

			return list;
		},

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
    subcategoryOptions: (state) => (category) => {
      const list = [];
      let c = null,
        i = 0;

      for (i in state.subcategories) {
        c = state.subcategories[i];
        if (c.key.startsWith(category)) {
          list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon });
        }
      }

      return list;
    },

    categoriesKeys(state) {
      return state.categories.flatMap(cat => cat.key)
    },
	},
};

export { CategoriesStore };
