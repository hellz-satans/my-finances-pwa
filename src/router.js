import Vue from 'vue'
import Router from 'vue-router'
import About from '@/views/About'
import Home from './views/Home.vue'
import ImportExport from '@/components/ImportExport.vue'
import AccountForm from '@/components/accounts/AccountForm'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import CategoryForm from '@/components/categories/CategoryForm'
import PreferenceForm from '@/components/PreferenceForm'

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
      path: '/account/:account_key',
      name: 'account-form',
      component: AccountForm,
      hide: true,
    },

    {
      path: '/',
      name: 'home',
      icon: 'home',
      exact: true,
      component: Home
    },

    {
      path: '/categories',
      name: 'categories',
      icon: 'database',
      component: CategoryForm,
    },

    {
      path: '/preference/:key',
      name: 'preference',
      hide: true,
      component: PreferenceForm,
    },

    {
      path: '/import-export',
      name: 'data',
      icon: 'open folder outline',
      component: ImportExport
    },

    {
      path: '/about',
      name: 'about',
      icon: 'info',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      component: About,
    },
  ]
})
