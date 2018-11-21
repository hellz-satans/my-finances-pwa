import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters'
import './registerServiceWorker'
import './styles/main.scss'

import SuiVue from 'semantic-ui-vue';
Vue.use(SuiVue);

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('fa', FontAwesomeIcon)

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
    this.$store.dispatch('categories/seedData');
  },
}).$mount('#app')
