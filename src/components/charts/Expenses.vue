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
				let tmpObj = null;

				data.forEach((el, i, arr) => {
					if (!dict[el[pivot]]) {
						dict[el[pivot]] = 0;
					}
					dict[el[pivot]] += el[summarizable];
				});

				for (const key in dict) {
					tmpObj = {};
					tmpObj[pivot] = key;
					tmpObj[summarizable] = dict[key];
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
							price: el.price * el.qty,
							date: moment(el.date).format('YYYY-MM-DD'),
						};
					});

				return { columns, rows: this.mergeData(rows, 'date', 'price') };
			},
		},
	}
</script>
