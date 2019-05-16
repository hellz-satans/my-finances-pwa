import Vue from 'vue'
import VueX from 'vuex'
import SuiVue from 'semantic-ui-vue'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from '@/stores'
import filters from './filters'
import '@/registerServiceWorker'
import '@/styles/main.scss'

// styles
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// setup libraries
library.add(fas)
window.moment = moment

// config Vue
Vue.use(SuiVue);
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
    this.$store.commit('preferences/getPreferences');
    this.$store.dispatch('categories/seedData');
  },
}).$mount('#app')
