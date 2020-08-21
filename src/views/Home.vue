<template>
  <section class="home-view">
    <balance-summary />
    <account-list />
    <expense-filters />
    <expense-list />
  </section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/accounts/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue';

export default {
  name: 'Home',

  components: {
    AccountList,
    BalanceSummary,
    ExpenseList,
    ExpenseFilters,
  },
}
</script>
