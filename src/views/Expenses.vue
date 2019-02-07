<template>
	<div>
    <expense-filters @setFilters="setFilters($event)"></expense-filters>
		<expense-form :hide-btn="true"></expense-form>
		<sui-card width="100%" style="width: 100%">
			<sui-card-content>
				<sui-card-header>Expenses charts</sui-card-header>
				<sui-container text-align="center">
					<expenses-chart :filters="expensesFilters"></expenses-chart>
				</sui-container>
			</sui-card-content>
		</sui-card>
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
