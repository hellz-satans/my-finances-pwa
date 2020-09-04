<template>
  <section class="home">
    <balance-summary />
    <account-list />
    <chart-container />
    <expense-filters />
    <expense-list />

    <footer class="text-center py-2 border-t-2 border-grey-900">
      <p>
        {{ NAME }} <strong>v{{ VERSION }}</strong>
      </p>
    </footer>
  </section>
</template>

<script>
import { NAME, VERSION } from '@/config/application_properties'
// @ is an alias to /src
import AccountList from '@/components/accounts/AccountList.vue';
import BalanceSummary from '@/components/BalanceSummary.vue'
import ChartContainer from '@/components/charts/ChartContainer.vue';
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpenseFilters from '@/components/expenses/ExpenseFilters.vue';

export default {
  name: 'Home',

  components: {
    AccountList,
    BalanceSummary,
    ChartContainer,
    ExpenseList,
    ExpenseFilters,
  },

  computed: {
    NAME() { return NAME; },
    VERSION() { return VERSION; },
  },
}
</script>
