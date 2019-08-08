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
              <account-label v-if="e.accountId" :account-id="e.accountId" />
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
import { expensesSum } from '@/stores/filters';
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
    ... mapGetters('expenses', [ 'totalExpenses' ]),
    expensesSum() {
      return expensesSum(this.expenses)
    },
  },
  created() {
  },
}
</script>
