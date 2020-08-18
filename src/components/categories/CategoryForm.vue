<template>
  <sui-form
    name="category"
    class="category-form"
    @submit.stop.prevent="submitCategory"
  >
    <h3>Pick a category:</h3>

    <section class="category-options">
      <sui-form-field>
        <label>Category</label>
        <sui-dropdown
          placeholder="Pick or create one"
          selection
          v-model="selectedCategory"
          :options="categoryOptions"
        />
      </sui-form-field>

      <sui-form-field>
        <label>Subcategory</label>
        <sui-dropdown
          placeholder="Edit category or Add/Edit subcategory"
          selection
          v-model="selectedSubcategory"
          :options="subcategoryOptions"
        />
      </sui-form-field>
    </section>

    <section class="category-preview card-item">
      <header class="text-right">
        <sui-icon
          class="pointer"
          name="eye dropper"
          @click.native="openSwatchModal"
        />
      </header>

      <div class="cat">
        <div class="icon-container">
          <sui-icon
            @click.native.stop.prevent="openIconModal"
            :name="category.icon"
          />
        </div>
        <input
          v-model="category.name"
        />
      </div>
      <div class="subcat">
        <input
          v-model="category.subcategory"
        />
        <div class="icon-container">
          <sui-icon
            @click.native.stop.prevent="openIconModal"
            :name="category.subicon"
          />
        </div>
      </div>
    </section>

    <footer class="actions text-right">
      <sui-button
        type="submit"
        positive
      >{{ action }}</sui-button>
    </footer>

    <section>
      <h2>TODO</h2>
      <ul>
        <li>Add color swatch modal</li>
        <li>Add (sub)icon modal</li>
        <li>Add <code>"Delete (sub)category"</code> button</li>
      </ul>
    </section>
  </sui-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CategoryCard from '@/components/categories/CategoryCard.vue'

const OPTION_NEW= {
  key: '__new__',
  text: 'Add new one',
  value: '__new__',
  icon: 'plus',
};

export default {

  components: {
    CategoryCard,
  },

  data() {
    return {
      category: {
        color: null,
        icon: 'dollar',
        key: null,
        name: 'comida',
        subcategory: 'desayuno',
        subicon: 'dollar',
      },
      selectedCategory: null,
      selectedSubcategory: null,
    }
  },

  computed: {
    ... mapState('categories', [ 'categories', 'subcategories' ]),
    ... mapGetters('categories', {
      rootCategoryOptions: 'categoryOptions',
      rootSubcategoryOptions: 'subcategoryOptions',
    }),

    action() {
      return (this.selectedCategory == OPTION_NEW.key || this.selectedSubcategory == OPTION_NEW.key)
        ? 'Create'
        : 'Update';
    },

    categoryOptions() {
      return this.rootCategoryOptions.concat([ OPTION_NEW, ])
    },

    subcategoryOptions() {
      if (!this.selectedCategory)
        return [];

      return this.rootSubcategoryOptions(this.selectedCategory)
        .concat([ OPTION_NEW, ])
    },

    isValid() {
      return this.newCategoryName != '' || this.category.key != null;
    },
  },

  methods: {
    submitCategory() {
      if (!this.isValid) {
        return false;
      }
      console.debug('TODO: redirect to subcategory form');
    },

    openIconModal() {
      console.debug('opening icon modal...');
    },

    openSwatchModal() {
      console.debug('opening swatch modal...');
    },
  },

  watch: {
    selectedCategory(newVal, oldVal) {
      let c = this.categories.find(el => el.key == newVal);

      if (c) {
        if (c.color) {
          this.category.color = c.color;
        }
        this.category.name = c.name;
        this.category.icon = c.icon;
        this.category.key = c.key;
      }
      this.selectedSubcategory = null;
    },

    selectedSubcategory(newVal, oldVal) {
      let s = this.subcategories.find(el => el.key == newVal);

      if (s) {
        if (s.color) {
          this.category.color = s.color;
        }
        this.category.subcategory = s.name;
        this.category.subicon = s.icon;
        this.category.key = s.key;
      }
    }
  },
}
</script>

<style lang="scss">
.category-form {
  .category-preview {
    display: flex;
    flex-flow: column nowrap;
    border: 1px solid #ccc;
    box-shadow: 0 5px 10px #aaa;
    margin: 2em 0;
    padding-top: 1em;
    padding-bottom: 2em;

    .cat, .subcat {
      display: flex;
      flex-flow: row nowrap;
      align-items: baseline;
      justify-content: space-evenly;
      margin: 0.5em 0.25em;

      .icon-container {
        text-align: center;
        flex-grow: 1;
        cursor: pointer;
        border: solid 1px #ccc;
        border-radius: 6px;
        max-width: 3em;
      }
    }

    input {
      flex-grow: 2;
      border: none !important;
      border-radius: 0 !important;
      border-bottom: 2px solid #ccc !important;
      max-width: 65%;
      padding: 0 1em !important;

      &::placeholder {
        color: #aaa;
      }
    }
  }
}
</style>
