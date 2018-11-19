<template>
	<section class="expenses">
		<h2>Expenses</h2>
		<expense-form></expense-form>
		<expense-list></expense-list>
	</section>
</template>

<script>
	import ExpenseForm from '../components/ExpenseForm.vue';
	import ExpenseList from '../components/ExpenseList.vue';

	export default {
		components: {
			ExpenseForm,
			ExpenseList,
		},
	}
</script>
