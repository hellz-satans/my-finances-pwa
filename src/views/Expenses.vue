<template>
  <section class="expenses-view">
    <expense-filters />
    <expense-form :hide-btn="true" />
    <expenses-chart />
    <expense-list />
  </section>
</template>


<script>
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import ExpenseList from '@/components/expenses/ExpenseList.vue';

export default {
  name: 'expenses',
  components: {
    ExpensesChart,
    ExpenseFilters,
    ExpenseList,
    ExpenseForm,
  },
}
</script>
