import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ImportExport from '@/components/ImportExport.vue'
import ExpenseList from './components/ExpenseList.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      name: 'home',
      exact: true,
      component: Home
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpenseList
    },
    {
      path: '/import-export',
      name: 'import/export',
      component: ImportExport
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
  ]
})
