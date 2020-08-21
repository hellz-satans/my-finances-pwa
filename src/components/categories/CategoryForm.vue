<template>
  <sui-form
    name="category"
    class="category-form"
    @submit.stop.prevent="submitForm"
  >
    <section class="category-options">
      <sui-form-field :class="{ deletable: categoryDeletable }">
        <label>Category</label>
        <sui-dropdown
          placeholder="Pick or create one"
          selection
          v-model="selectedCategory"
          :options="categoryOptions"
        />
        <transition name="sweep-left">
          <delete-category-button
            class="right"
            v-if="categoryDeletable"
            :category="category"
            @deleted="selectedCategory = null"
          />
        </transition>
      </sui-form-field>

      <sui-form-field :class="{ deletable: subcategoryDeletable }">
        <label>Subcategory</label>
        <sui-dropdown
          placeholder="Edit category or Add/Edit subcategory"
          selection
          v-model="selectedSubcategory"
          :options="subcategoryOptions"
        />
        <transition name="sweep-left">
          <delete-category-button
            class="right"
            v-if="subcategoryDeletable"
            :category="category"
            @deleted="selectedSubcategory = null"
          />
        </transition>
      </sui-form-field>
    </section>

    <section :style="previewStyle" class="category-preview card-item">
      <header class="text-right">
        <color-picker-modal
          @open="colorModal = true"
          @close="colorModal = false"
          v-model="category.color"
          :is-open="colorModal"
        />
      </header>

      <div class="icon-cat-subcat">
        <icon-picker-modal
          v-model="category.icon"
          @open="iconModal = true"
          @close="iconModal = false"
          :icon="category.icon"
          :is-open="iconModal"
        />

        <div class="cat-subcat">
          <div class="cat">
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
      </div>
    </section>

    <footer class="actions text-right">
      <sui-button
        type="submit"
        positive
      >Submit</sui-button>
    </footer>
  </sui-form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ColorPickerModal from '@/components/ColorPickerModal.vue'
import IconPickerModal from '@/components/IconPickerModal.vue'
import DeleteCategoryButton from '@/components/categories/DeleteCategoryButton.vue'

const OPTION_NEW= {
  key: '__new__',
  text: 'Add new one',
  value: '__new__',
  icon: 'plus',
};

export default {

  components: {
    ColorPickerModal,
    IconPickerModal,
    DeleteCategoryButton,
  },

  data() {
    return {
      category: {
        color: '#455A64',
        icon: 'dollar',
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
      return this.rootCategoryOptions.concat([ OPTION_NEW, ])
    },

    subcategoryOptions() {
      if (!this.selectedCategory)
        return [];

      return this.rootSubcategoryOptions(this.selectedCategory)
        .concat([ OPTION_NEW, ])
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
      flex: row nowrap;
    }

    .cat-subcat {
      flex: 2 1 60%;
      display: flex;
      flex-flow: column nowrap;
      padding: 0.5em;
    }
    .cat    { padding-bottom: 0.75em; }
    .subcat { padding-top: 0.75em; }

    .icon-picker {
      flex: 1 2 30%;
      margin: 0;
      display: flex;
      flex-flow: column nowrap;
      align-content: center;
      justify-content: center;

      .toggler {
        border-width: 2px;
        height: 3.5em;
        font-size: 2em;
        padding-top: 1em;
      }
    }

    input {
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

  // OVERRIDES
  .deletable.field {
    > .dropdown {
      width: 80% !important;
    }
  }
}
</style>
