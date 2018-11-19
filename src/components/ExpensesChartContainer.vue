<template>
	<aside class="expenses-chart-container">
		<expenses-chart class="expenses-chart" :chart-data="chartData">
		</expenses-chart>
	</aside>
</template>

<script>
	import ExpensesChart from './charts/ExpensesChart.vue';
	import { mapState } from 'vuex';

	export default {
		components: {
			ExpensesChart,
		},
		computed: {
			... mapState('expenses', [ 'expenses' ]),
			chartData() {
				return {
					labels: this.expenses
						.reverse()
						.map((exp, i) => exp.date.toLocaleDateString()),
					datasets: [
						{
							label: 'Expenses',
							// TODO: use a canvas gradient, see https://hackernoon.com/creating-stunning-charts-with-vue-js-and-chart-js-28af584adc0a
							backgroundColor: 'rgba(223, 100, 12, 0.5)',
							borderColor: '#f58c4b',
							pointBorderColor: '#f58c4b',
							pointBackgroundColor: '#f58c4b',
							borderWidth: 1,
							data: this.expenses
							.reverse()
							.map((exp, i) => exp.price),
						}
					],
				};
			},
			chartOptions() {
				return {
					responsive: true,
					maintainAspectRatio: false,
				};
			},
		},
	};
</script>
