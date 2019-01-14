<template>
  <div>
    <expense-filters @setFilters="setFilters($event)"></expense-filters>
    <expense-form :hide-btn="true"></expense-form>
    <expense-list :filters="expensesFilters"></expense-list>
  </div>
</template>

<script>
import ExpenseFilters from '@/components/ExpenseFilters.vue';
import ExpenseList from '@/components/ExpenseList.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';

export default {
  name: 'expenses',
  components: {
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
