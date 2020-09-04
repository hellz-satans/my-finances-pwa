<template>
  <section class="my-finances">
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>

    <header
      class="flex justify-between items-baseline py-1 px-3 border-b-2 border-grey-900"
    >
      <router-link to="/" class="title">My Finances</router-link>

      <sidebar />
    </header>

    <nav v-if="currentRoute == 'home'">
      <router-link
        class="expense-form-button text-white bg-green-500"
        to="/expense/new"
      >
        <fa icon="plus" />
      </router-link>

      <router-link
        class="transfer-form-button text-white bg-blue-500"
        to="/transfer"
      >
        <fa icon="exchange-alt" />
      </router-link>
    </nav>

    <transition name="slide-fade">
      <router-view/>
    </transition>
  </section>
</template>

<script>
import Loader  from '@/components/Loader'
import Sidebar from '@/components/Sidebar'

// NOTE: this should be relative to <loader>'s animation duration
const INITIAL_LOAD_TIMEOUT = 2600;

export default {
  name: "MyFinances",

  components: {
    Loader,
    Sidebar,
  },

  data() {
    return {
      isLoading: true,
      routes: this.$router.options.routes,
    }
  },

  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },

  created() {
    this.$store.dispatch('accounts/createCashAccount');
    this.$store.dispatch('categories/seedData');
    this.$store.commit('accounts/getAccounts');
    this.$store.commit('preferences/getPreferences');
    this.$store.commit('expenses/getExpenses');

    window.setTimeout((ev) => this.isLoading = false, INITIAL_LOAD_TIMEOUT);
  },
}
</script>

<style scoped lang="scss">
.my-finances {
}
</style>
