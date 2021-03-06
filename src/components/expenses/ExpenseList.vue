<style lang="scss">
.expenses-list {
  .expense-entry {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;

    margin: 0.5em 0.25em;
    padding: 1em 0.4em 0.5em;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 0.4em;
    box-shadow: 0 0 0.3em 0.05em var(--shadow-color, #bbb);
  }
}
</style>

<template>
  <section class="expenses-list">
    <header class="text-right mb-3 mx-4 text-small">
      <span class="text font-medium green">Income</span>:
      {{ income | currency }},
      <span class="text font-medium red">Outcome</span>:
      {{ outcome | currency }}<br>
      <span class="text font-medium">Total</span>:
      {{ expensesSum | currency }}
    </header>

    <h2 class="text-center" v-if="expenses.length === 0">
      Move along, nothing to show here. Try changing the filters!
    </h2>

    <article
      class="expense-entry"
      v-for="(e, idx) in expenses"
      :key="e.id"
      v-if="idx < upTo"
      :style="entryStyles(e)"
    >
      <div class="flex flex-row justify-between align-start w-full">
        <category-label
          :category="{ category: e.category, subcategory: e.subcategory }"
        />

        <div class="flex flex-col justify-between text-center">
          <div class="text-large">
            {{ e.price | currency }}
          </div>
          <div>
            <account-label
              class="inline-block text-small"
              :account-key="e.account"
            />
          </div>
        </div>
      </div>

      <div class="w-full flex flex-row items-center justify-between mt-2">
        <div class="text-small min-w-1/5">
          <date-label :date="e.date" />
        </div>

        <p class="px-2 text-small">{{ e.description }}</p>

        <div class="actions text-center min-w-1/5">
          <router-link
            class="text-small"
            :to="'/expense/' + e.id"
          >
            Edit
            <fa :icon="[ 'fas', 'pen' ]" />
          </router-link>

          <span
            class="text-small text-red-500 pointer whitespace-no-wrap"
            @click="deleteProxy(e.id)"
          >
            Delete
            <fa :icon="[ 'fas', 'trash' ]" />
          </span>
        </div>
      </div>
    </article>

    <footer class="text-center my-4">
      <button
        type="button"
        class="btn"
        @click="upTo += 20"
        v-if="expenses.length > upTo"
      >
        Show more
      </button>
    </footer>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { expensesSum } from '@/stores/filters';
import AccountLabel from '@/components/accounts/AccountLabel.vue'
import CategoryLabel from '@/components/categories/CategoryLabel.vue'
import DateLabel from '@/components/DateLabel'

export default {
  name: 'ExpenseList',

  props: {
  },

  components: {
    AccountLabel,
    CategoryLabel,
    DateLabel,
  },

  data() {
    return {
      // Display up to `upTo` expenses
      upTo: 20,
    }
  },

  methods: {
    ... mapActions('expenses', [ 'editExpense', 'deleteExpense' ]),

    entryStyles(exp) {
      let styles = {},
        cat = this.categoriesCache[exp.subcategory];
      let str = '';

      if (!cat) cat = this.categoriesCache[this.category];
      if (cat) styles['border-left'] = `5px solid ${cat.color}`;

      for (const k in styles)
        str += `${k}: ${styles[k]};`

      return str;
    },

    deleteProxy(id) {
      if (window.confirm('Are you sure?'))
        this.deleteExpense(id);
    },
  },

  computed: {
    ... mapState('expenses', [ 'expenses' ]),
    ... mapState('categories', { categoriesCache: 'cache', }),
    ... mapGetters('expenses', [ 'totalExpenses' ]),

    expensesSum() {
      return expensesSum(this.expenses)
    },

    income() {
      return this.expenses
        .filter(e => e.price > 0)
        .map(e => e.price)
        .concat([ 0, ]) // to prevent reduce on empty array
        .reduce((total, curr) => total + curr);
    },

    outcome() {
      return this.expenses
        .filter(e => e.price < 0)
        .map(e => e.price)
        .concat([ 0, ]) // to prevent reduce on empty array
        .reduce((total, curr) => total + curr);
    },
  },

  created() {
  },
}
</script>
