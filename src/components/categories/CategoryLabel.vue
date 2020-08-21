<template>
  <span class="category-label">
    <sui-icon :name="getIcon(category.subcategory, true)" />
    <span class="text-small">
      {{ getName(category.subcategory, true) }},
    </span>

    <span class="text-xsmall">
      {{ getName(category.category) }}
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
    ... mapState('categories', [ 'cache', ]),
  },
  methods: {
    /**
     * Return category name for given key.
     *
     * @param key String Category key as found in DB
     * @return String
     */
    getName(key = '') {
      let cat = this.cache[key];

      if (!cat)
        return key
          .replace(/^\w/, key.charAt(0).toUpperCase())
          .replace(/_/g, ' ');
      else
        return cat.name;
    },

    /**
     * Return category icon for given key.
     *
     * @param key String Category key as found in DB
     * @return String
     */
    getIcon(key = '') {
      let cat = this.cache[key];

      if (!cat)
        return key;
      else
        return cat.icon;
    },
  },
}
</script>
