<template>
	<section class="expenses">
		<h2>Expenses</h2>
		<expense-form></expense-form>
		<expense-filters></expense-filters>
		<expense-list></expense-list>
	</section>
</template>

<script>
	import ExpenseFilters from '@/components/ExpenseFilters.vue';
	import ExpenseForm from '../components/ExpenseForm.vue';
	import ExpenseList from '../components/ExpenseList.vue';

	export default {
		components: {
			ExpenseFilters,
			ExpenseForm,
			ExpenseList,
		},
	}
</script>
