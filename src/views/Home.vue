<template>
  <section class="home-view">
    <balance-summary />
    <account-list />
    <expense-form style="float: right; margin-bottom: 1em" />
    <expenses-chart />
    <expense-list :amount="7" />
  </section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/accounts/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';

export default {
  name: 'home',
  components: {
    AccountList,
    BalanceSummary,
    ExpenseList,
    ExpensesChart,
    ExpenseForm,
  },
}
</script>
