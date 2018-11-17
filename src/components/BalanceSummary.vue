<template>
    <section class="balance-summary">
		<h2 :class="cssClasses">Summary: \${{ balanceSummary }}</h2>
		<h3>Goal: \${{ goal }}</h3>
	</section>
</template>

<script>
    export default {
        name: 'BalanceSummary',
        computed: {
            cssClasses() {
                return {
                    orange: this.balanceSummary < 0
                };
            },
            ... Vuex.mapState([ 'goal' ]),
            ... Vuex.mapGetters([ 'balanceSummary' ])
        }
    }
</script>