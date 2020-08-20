<template>
  <section class="my-finances">
    <header class="space-between m-1">
      <span class="title">My Finances</span>

      <sui-icon
        class="pointer"
        @click="sidebarVisible = !sidebarVisible"
        :name="sidebarVisible ? 'close' : 'bars'"
      />
    </header>

    <sui-sidebar-pushable>
      <sui-menu
        is="sui-sidebar"
        :visible="sidebarVisible"
        animation="overlay"
        inverted
        vertical
      >
        <router-link
          v-for="route in routes"
          v-if="! route.hide"
          is="sui-menu-item"
          :key="route.name"
          :to="route.path"
          :exact="route.exact"
          :icon="route.icon"
          style="text-transform: uppercase"
          @click.native="sidebarVisible = false"
        >
          {{ route.name }}
        </router-link>
      </sui-menu>

      <sui-sidebar-pusher :dimmed="sidebarVisible">
        <transition name="slide-fade">
          <router-view/>
        </transition>

        <footer class="text-center mt-1 mb-1">
          <p>
            {{ NAME }} <strong>v{{ VERSION }}</strong>
          </p>
        </footer>
      </sui-sidebar-pusher>
    </sui-sidebar-pushable>
  </section>
</template>

<script>
import { NAME, VERSION } from '@/config/application_properties'

export default {
  name: "MyFinances",

  data() {
    return {
      routes: this.$router.options.routes,
      NAME: NAME,
      VERSION: VERSION,
      sidebarVisible: false,
    }
  },
}
</script>

<style scoped lang="scss">
.my-finances {
  .pusher {
    min-height: 80vh;
    padding: 0 1em;
  }
}
</style>
