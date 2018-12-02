<template>
	<div>
		<expense-filters style="margin-bottom: 1em"></expense-filters>
		<expense-form :hide-btn="true"></expense-form>
		<expense-list></expense-list>
	</div>
</template>

<script>
    import ExpenseFilters from '@/components/ExpenseFilters.vue';
    import ExpenseList from '@/components/ExpenseList.vue';
    import ExpenseForm from '@/components/ExpenseForm.vue';

    export default {
        name: 'home',
        components: {
            ExpenseFilters,
            ExpenseList,
            ExpenseForm,
        }
    }
</script>
