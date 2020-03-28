<template>
  <sui-container>
    <sui-menu pointing secondary>
      <router-link
        v-for="route in routes"
        is="sui-menu-item"
        :key="route.name"
        :to="route.path"
        :exact="route.exact"
        v-text="route.name"
        style="text-transform: uppercase"
      ></router-link>
    </sui-menu>

    <transition name="slide-fade">
      <router-view/>
    </transition>

    <hr>

    <footer class="text-center">
      <p>
        My Finances PWA <strong>v{{ VERSION }}</strong>
      </p>
    </footer>
  </sui-container>
</template>

<script>
import { VERSION } from '@/config/application_properties'

export default {
  data() {
    return {
      routes: this.$router.options.routes,
      VERSION: VERSION,
    }
  },
}
</script>
