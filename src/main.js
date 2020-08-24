import Vue from 'vue'
import VueX from 'vuex'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from '@/stores'
import filters from './filters'
import '@/registerServiceWorker'
import '@/styles/main.scss'

// styles
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'vue2-datepicker/index.css'

// setup libraries
library.add(far)
library.add(fas)
window.moment = moment

// config Vue
Vue.use(VueX)
Vue.config.productionTip = false
Vue.component('fa', FontAwesomeIcon)

// register vue filters
for (const k in filters) {
	Vue.filter(k, filters[k])
}

new Vue({
  router,
  store,
  filters,
  render: h => h(App),
  beforeMount() {
    this.$store.commit('expenses/getExpenses');
    this.$store.commit('accounts/getAccounts');
    this.$store.dispatch('accounts/createCashAccount');
    this.$store.commit('preferences/getPreferences');
    this.$store.dispatch('categories/seedData');
  },
}).$mount('#app')
