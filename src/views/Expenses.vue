<template>
	<div>
		<expense-filters style="margin-bottom: 1em"></expense-filters>
		<expense-form :hide-btn="true"></expense-form>
		<sui-card width="100%" style="width: 100%">
			<sui-card-content>
				<sui-card-header>Expenses charts</sui-card-header>
				<sui-container text-align="center">
					<expenses-chart></expenses-chart>
				</sui-container>
			</sui-card-content>
		</sui-card>
		<expense-list></expense-list>
	</div>
</template>

<script>
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseFilters from '@/components/ExpenseFilters.vue';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';

export default {
  name: 'home',
  components: {
    ExpensesChart,
    ExpenseFilters,
    ExpenseForm,
    ExpenseList,
  }
}
</script>
