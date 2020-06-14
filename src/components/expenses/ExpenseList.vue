<template>

  <paginatron
    class="expenses-list"
    @change="updateItems"
    :items-per-page="perPage"
    :items="expenses"
    v-if="expenses.length > 0"
    @next="advanced"
    @previous="decreased"
    @setPage="setCurrentPage"
  >
    <article slot-scope="{ setPage, nextPage, prevPage, page, pages, hasNextPage, hasPrevPage, nextButtonEvents, prevButtonEvents, nextButtonAttrs, prevButtonAttrs }">
      <h3 class="text-right">
        Sum of listed expenses: <strong>{{ expensesSum | currency }}</strong>
      </h3>

      <table class="ui table" v-if="entries.length > 0">
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
          <tr v-for="e in entries" :key="e.id">
            <td>
              <b>{{ e.price | currency }}</b>
            </td>
            <td>
              <account-label v-if="e.account" :account-key="e.account" />
            </td>
            <td>{{ e.description }}</td>
            <td>
              <category-label
                :category="{ category: e.category, subcategory: e.subcategory }"
              />
            </td>
            <td><date-label :date="e.date" /></td>
            <td>
              <sui-button
                class="delete-expense-button"
                size="mini"
                animated="vertical"
                @click="deleteExpense(e.id)"
              >
                <sui-button-content visible>
                  <sui-icon name="trash" />
                </sui-button-content>
                <sui-button-content hidden>Delete</sui-button-content>
              </sui-button>

              <sui-button
                class="edit-expense-button"
                size="mini"
                animated="vertical"
                @click="editExpense(e.id)"
              >
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

  <h2 class="text-center" v-else>
    Move along, nothing to show here. Try changing the filters!
  </h2>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { expensesSum } from '@/stores/filters';
import Paginatron from 'vue-paginatron'
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
    Paginatron,
  },

  data() {
    return {
      entries: [],
      currentPage: 0,
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

    advanced({ entries, prev, current }) {
      this.currentPage = current
    },

    setCurrentPage(current) {
      this.currentPage = current
    },

    updateItems(entries) {
      this.entries = entries
    },
  },

  computed: {
    ... mapState('expenses', [ 'expenses' ]),
    ... mapGetters('expenses', [ 'totalExpenses' ]),

    expensesSum() {
      return expensesSum(this.expenses)
    },

    perPage() {
      if (this.expenses.length < 20)
        return this.expenses.length
      return 20
    },
  },

  created() {
  },
}
</script>
