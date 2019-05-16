<template>
  <paginatron
    class="expenses-list"
    @change="updateItems"
    :items-per-page="perPage"
    :items="expensesList"
    v-if="expensesList.length > 0"
    @next="advanced"
    @previous="decreased"
    @setPage="setCurrentPage"
  >
    <article slot-scope="{ setPage, nextPage, prevPage, page, pages, hasNextPage, hasPrevPage, nextButtonEvents, prevButtonEvents, nextButtonAttrs, prevButtonAttrs }">
      <h3 class="text-right">
        Sum of listed expenses: <strong>{{ expensesSum | currency }}</strong>
      </h3>
      <table class="ui table">
        <thead>
          <tr>
            <th scope="col">Amount</th>
            <th scope="col">Account</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Date &darr;</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in activeItems" :key="e.id">
            <td>
              <b>{{ e.price | currency }}</b>
            </td>
            <td>
              <account-label v-if="e.account" :account="e.account" />
            </td>
            <td>{{ e.description }}</td>
            <td>
              <category-label
                :category="{ category: e.category, subcategory: e.subcategory }"
              />
            </td>
            <td :title="e.date | format">{{ e.date | ago }}</td>
            <td>
              <sui-button size="mini" animated="vertical" @click="deleteExpense(e.id)">
                <sui-button-content visible>
                  <sui-icon name="trash" />
                </sui-button-content>
                <sui-button-content hidden>Delete</sui-button-content>
              </sui-button>

              <sui-button size="mini" animated="vertical" @click="editExpense(e.id)">
                <sui-button-content visible>
                  <sui-icon name="pencil" />
                </sui-button-content>
                <sui-button-content hidden>Edit</sui-button-content>
              </sui-button>
            </td>
          </tr>
        </tbody>
        <tfoot>
        </tfoot>
      </table>
      <footer
        class="ui center aligned pagination menu"
        v-if="pages > 1"
      >
        <span
          class="item pointer"
          v-on="prevButtonEvents"
          v-bind="prevButtonAttrs"
        >Prev</span>
        <span
          v-for="(page, index) in pages"
          :key="index"
          @click="setPage(index)"
          :class="pagesClasses(page, index)"
        >
          {{ page }}
        </span>
        <span class="item pointer" v-on="nextButtonEvents">Next</span>
      </footer>
    </article>
  </paginatron>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { filterExpenses, expensesSum } from '@/stores/filters';
import Paginatron from 'vue-paginatron'
import AccountLabel from '@/components/accounts/AccountLabel.vue'
import CategoryLabel from '@/components/categories/CategoryLabel.vue'

export default {
  name: 'ExpenseList',
  props: {
    amount: { type: Number, required: false, default: null },
    sort: { type: Number, required: false, default: 1 },
    filters: { type: Array, required: false, default: () => { return [] } },
  },
  components: {
    AccountLabel,
    CategoryLabel,
    Paginatron,
  },
  data() {
    return {
      activeItems: [],
      currentPage: 0,
      perPage: 20,
    }
  },
  methods: {
    ... mapActions('expenses', [ 'editExpense', 'deleteExpense' ]),

    pagesClasses(newPage, index) {
      return {
        active: this.currentPage === (newPage - 1),
        item: true,
        pointer: true,
      }
    },

    decreased({ prev, current }) {
      this.currentPage = current
    },

    advanced({ activeItems, prev, current }) {
      this.currentPage = current
    },

    setCurrentPage(current) {
      this.currentPage = current
    },

    updateItems(activeItems) {
      this.activeItems = activeItems
    },
  },
  computed: {
    ... mapState('expenses', [ 'expenses' ]),
    ... mapState('accounts', [ 'accounts' ]),
    ... mapGetters('expenses', [ 'totalExpenses' ]),
    expensesList() {
      let exp = null,
        list = [],
        i = 0,
        n = this.amount || this.expenses.length;

      // if we don't traverse the array manually, Vue reactivity kicks in
      // and messes with this.expenses, affecting the whole application.
      // tl;dr: do NOT use splice on this.expenses
      //
      // TODO: make it so that we take the _last_ n elements
      for (i = 0; i < n && i < this.expenses.length; ++i) {
        exp = this.expenses[i]
        if (exp.accountId) {
          exp.account = this.accounts.find(el => el.id === exp.accountId)
        }
        list.push(exp);
      }
      list = list.filter(exp => filterExpenses(exp, this.filters))

      return list;
    },
    expensesSum() {
      return expensesSum(this.expensesList)
    },
  },
  created() {
    if (this.expensesList.length > 0) {
      if (this.amount) {
        this.perPage = (this.amount > this.expensesList.length)
          ? this.expensesList.length
          : this.amount
      } else {
        this.perPage = (this.perPage > this.expensesList.length)
          ? this.expensesList.length
          : this.perPage
      }
    }
  },
}
</script>
