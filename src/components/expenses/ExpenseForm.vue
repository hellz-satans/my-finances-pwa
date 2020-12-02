<template>
  <form
    name="expense"
    class="expense-form w-full p-2"
    @submit.stop.prevent="submitExpense"
  >
    <div class="w-full">
      <label hidden class="hidden" for="amount">Amount</label>
      <money-input
        v-model.lazy="price"
        :value="price"
      ></money-input>
      <p v-for="(err, i) in expenseErrors.price" :key="i" class="red text">
        {{ err }}
      </p>
    </div>

    <div class="w-full">
      <label class="block font-semibold mb-1" for="date">Date</label>
      <input type="date" v-model="date" class="w-full" />
      <p v-for="(err, i) in expenseErrors.date" :key="i" class="red text">
        {{ err }}
      </p>
    </div>

    <div class="flex flex-row flex-no-wrap mb-4">
    </div>

    <div class="flex flex-row flex-no-wrap mb-4">
      <div class="w-1/2 pr-1">
        <label class="block font-semibold mb-1" for="category">Category</label>
        <category-picker
          class="w-full"
          v-model="category"
          :options="categories"
          :category="category"
        />
        <p v-for="(err, i) in expenseErrors.category" :key="i" class="red text">
          {{ err }}
        </p>
      </div>

      <div class="w-1/2 pl-1">
        <label class="block font-semibold mb-1" for="subcategory">
          Subcategory
        </label>
        <category-picker
          class="w-full"
          v-model="subcategory"
          :disabled="! category.key"
          :options="subcategoryOptions"
          :category="subcategory"
        />
        <p v-for="(err, i) in expenseErrors.subcategory" :key="i" class="red text">
          {{ err }}
        </p>
      </div>
    </div>

    <div class="w-full">
      <label class="block font-semibold" for="account">Account</label>
      <accounts-options :account="account" @input="account = $event" />
      <p v-for="(err, i) in expenseErrors.account" :key="i" class="red text">
        {{ err }}
      </p>
    </div>

    <div class="w-full">
      <label class="block font-semibold mb-1" for="description">Description</label>
      <input
        name="description"
        v-model="description"
      />
      <p v-for="(err, i) in expenseErrors.description" :key="i" class="red text">
        {{ err }}
      </p>
    </div>

    <footer class="text-right w-full mt-4">
      <button
        type="submit"
        class="btn-submit"
      >{{ action }}</button>
    </footer>
  </form>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import AccountsOptions from '@/components/accounts/AccountsOptions.vue'
import CategoryPicker from '@/components/categories/CategoryPicker.vue'
import MoneyInput from '@/components/MoneyInput'

export default {
  name: 'ExpenseForm',

  components: {
    AccountsOptions,
    CategoryPicker,
    MoneyInput,
  },

  data() {
    return {
      description: null,
      price: 0,
      date: new Date(),
      category: {},
      subcategory: {},
      account: 'cash',
      loaded: false,
    }
  },

  computed: {
    ... mapGetters('categories', [ 'categorySubcategories', 'otherCategory' ]),
    ... mapState('categories', [ 'categories', 'subcategories' ]),
    ... mapState('expenses', [ 'expenses', 'expenseErrors', ]),

    expenseId() {
      let id = null

      try {
        id = this.$route.params.expense_id

        if (id == 'new')
          id = null
      } catch (ex) {
      }

      return id
    },

    subcategoryOptions() {
      return this.categorySubcategories(this.category.key);
    },

    action() {
      return this.id ? 'Update' : 'Save'
    },
  },

  methods: {
    submitExpense() {
      const data = {
        id: this.expenseId,
        description: this.description,
        price: this.price,
        date: this.date,
        category: this.category.key,
        subcategory: this.subcategory.key,
        account: this.account,
      }

      this.$store.dispatch('expenses/submitExpense', data)
        .then((success) => {
          if (success) {
            this.$router.push('/')
          } else {
            console.error('something went wrong')
          }
        })
        .catch((err) => {
          console.error('expenseForm:', err, err.stack)
        })
    },

    loadForm(id) {
      let exp = this.expenses.find(e => e.id == id); // comparing Number with String

      if (exp) {
        this.description = exp.description;
        this.price = exp.price;
        this.date = exp.date;
        this.account = exp.account;
        this.category = this.categories.find(el => el.key == exp.category);
        this.subcategory = this.subcategories
          .find(el => el.key == exp.subcategory);
      }
    },
  },

  created() {
    let id = this.$route.params.expense_id

    if (id && id != 'new') {
      this.loadForm(id)
    } else {
      // load category & subcategory
      this.category    = this.otherCategory.category;
      this.subcategory = this.otherCategory.subcategory;
    }

    this.loaded = true;
  },
}
</script>

<style lang="scss">
.expense-form {
  // overrides
  .money-input {
    font-size: 2em;

    .v-money {
      font-size: 2em !important;
      min-height: 2em;
      background: none;
      border: none;
      padding: 0;
    }
  }

  .category-picker {
    .category-option {
      font-size: 0.75rem;
      margin: 1px !important;
    }
  }
}
</style>
