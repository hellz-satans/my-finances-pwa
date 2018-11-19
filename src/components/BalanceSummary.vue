<style lang="scss">
	.balance-summary {
		text-align: right;
	}
</style>

<template>
    <section class="balance-summary">
		<h2 :class="cssClasses">Summary: {{ balanceSummary | currency }}</h2>
		<h3>Goal: {{ goal | currency }}</h3>
	</section>
</template>

<script>
	import { mapGetters, mapState } from 'vuex';

	export default {
		name: 'BalanceSummary',
		computed: {
			... mapState([ 'goal' ]),
			... mapGetters([ 'balanceSummary' ]),
			cssClasses() {
				return {
					orange: this.balanceSummary < 0
				};
			},
		}
	}
</script>
