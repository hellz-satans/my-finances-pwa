<template>
  <section class="home-view">
    <balance-summary />
    <account-list />
    <expenses-chart />
    <expense-filters />
    <expense-list />
    <transfer-form />
    <router-link
      class="expense-form-button"
      to="/expense/new"
    >
      <sui-button
        circular
        icon="plus"
        positive
      />
    </router-link>
  </section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/accounts/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue';
import TransferForm from '@/components/accounts/TransferForm'

export default {
  name: 'home',
  components: {
    AccountList,
    BalanceSummary,
    ExpenseList,
    ExpensesChart,
    ExpenseFilters,
    TransferForm,
  },
}
</script>

<style lang="scss">
.expense-form-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
}
</style>
