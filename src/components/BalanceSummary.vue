<template>
    <section class="balance-summary">
		<h2 :class="cssClasses">Summary: \${{ balanceSummary }}</h2>
		<h3>Goal: \${{ goal }}</h3>
	</section>
</template>

<script>
	import { mapGetters, mapState } from 'vuex';

	export default {
		name: 'BalanceSummary',
		computed: {
			... mapState([ 'goal' ]),
			... mapGetters('accounts', [ 'balanceSummary' ]),
			cssClasses() {
				return {
					orange: this.balanceSummary < 0
				};
			},
		}
	}
</script>
