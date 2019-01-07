import Vue from 'vue'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters'
import './registerServiceWorker'
import './styles/main.scss'

import SuiVue from 'semantic-ui-vue';
Vue.use(SuiVue);
Vue.use(VeeValidate)

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('fa', FontAwesomeIcon)

window.moment = require('moment');

Vue.config.productionTip = false

// register vue filters
for (const k in filters) {
	Vue.filter(k, filters[k])
}

new Vue({
  router,
  store,
  filters,
  render: h => h(App),
  mounted() {
    this.$store.commit('accounts/getAccounts');
    this.$store.dispatch('categories/seedData');
    if (process.env.NODE_ENV === 'production') {
      this.$store.commit('expenses/getExpenses');
    } else {
      this.$store.dispatch('expenses/seedData'); // this commits expenses/getExpenses
    }
  },
}).$mount('#app')
