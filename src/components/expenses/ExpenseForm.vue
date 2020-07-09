<template>
  <sui-form
    name="expense"
    class="expense-form"
    @submit.stop.prevent="submitExpense"
  >
    <sui-grid>
      <sui-grid-row>
        <sui-grid-column :width="2">
          <span
            :class="{ 'sign': true, positive: sign > 0, negative: sign < 0 }"
            @click="sign = sign * -1"
          >{{ (sign > 0) ? '+' : '-' }}</span>
        </sui-grid-column>

        <sui-grid-column :width="6">
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
            <input type="datetime-local" v-model="date" />
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
              minlength="1"
              pattern=".+"
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
      <router-link to="/">
        <sui-button>Cancel</sui-button>
      </router-link>
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
import MoneyInput from '@/components/MoneyInput'
import moment from 'moment'

export default {
  name: 'ExpenseForm',

  components: {
    AccountsOptions,
    MoneyInput,
  },

  data() {
    return {
      description: null,
      price: 0,
      date: moment().format(),
      category: 'other',
      subcategory: 'other_other',
      account: 'cash',
      sign: -1,
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
        sign: this.sign,
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
        this.price = Math.abs(exp.price);
        this.date = exp.date;
        this.category = exp.category;
        this.subcategory = exp.subcategory;
        this.account = exp.account;
        this.sign = (exp.price < 0) ? -1 : 1;
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
  .sign {
    margin-top: 1.25rem;
    cursor: pointer;
    font-size: 2rem;
    font-weight: 600;
    position: absolute;
    top: 0.25rem;
    left: 1.45rem;

    &.positive { color: green; }
    &.negative { color: red; left: 1.75rem; }
  }
}
</style>
