<template>
  <section class="my-finances">
    <header class="text-right">
      <sui-icon
        class="m-1 pointer"
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
      </sui-sidebar-pusher>
    </sui-sidebar-pushable>

    <hr>

    <footer class="text-center mt-1 mb-1">
      <p>
        {{ NAME }} <strong>v{{ VERSION }}</strong>
      </p>
    </footer>
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
    padding: 0 1em;
  }
}
</style>
