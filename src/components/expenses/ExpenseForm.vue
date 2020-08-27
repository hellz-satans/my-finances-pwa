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
      <date-picker class="w-full" v-model="date" type="datetime" />
      <p v-for="(err, i) in expenseErrors.date" :key="i" class="red text">
        {{ err }}
      </p>
    </div>

    <div class="flex flex-row flex-no-wrap mb-4">
    </div>

    <div class="flex flex-row flex-no-wrap mb-4">
      <div class="w-1/2 pr-1">
        <label class="block font-semibold mb-1" for="category">Category</label>
        <dropdown
          placeholder="Category"
          :options="categoryOptions"
          v-model="category"
        />
        <p v-for="(err, i) in expenseErrors.category" :key="i" class="red text">
          {{ err }}
        </p>
      </div>

      <div class="w-1/2 pl-1">
        <label class="block font-semibold mb-1" for="subcategory">
          Subcategory
        </label>
        <dropdown
          placeholder="Subcategory"
          :options="expenseSubcategories"
          v-model="subcategory"
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
import DatePicker from 'vue2-datepicker'
import MoneyInput from '@/components/MoneyInput'
import Dropdown from '@/components/Dropdown'

export default {
  name: 'ExpenseForm',

  components: {
    AccountsOptions,
    DatePicker,
    Dropdown,
    MoneyInput,
  },

  data() {
    return {
      description: null,
      price: 0,
      date: new Date(),
      category: 'other',
      subcategory: 'other_other',
      account: 'cash',
      loaded: false,
    }
  },

  computed: {
    ... mapGetters('categories', [ 'categoryOptions' ]),
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

    expenseSubcategories() {
      const list = []
      let c = null

      for (const i in this.subcategories) {
        c = this.subcategories[i]
        if (c.key.startsWith(this.category)) {
          list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon })
        }
      }

      if (list.length > 0 && this.subcategory == 'other_other') {
        this.subcategory = list[0].value
      }

      return list
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
        category: this.category,
        subcategory: this.subcategory,
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
        this.category = exp.category;
        this.subcategory = exp.subcategory;
        this.account = exp.account;
      }
    },
  },

  created() {
    let id = this.$route.params.expense_id

    if (id && id != 'new') {
      this.loadForm(id)
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

  .mx-datepicker {
    max-width: 100%;
  }
}
</style>
