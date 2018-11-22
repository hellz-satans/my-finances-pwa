<template>
    <ve-line :settings="chartSettings" :extend="chartOptions" :data="chartData"></ve-line>
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
			chartSettings() {
				return {
					area: true,
				};
			},
			chartOptions() {
				return {
					series: {
						smooth: false,
					},
				};
			},
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
