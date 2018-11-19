<style lang="scss">
	.expenses {
		.expenses-chart-container {
			max-width: 450px;
		}
	}
</style>

<template>
	<section class="expenses">
		<h2>Expenses</h2>
		<expense-form></expense-form>
		<expense-list></expense-list>
		<expenses-chart-container></expenses-chart-container>
	</section>
</template>

<script>
	import ExpensesChartContainer from '../components/ExpensesChartContainer.vue';
	import ExpenseForm from '../components/ExpenseForm.vue';
	import ExpenseList from '../components/ExpenseList.vue';

	export default {
		components: {
			ExpensesChartContainer,
			ExpenseForm,
			ExpenseList,
		},
	}
</script>
