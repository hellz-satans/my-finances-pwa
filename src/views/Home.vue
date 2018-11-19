<style lang="scss">
	.home {
		.expenses-chart-container {
			max-width: 450px;
		}
	}
</style>

<template>
	<section class="home">
		<balance-summary></balance-summary>
		<account-list></account-list>
		<article>
			<h2>// TODO:</h2>
			<ul>
				<li>add most recent expenses (maybe expenses summary?)</li>
				<li>improve charts positioning and styles</li>
			</ul>
		</article>
		<expenses-chart-container></expenses-chart-container>
	</section>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpensesChartContainer from '@/components/ExpensesChartContainer.vue';

export default {
  name: 'home',
  components: {
    AccountList,
    BalanceSummary,
		ExpensesChartContainer,
  }
}
</script>
