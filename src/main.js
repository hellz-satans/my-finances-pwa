import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters'
import './registerServiceWorker'
import { mapState } from 'vuex'
import './styles/styles.scss'

import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';
Vue.use(SuiVue);

import "vue-swatches/dist/vue-swatches.min.css"

window.moment = require('moment');

Vue.config.productionTip = false

new Vue({
  router,
  store,
  filters,
  render: h => h(App),
  mounted() {
    this.$store.commit('accounts/getAccounts');
    this.$store.commit('expenses/getExpenses');
  },
}).$mount('#app')
