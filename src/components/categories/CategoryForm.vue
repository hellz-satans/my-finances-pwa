<template>
  <form
    name="category"
    class="category-form p-3"
    @submit.stop.prevent="submitForm"
  >
    <section class="category-options">
      <div class="w-full mb-4">
        <label class="block font-medium">Category</label>
        <div class="flex flex-row">
          <category-picker
            class="w-full"
            v-model="category"
            :options="categoryOptions"
            :category="category"
          />
          <transition name="sweep-left">
            <delete-category-button
              class="ml-2 w-1/5"
              v-if="categoryDeletable"
              :category="category"
              @deleted="resetCategory"
            />
          </transition>
        </div>
      </div>

      <div class="w-full mb-4">
        <label class="block font-medium">Subcategory</label>
        <div class="flex flex-row">
          <category-picker
            class="w-full"
            v-model="subcategory"
            :disabled="! category.name"
            :options="subcategoryOptions"
            :category="subcategory"
          />
          <transition name="sweep-left">
            <delete-category-button
              class="ml-2 w-1/5"
              v-if="subcategoryDeletable"
              :category="subcategory"
              @deleted="resetSubcategory"
            />
          </transition>
        </div>
      </div>
    </section>

    <article :style="previewStyle" class="category-preview card pt-0 pb-6">
      <header class="justify-end m-0 mt-2 mr-4 p-0">
        <color-picker-modal
          class="inline-block"
          @input="setColor($event)"
        />
      </header>

      <section class="icon-cat-subcat">
        <icon-picker-modal
          v-model="category.icon"
          :icon="category.icon"
        />

        <div class="cat-subcat">
          <div class="cat mb-4">
            <input
              ref="categoryInput"
              v-model="category.name"
              placeholder="Category"
            />
          </div>

          <div class="subcat">
            <input
              ref="subcategoryInput"
              v-model="subcategory.name"
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
import CategoryPicker from '@/components/categories/CategoryPicker.vue'
import Dropdown from '@/components/Dropdown.vue'

const DEFAULT_VALUES = {
  color: '#455A64',
  icon:  'dollar-sign',
};
const OPTION_NEW = {
  key: null,
  name: 'New category',
  icon: 'plus',
  color: DEFAULT_VALUES.color,
};

export default {
  name: 'CategoryForm',

  components: {
    CategoryPicker,
    ColorPickerModal,
    IconPickerModal,
    DeleteCategoryButton,
    Dropdown,
  },

  data() {
    return {
      category: {
        color: DEFAULT_VALUES.color,
        icon:  DEFAULT_VALUES.icon,
        name:  null,
        key:   null,
      },
      subcategory: {
        color: DEFAULT_VALUES.color,
        icon:  DEFAULT_VALUES.icon,
        name:  null,
        key:   null,
      },
    };
  },

  computed: {
    ... mapState('categories', [ 'cache', 'categories', 'subcategories', ]),
    ... mapGetters('categories', [ 'categorySubcategories', ]),

    categoryDeletable() {
      return this.category.key && this.category.key != OPTION_NEW.key;
    },

    subcategoryDeletable() {
      return this.subcategory.key && this.subcategory.key != OPTION_NEW.key;
    },

    categoryOptions() {
      return [ Object.assign({}, OPTION_NEW), ]
        .concat(this.categories);
    },

    subcategoryOptions() {
      return [ Object.assign({}, OPTION_NEW), ]
        .concat(this.categorySubcategories(this.category.key));
    },

    previewStyle() {
      let color = this.category.color || DEFAULT_VALUES.color;

      const styles = {
        'background-color': color,
        'box-shadow': `0 0.5em 1em 6px ${color}`,
      }

      return styles
    },
  },

  methods: {
    ... mapActions('categories', [ 'submitCategory', ]),

    submitForm() {
      const data = {
        category: this.category.name,
        categoryKey: this.category.key,
        subcategory: this.subcategory.name,
        subcategoryKey: this.subcategory.key,
        color: this.category.color,
        icon: this.category.icon,
        isSubcategory: !!this.subcategory.name,
      };

      this.submitCategory(data)
        .then((record) => {
          if (record) {
            this.$router.push('/');
          }
        });
    },

    setColor(color) {
      this.category.color = color;
      this.subcategory.color = color;
    },

    resetCategory() {
      this.category.name  = this.category.key = null;
      this.category.icon  = DEFAULT_VALUES.icon;
      this.category.color = DEFAULT_VALUES.color;
    },

    resetSubcategory() {
      this.subcategory.name  = this.subcategory.key = null;
      this.subcategory.icon  = DEFAULT_VALUES.icon;
      this.subcategory.color = DEFAULT_VALUES.color;
    },
  },

  watch: {
    category(newVal, oldVal) {
      for (let k in DEFAULT_VALUES) {
        if (newVal[k]) {
          this.category[k]    = newVal[k];
          this.subcategory[k] = newVal[k];
        } else {
          this.category[k]    = DEFAULT_VALUES[k];
          this.subcategory[k] = DEFAULT_VALUES[k];
        }
      }

      if (newVal.key === OPTION_NEW.key)
        this.$refs.categoryInput.focus();

      this.resetSubcategory();
    },

    subcategory(newVal, oldVal) {
      for (let k in DEFAULT_VALUES) {
        if (newVal[k]) {
          this.subcategory[k] = newVal[k];
        } else {
          this.subcategory[k] = DEFAULT_VALUES[k];
        }
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
