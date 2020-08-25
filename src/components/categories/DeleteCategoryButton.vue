<template>
  <button
    class="delete-category-button rounded text-white bg-red-500 border-red-500 py-2 px-3"
    type="button"
    @click="confirmDelete"
  >
    <fa :icon="[ 'fas', 'trash' ]" />
  </button>
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
