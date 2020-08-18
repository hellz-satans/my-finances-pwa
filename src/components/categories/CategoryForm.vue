<template>
  <sui-form
    name="category"
    class="category-form"
    @submit.stop.prevent="submitCategory"
  >
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
          @input="category.icon = $event"
          @open="iconModal = true"
          @close="iconModal = false"
          :icon="category.icon"
          :is-open="iconModal"
        />

        <div class="cat">
          <input
            v-model="category.name"
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

    <footer class="actions text-right">
      <sui-button
        type="submit"
        positive
      >{{ action }}</sui-button>
    </footer>

    <section>
      <h2>TODO</h2>
      <ul>
        <li class="strike">Add color swatch modal</li>
        <li class="strike">Add (sub)icon modal</li>
        <li>Use custom swatch colors</li>
        <li>Add <code>"Delete (sub)category"</code> button</li>
      </ul>
    </section>
  </sui-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ColorPickerModal from '@/components/ColorPickerModal.vue'
import IconPickerModal from '@/components/IconPickerModal.vue'

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
  },

  data() {
    return {
      category: {
        color: '#455A64',
        icon: 'dollar',
        key: null,
        name: null,
        subcategory: null,
      },
      iconModal: false,
      colorModal: false,
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
    submitCategory() {
      if (!this.isValid) {
        return false;
      }
      console.debug('TODO: redirect to subcategory form');
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
        this.category.icon = s.icon;
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
    border: 2px solid #ccc;
    margin: 2em 0;
    padding-top: 1em;
    padding-bottom: 2em;

    .toggler {
      color: #eee;
    }

    .icon-cat-subcat {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
        "icon category"
        "icon subcategory";
    }

    .cat         { grid-area: category; }
    .subcat      { grid-area: subcategory; }

    .icon-picker {
      grid-area: icon;
      width: 80%;
      margin: 10% 0 0 10%;
      height: 70%;

      .toggler {
        border-width: 2px;
        height: 100%;
        padding-top: 30%;
        font-size: 2em;
      }
    }

    .cat, .subcat {
      margin: 0.5em 0.25em;
    }

    input {
      flex-grow: 2;
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
</style>
