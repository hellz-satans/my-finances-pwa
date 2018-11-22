<template>
    <ve-line :data="chartData"></ve-line>
</template>

<script>
	import VeLine from 'v-charts/lib/line.common'
	import { mapState } from 'vuex'
	import moment from 'moment'

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
							date: moment(el.date).format('YYYY-MM-DD'),
						};
					});

				return { columns, rows };
			},
		},
	}
</script>
