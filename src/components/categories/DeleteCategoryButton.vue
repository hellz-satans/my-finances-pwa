<template>
  <sui-button
    class="delete-category-button"
    type="button"
    negative
    icon="trash"
    @click="confirmDelete"
  />
</template>

<script>
import { mapActions } from 'vuex';
const CONFIRM_TITLE = "Are you sure?";

export default {
  name: "DeleteCategoryButton",

  props: {
    category: { type: Object, required: true, },
  },

  methods: {
    ... mapActions('categories', [ 'deleteCategory', ]),

    async confirmDelete() {
      let msg = `${CONFIRM_TITLE}\n\n`,
        count = 0;

      if (!this.category.isSubcategory) {
        msg += "This will delete all of the related subcategories.\n";
      }

      msg += "There's no turning back.";
      if (window.confirm(msg)) {
        count = await this.deleteCategory(this.category);
      }

      if (count > 0) {
        this.$emit('deleted', true);
      }
    },
  },
}
</script>
