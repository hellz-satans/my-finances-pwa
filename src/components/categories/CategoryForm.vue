<template>
  <form
    name="category"
    class="category-form p-3"
    @submit.stop.prevent="submitForm"
  >
    <section class="category-options">
      <div class="w-full mb-4">
        <label class="block font-semibold mb-2">Category</label>
        <div class="flex flex-row">
          <dropdown
            placeholder="Pick or create one"
            v-model="selectedCategory"
            :data-deletable="categoryDeletable"
            :options="categoryOptions"
          />
          <transition name="sweep-left">
            <delete-category-button
              class="ml-2"
              v-if="categoryDeletable"
              :category="category"
              @deleted="selectedCategory = null"
            />
          </transition>
        </div>
      </div>

      <div class="w-full mb-4">
        <label class="block font-semibold mb-2">Subcategory</label>
        <div class="flex flex-row">
          <dropdown
            placeholder="Edit category or Add/Edit subcategory"
            v-model="selectedSubcategory"
            :data-deletable="subcategoryDeletable"
            :options="subcategoryOptions"
          />
          <transition name="sweep-left">
            <delete-category-button
              class="ml-2"
              v-if="subcategoryDeletable"
              :category="category"
              @deleted="selectedSubcategory = null"
            />
          </transition>
        </div>
      </div>
    </section>

    <article :style="previewStyle" class="category-preview card pb-6">
      <header class="justify-end m-0 mt-2 mr-4 p-0">
        <color-picker-modal class="inline-block" v-model="category.color" />
      </header>

      <section class="icon-cat-subcat">
        <icon-picker-modal
          v-model="category.icon"
          :icon="category.icon"
        />

        <div class="cat-subcat">
          <div class="cat mb-4">
            <input
              v-model="category.category"
              placeholder="Category"
            />
          </div>

          <div class="subcat">
            <input
              v-model="category.subcategory"
              placeholder="Subcategory"
            />
          </div>
        </div>
      </section>
    </article>

    <footer class="actions text-right">
      <button
        type="submit"
      >Submit</button>
    </footer>
  </form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ColorPickerModal from '@/components/ColorPickerModal.vue'
import IconPickerModal from '@/components/IconPickerModal.vue'
import DeleteCategoryButton from '@/components/categories/DeleteCategoryButton.vue'
import Dropdown from '@/components/Dropdown.vue'

const OPTION_NEW = {
  key: '__new__',
  text: 'Add new one',
  value: '__new__',
  icon: 'plus',
};
const DEFAULT_COLOR = '#455A64';
const DEFAULT_ICON  = 'dollar-sign';

export default {
  name: 'CategoryForm',

  components: {
    ColorPickerModal,
    IconPickerModal,
    DeleteCategoryButton,
    Dropdown,
  },

  data() {
    return {
      category: {
        color: DEFAULT_COLOR,
        icon: DEFAULT_ICON,
        category: null,
        categoryKey: null,
        subcategory: null,
        subcategoryKey: null,
      },
      iconModal: false,
      colorModal: false,
      selectedCategory: null,
      selectedSubcategory: null,
    }
  },

  computed: {
    ... mapState('categories', [ 'cache', ]),
    ... mapGetters('categories', {
      rootCategoryOptions: 'categoryOptions',
      rootSubcategoryOptions: 'subcategoryOptions',
    }),

    categoryDeletable() {
      return this.selectedCategory && this.selectedCategory != OPTION_NEW.key;
    },

    subcategoryDeletable() {
      return this.selectedSubcategory
        && this.selectedSubcategory != OPTION_NEW.key;
    },

    categoryOptions() {
      return [ OPTION_NEW, ].concat(this.rootCategoryOptions);
    },

    subcategoryOptions() {
      if (!this.selectedCategory)
        return [];

      return [ OPTION_NEW, ]
        .concat(this.rootSubcategoryOptions(this.selectedCategory));
    },

    previewStyle() {
      if (!this.category.color)
        return null;

      const styles = {
        'background-color': this.category.color,
        'box-shadow': `0 0.5em 1em 6px ${this.category.color}`,
      }

      return styles
    },
  },

  methods: {
    ... mapActions('categories', [ 'submitCategory', ]),

    submitForm() {
      const data = {
        category: this.category.category,
        categoryKey: this.category.categoryKey,
        subcategory: this.category.subcategory,
        subcategoryKey: this.category.subcategoryKey,
        color: this.category.color,
        icon: this.category.icon,
        isSubcategory: !!this.category.subcategory,
      };

      this.submitCategory(data)
        .then((record) => {
          if (record) {
            this.$router.push('/');
          }
        });
    },

    resetCategory() {
      this.category.category = this.category.subcategory = null;
      this.category.categoryKey = this.category.subcategoryKey = null;
      this.category.isSubcategory = false;
      this.category.color = DEFAULT_COLOR;
      this.category.icon  = DEFAULT_ICON;
    },
  },

  watch: {
    selectedCategory(newVal, oldVal) {
      let c = this.cache[newVal];

      if (c) {
        if (c.color) {
          this.category.color = c.color;
        }
        this.category.category = c.name;
        this.category.icon = c.icon;
        this.category.categoryKey = c.key;
        this.category.isSubcategory = false;
      } else {
        this.resetCategory();
      }
      this.selectedSubcategory = null;
    },

    selectedSubcategory(newVal, oldVal) {
      let s = this.cache[newVal];

      if (s) {
        if (s.color) {
          this.category.color = s.color;
        }
        this.category.subcategory = s.name;
        this.category.icon = s.icon;
        this.category.subcategoryKey = s.key;
        this.category.isSubcategory = true;
      } else {
        this.resetCategory();
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
    border: 2px solid #ccc;
    margin: 2em 0;
    padding-top: 1em;
    padding-bottom: 2em;

    // both color picker & icon picker
    .toggler {
      color: #eee;
    }

    header {
      padding-bottom: 0.5em;
    }

    .icon-cat-subcat {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }

    .icon-picker {
      margin: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;

      .toggler {
        border-width: 2px;
        height:    3em;
        min-width: 3em;
        font-size: 2em;
        padding-top: 1em;
      }
    }

    .cat-subcat {
      display: flex;
      flex-flow: column nowrap;
      margin-left: 0.5em;
    }

    .cat, .subcat {
      input {
        max-width: 100%;
        color: #ccc !important;
        background-color: rgba(0, 0, 0, 0.1) !important;
        border: none !important;
        border-radius: 2px !important;
        border-bottom: 2px solid #ccc !important;
        padding: 0.5em 1em !important;

        &::placeholder {
          color: #fff;
        }
      }
    }
  }

  // OVERRIDES
  .dropdown {
    transition: all 0.5s ease-in-out;
    transition-delay: 0.5s;
    width: 100%;
  }
  .dropdown[data-deletable=true] {
    min-width: 85%;
  }
}
</style>
