<template>
	<section class="balance-summary">
		<h2 class="balance-summary__goal">
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

		<preference-modal preference-key="goal" />
	</section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PreferenceModal from '@/components/PreferenceModal.vue'

export default {
	name: 'BalanceSummary',
	components: {
		PreferenceModal,
	},
	computed: {
		... mapGetters([ 'balanceSummary' ]),
		... mapGetters('accounts', [ 'totalBalance' ]),
		... mapGetters('expenses', [ 'expensesPastWeek', 'expensesPastMonth' ]),
		... mapGetters('preferences', [ 'goal' ]),
		cssClasses() {
			return {
				orange: this.balanceSummary < 0
			};
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
