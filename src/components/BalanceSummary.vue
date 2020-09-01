<template>
  <section class="balance-summary text-right m-3">
    <p :class="cssClasses">
      <span class="inline-block mb-1 hidden">Balance:</span>
      <span class="text-xxlarge">{{ totalBalance | currency }}</span>
    </p>

    <p class="balance-summary__goal">
      Goal:
      <span class="text-large">{{ goal | currency }}</span>
    </p>

    <span>Week:</span>
    <span class="font-medium">{{ expensesPastWeek | currency }}</span>
    <br>
    <span>Month:</span>
    <span class="font-medium">{{ expensesPastMonth | currency }}</span>

    <br />

    <router-link
      class="text-small rounded inline-block py-1 px-3 m-2"
      to="/preference/goal"
    >
      Edit goal &nbsp;
      <fa class="text-small" :icon="[ 'fas', 'pen' ]" />
    </router-link>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'BalanceSummary',

  computed: {
    ... mapGetters([ 'balanceSummary' ]),
    ... mapGetters('accounts', [ 'totalBalance' ]),
    ... mapGetters('expenses', [ 'expensesPastWeek', 'expensesPastMonth' ]),
    ... mapState('preferences', [ 'preferences', ]),

    cssClasses() {
      let color = 'black';

      if (this.goal > 0) {
        if (this.balanceSummary > (this.goal * 0.80))
          color = 'green';
        else if (this.balanceSummary > (this.goal * 0.50))
          color = 'orange';
        else
          color = 'red';
      }

      return {
        [color]: true,
        'balance-summary__total': true,
      };
    },

    goal() {
      return this.preferences.goal || 0;
    },
  },
}
</script>

<style lang="scss">
.balance-summary {
  &__goal, &__total {
    margin: 0.5rem 0;
  }
}
</style>
