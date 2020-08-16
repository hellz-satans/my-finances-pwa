<template>
  <sui-form
    name="category"
    class="category-form"
    @submit.stop.prevent="submitCategory"
  >
    <h3>Pick a category:</h3>

    <div class="row categories">
      <category-card
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        :class="{ active: (category == cat && !newCategoryName) }"
        @click.native="newCategoryName = '' ; category = cat"
      />
    </div>

    <div class="row mt-2">
      <h3>Or create one:</h3>

      <div class="new-category"">
        <input
          type="text"
          class="category-name"
          placeholder="Category name"
          v-model="newCategoryName"
        />
      </div>
    </div>

    <footer class="actions text-right mt-1">
      <sui-button
        type="submit"
        class="category-form-submit"
        positive
        :disabled="!isValid"
      >
        {{ action }}
      </sui-button>
    </footer>

    <section>
      <h2>TODO</h2>

      <ul>
        <li>Add color picker (modal with swatch) to category item</li>
        <li>Transition to Subcategory creation</li>
      </ul>
    </section>
  </sui-form>
</template>

<script>
import { mapState } from 'vuex'
import CategoryCard from '@/components/categories/CategoryCard.vue'

export default {

  components: {
    CategoryCard,
  },

  data() {
    return {
      category: {
        color: null,
        subcategory: null,
      },
      newCategoryName: '',
    }
  },

  computed: {
    ... mapState('categories', [ 'categories', 'subcategories' ]),

    action() {
      return `${this.newCategoryName}` != ""
        ? 'Create & Proceed'
        : 'Proceed'
    },

    isValid() {
      return this.newCategoryName != '' || this.category.key != null;
    },
  },

  methods: {
    selectCategory(cat) {
      console.debug('Clicked!', cat);
    },

    submitCategory() {
      if (!this.isValid) {
        return false;
      }
      console.debug('TODO: redirect to subcategory form');
    },
  },
}
</script>

<style lang="scss">
.category-form {
  .categories {
    display: flex;
    flex-flow: row nowrap;
    overflow-x: scroll;
    min-width: 100%;
    padding: 0.25em 0 1em;

    .category-card {
      flex: 1 0;
      min-width: 40%;
      height: 4em;
      margin: auto 0.5em;
      cursor: pointer;
      text-align: center;

      &.active {
        height: 5em;
        box-shadow: 0 4px 12px #666;
      }
    }
  }

  .new-category {
    max-width: 90%;
    margin: 0 auto;

    input.category-name {
      border: none !important;
      border-radius: 0 !important;
      border-bottom: 2px solid #888 !important;

      &::placeholder {
        color: #444;
      }
    }
  }
}
</style>
