<template>
	<div>
    <expense-filters @setFilters="setFilters($event)"></expense-filters>
		<expense-form :hide-btn="true"></expense-form>
    <expenses-chart :filters="expensesFilters"></expenses-chart>
    <expense-list :filters="expensesFilters"></expense-list>
	</div>
</template>


<script>
import ExpensesChart from '@/components/charts/Expenses.vue';
import ExpenseFilters from '@/components/ExpenseFilters.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import ExpenseList from '@/components/ExpenseList.vue';

export default {
  name: 'expenses',
  components: {
    ExpensesChart,
    ExpenseFilters,
    ExpenseList,
    ExpenseForm,
  },
  data() {
    return {
      expensesFilters: []
    }
  },
  methods: {
    setFilters(filters) {
      this.expensesFilters = filters
    },
  },
}
</script>
