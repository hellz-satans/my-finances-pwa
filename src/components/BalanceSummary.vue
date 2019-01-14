<style lang="scss">
.balance-summary {
	text-align: right;
}
</style>

<template>
	<section class="balance-summary">
		<h2>Savings Goal: {{ goal | currency }}</h2>
		<span class="semi-bold">Expenses last 7 days:</span> &nbsp;
		<span class="bold">{{ expensesPastWeek | currency }}</span>
		<br>
		<span class="semi-bold">Expenses last month:</span> &nbsp;
		<span class="bold">{{ expensesPastMonth | currency }}</span>
	</section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'BalanceSummary',
	computed: {
		... mapState([ 'goal' ]),
		... mapGetters([ 'balanceSummary' ]),
		... mapGetters('expenses', [ 'expensesPastWeek', 'expensesPastMonth' ]),
		cssClasses() {
			return {
				orange: this.balanceSummary < 0
			};
		},
	},
}
</script>
