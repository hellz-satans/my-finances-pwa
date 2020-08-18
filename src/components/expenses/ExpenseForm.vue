<template>
  <sui-form
    name="expense"
    class="expense-form"
    @submit.stop.prevent="submitExpense"
  >
    <sui-grid>
      <sui-grid-row>
        <sui-grid-column :width="8">
          <sui-form-field>
            <label for="price">Price</label>
            <money-input v-model.lazy="price" :value="price">
            </money-input>
            <p v-for="(err, i) in expenseErrors.price" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>

        <sui-grid-column :width="8">
          <sui-form-field>
            <label for="date">Date</label>
            <date-picker v-model="date" type="datetime" />
            <p v-for="(err, i) in expenseErrors.date" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>
      </sui-grid-row>

      <sui-grid-row>
        <sui-grid-column :width="8">
          <sui-form-field>
            <label for="category">Category</label>
            <sui-dropdown
              placeholder="Category"
              fluid
              selection
              :options="expenseCategories"
              v-model="category"
            />
            <p v-for="(err, i) in expenseErrors.category" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>

        <sui-grid-column :width="8">
          <sui-form-field>
            <label for="subcategory">Subcategory</label>
            <sui-dropdown
              placeholder="Subcategory"
              fluid
              selection
              :options="expenseSubcategories"
              v-model="subcategory"
            />
            <p v-for="(err, i) in expenseErrors.subcategory" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>
      </sui-grid-row>

      <sui-grid-row>
        <sui-grid-column :width="16">
          <sui-form-field>
            <label for="account">Account</label>
            <accounts-options :account="account" @input="account = $event" />
            <p v-for="(err, i) in expenseErrors.account" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>

        <sui-grid-column :width="16">
          <sui-form-field>
            <label for="description">Description</label>
            <sui-input
              name="description"
              v-model="description"
            />
            <p v-for="(err, i) in expenseErrors.description" :key="i" class="red text">
              {{ err }}
            </p>
          </sui-form-field>
        </sui-grid-column>
      </sui-grid-row>
    </sui-grid>

    <footer class="text-right mt-1">
      <sui-button
        type="submit"
        class="expense-form-submit"
        positive
      >{{ action }}</sui-button>
    </footer>
  </sui-form>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import AccountsOptions from '@/components/accounts/AccountsOptions.vue'
import DatePicker from 'vue2-datepicker'
import MoneyInput from '@/components/MoneyInput'

export default {
  name: 'ExpenseForm',

  components: {
    AccountsOptions,
    DatePicker,
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
    }
  },

  computed: {
    ... mapGetters('categories', [ 'expenseCategories' ]),
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

  mounted() {
    let id = this.$route.params.expense_id

    if (id && id != 'new') {
      this.loadForm(id)
    }
  },
}
</script>

<style lang="scss">
.expense-form {
  // overrides
  .mx-datepicker {
    max-width: 100%;
  }
}
</style>
