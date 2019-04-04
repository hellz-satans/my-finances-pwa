<template>
  <span class="category-label">
    <sui-icon :name="getIcon(category.subcategory, true)" />
    <span class="text-small">
      {{ getName(category.category) }},
    </span>
    <br>
    <span class="text-smaller">
      {{ getName(category.subcategory, true) }}
    </span>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    category: { required: true, type: Object },
  },
  computed: {
    ... mapState('categories', [ 'categories', 'subcategories' ]),
  },
  methods: {
    /**
     * Return category name for given key.
     *
     * @param key String Category key as found in DB
     * @param isSubcategory Boolean Flag to indicate if it is a subcategory
     * @return String
     */
    getName(key = '', isSubcategory = false) {
      let cat = null

      if (isSubcategory) {
        cat = this.subcategories.find(el => el.key === key)
      } else {
        cat = this.categories.find(el => el.key === key)
      }

      if (!cat) {
        return key.replace(/^\w/, key.charAt(0).toUpperCase())
      }

      return cat.name
    },

    /**
     * Return category icon for given key.
     *
     * @param key String Category key as found in DB
     * @param isSubcategory Boolean Flag to indicate if it is a subcategory
     * @return String
     */
    getIcon(key = '', isSubcategory = false) {
      let cat = null

      if (isSubcategory) {
        cat = this.subcategories.find(el => el.key === key)
      } else {
        cat = this.categories.find(el => el.key === key)
      }

      if (!cat) {
        return key
      }

      return cat.icon
    },
  },
}
</script>
