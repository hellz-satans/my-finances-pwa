<template>
  <section class="home-view">
    <balance-summary />
    <account-list />
    <expense-form />
    <expenses-chart />
    <expense-filters />
    <expense-list :amount="7" />
    <transfer-form />
  </section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/accounts/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import TransferForm from '@/components/accounts/TransferForm'

export default {
  name: 'home',
  components: {
    AccountList,
    BalanceSummary,
    ExpenseList,
    ExpensesChart,
    ExpenseFilters,
    ExpenseForm,
    TransferForm,
  },
}
</script>
