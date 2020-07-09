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
        v-if="! route.hide"
        style="text-transform: uppercase"
      ></router-link>
    </sui-menu>

    <transition name="slide-fade">
      <router-view/>
    </transition>

    <hr>

    <footer class="text-center mt-1 mb-1">
      <p>
        {{ NAME }} <strong>v{{ VERSION }}</strong>
      </p>
    </footer>
  </sui-container>
</template>

<script>
import { NAME, VERSION } from '@/config/application_properties'

export default {
  data() {
    return {
      routes: this.$router.options.routes,
      NAME: NAME,
      VERSION: VERSION,
    }
  },
}
</script>

<style scoped lang="scss">
.ui.menu {
  justify-content: space-between;
}
</style>
