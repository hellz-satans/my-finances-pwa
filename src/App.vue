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

    <router-view/>
  </sui-container>
</template>

<script>
  export default {
    data() {
        return {
            routes: this.$router.options.routes,
        }
    },
  }
</script>
