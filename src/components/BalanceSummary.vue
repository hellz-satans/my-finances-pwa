<template>
	<section class="balance-summary">
		<h2 :class="cssClasses">
      Savings Goal: {{ goal | currency }}
    </h2>

		<h3 class="balance-summary__total">
      Total in accounts: {{ totalBalance | currency }}
    </h3>

		<span class="semi-bold">Expenses last 7 days:</span> &nbsp;
		<span class="bold">{{ expensesPastWeek | currency }}</span>
		<br>
		<span class="semi-bold">Expenses last month:</span> &nbsp;
		<span class="bold">{{ expensesPastMonth | currency }}</span>

    <br />
    <router-link
      is="sui-button"
      to="/preference/goal"
      size="mini"
      icon="pencil"
    >
      Edit goal
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
        'balance-summary__goal': true,
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
	text-align: right;

  &__goal, &__total {
    margin: 0.5rem 0;
  }

  .preference-modal {
    margin: 0.75rem 0;
  }
}
</style>
