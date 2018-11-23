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
		methods: {
			/**
			 * Summarize data by a given field.
			 *
			 * Suppose you have an array of data like this:
			 *
			 * 	[
			 * 		{ date: '2018-01-01', price: 100 },
			 * 		{ date: '2018-02-02', price: 100 },
			 * 		{ date: '2018-01-01', price: 150 }
			 * 	]
			 *
			 * 	This function returns as summarized array like this:
			 *
			 * 	[
			 * 		{ date: '2018-01-01', price: 250 },
			 * 		{ date: '2018-02-02', price: 100 },
			 * 	]
			 *
			 * @param  data [Object]
			 * @param  key String
			 * @return [Object]
			 */
			mergeData(data, pivot, summarizable) {
				const result = [],
					dict = {};
				let i = 0,
					len = 0,
					tmpObj = null;

				for (i = 0, len = data.length; i < len; ++i) {
					if (!dict[data[i][pivot]]) {
						dict[data[i][pivot]] = 0;
					}
					dict[data[i][pivot]] += data[i][summarizable];
				}

				for (i in dict) {
					tmpObj = {};
					tmpObj[pivot] = i;
					tmpObj[summarizable] = dict[i];
					result.push(tmpObj)
				}

				return result;
			}
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

				return { columns, rows: this.mergeData(rows, 'date', 'price') };
			},
		},
	}
</script>
