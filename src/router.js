import Vue from 'vue'
import Router from 'vue-router'
import About from '@/views/About'
import Home from './views/Home.vue'
import ImportExport from '@/components/ImportExport.vue'
import ExpenseForm from '@/components/expenses/ExpenseForm'

Vue.use(Router)

export default new Router({
  linkActiveClass: "active",
  routes: [
    {
      path: '/expense/:expense_id',
      name: 'expense-form',
      component: ExpenseForm,
      hide: true,
    },
    {
      path: '/',
      name: 'home',
      exact: true,
      component: Home
    },
    {
      path: '/import-export',
      name: 'data',
      component: ImportExport
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      component: About,
    },
  ]
})
