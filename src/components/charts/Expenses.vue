<template>
    <ve-line :data="chartData"></ve-line>
</template>

<script>
	import VeLine from 'v-charts/lib/line.common'
	import { mapState } from 'vuex'

	export default {
		components: {
			VeLine,
		},
		computed: {
			... mapState('expenses', [ 'expenses' ]),
			chartData() {
				const columns = [ 'date', 'price', ];
				const rows = this.expenses
					.map((el, i, arr) => {
						return {
							price: el.price,
							date: el.date.toLocaleDateString(),
						};
					});

				return { columns, rows };
			},
		},
	}
</script>
