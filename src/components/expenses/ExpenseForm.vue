<style lang="scss">
  .expense-form {
    &-button {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 999;
    }
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

<template>
  <article class="expense-form">
    <sui-button
      class="expense-form-button"
      @click.native="toggleModal(true)"
      circular
      icon="plus"
      positive
    />

    <sui-modal v-model="expenseModal" size="tiny">
      <sui-modal-header>Record</sui-modal-header>
      <sui-modal-content scrolling>
        <sui-form name="expense" method="POST">
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
                  <sui-input
                    type="number"
                    name="price"
                    min="0.1"
                    step="any"
                    required
                    v-model="price"
                  />
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
                  <sui-dropdown
                    fluid
                    selection
                    :options="accountsOptions"
                    v-model="account"
                  />
                  <p v-for="(err, i) in expenseErrors.accountId" :key="i" class="red text">
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
                    required
                    v-model="description"
                  />
                  <p v-for="(err, i) in expenseErrors.description" :key="i" class="red text">
                    {{ err }}
                  </p>
                </sui-form-field>
              </sui-grid-column>
            </sui-grid-row>
          </sui-grid>
        </sui-form>
      </sui-modal-content>

      <sui-modal-actions>
        <sui-button @click="toggleModal">Close</sui-button>
        <sui-button positive @click="submitExpense">{{ action }}</sui-button>
      </sui-modal-actions>
    </sui-modal>
  </article>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ExpenseForm',
  props: ['hideBtn'],
  methods: {
    ... mapMutations('expenses', [ 'unsetCurrentExpense' ]),
    ... mapActions('expenses', [ 'toggleModal' ]),
    submitExpense() {
      this.$store.dispatch('expenses/submitExpense')
        .catch((err) => {
          console.error('expenseForm:', err, err.stack)
        })
    },
  },
  computed: {
    ... mapGetters('accounts', [ 'accountsOptions', ]),
    ... mapGetters('categories', [ 'expenseCategories' ]),
    ... mapState('categories', [ 'categories', 'subcategories' ]),
    ... mapState('expenses', [ 'currentExpense', 'expenseErrors', 'openModal' ]),
    expenseSubcategories() {
      const list = []
      let c = null

      for (const i in this.subcategories) {
        c = this.subcategories[i]
        if (c.key.startsWith(this.category)) {
          list.push({ key: c.key, text: c.name, value: c.key, icon: c.icon })
        }
      }

      if (list.length > 0) {
        this.subcategory = list[0].value
      }

      return list
    },
    action() {
      return this.currentExpense.id ? 'Update' : 'Save'
    },
    description: {
      get() { return this.$store.state.expenses.currentExpense.description },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseDescription', v) },
    },
    price: {
      get() { return this.$store.state.expenses.currentExpense.price },
      set(v) { this.$store.commit('expenses/updateCurrentExpensePrice', v) },
    },
    category: {
      get() { return this.$store.state.expenses.currentExpense.category },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseCategory', v) },
    },
    subcategory: {
      get() { return this.$store.state.expenses.currentExpense.subcategory },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseSubcategory', v) },
    },
    date: {
      // TODO: fix warning when setting the input[type=date] with this
      get() { return this.$store.state.expenses.currentExpense.date },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseDate', v) },
    },
    account: {
      get() { return this.$store.state.expenses.currentExpense.accountId },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseAccount', v) },
    },
    sign: {
      get() { return this.$store.state.expenses.currentExpense.sign },
      set(v) { this.$store.commit('expenses/updateCurrentExpenseSign', v) },
    },

    expenseModal: {
      get() { return this.$store.state.expenses.openModal },
      set(v) { this.$store.commit('expenses/toggleModal') },
    },
  }
}
</script>
