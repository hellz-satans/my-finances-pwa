import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    this.$store.commit('accounts/getAccounts');
    this.$store.commit('expenses/getExpenses');
  },

  // TODO: extract all of this to a chart component
  computed: {
    ... Vuex.mapState('expenses', [ 'expenses' ]),
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
  }
}).$mount('#app')
