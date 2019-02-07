<template>
	<div>
		<balance-summary></balance-summary>
		<account-list></account-list>

		<expense-form style="float: right; margin-bottom: 1em"></expense-form>

		<sui-card width="100%" style="width: 100%">
			<sui-card-content>
				<sui-card-header>Expenses charts</sui-card-header>
				<sui-container text-align="center">
					<expenses-chart></expenses-chart>
				</sui-container>
			</sui-card-content>
		</sui-card>

		<expense-list :amount="7"></expense-list>
	</div>
</template>

<script>
// @ is an alias to /src
import AccountList from '@/components/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ExpenseList from '@/components/ExpenseList.vue';
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';

export default {
  name: 'home',
  components: {
		AccountList,
    BalanceSummary,
    ExpenseList,
		ExpensesChart,
		ExpenseForm,
  }
}
</script>
