<template>
  <section class="my-finances">
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
import Sidebar from '@/components/Sidebar'

export default {
  name: "MyFinances",

  components: {
    Sidebar,
  },

  data() {
    return {
      routes: this.$router.options.routes,
    }
  },

  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
}
</script>

<style scoped lang="scss">
.my-finances {
}
</style>
