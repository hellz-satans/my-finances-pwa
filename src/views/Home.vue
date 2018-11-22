<template>
	<section class="home">
		<balance-summary></balance-summary>
		<account-list></account-list>
		<expenses-chart></expenses-chart>
	</section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpensesChart from '@/components/charts/Expenses.vue';

export default {
  name: 'home',
  components: {
    AccountList,
    BalanceSummary,
		ExpensesChart
  }
}
</script>
