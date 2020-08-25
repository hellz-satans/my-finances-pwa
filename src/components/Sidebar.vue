<template>
  <span class="sidebar">
    <fa
      class="pointer"
      @click="sidebarVisible = !sidebarVisible"
      :name="sidebarVisible ? 'close' : 'bars'"
      icon="bars"
    />

    <nav :class="cssClasses">
      <router-link
        v-for="route in routes"
        v-if="! route.hide"
        :key="route.name"
        :to="route.path"
        :exact="route.exact"
        style="text-transform: uppercase"
        @click.native="sidebarVisible = false"
      >
        {{ route.name }}
      </router-link>
    </nav>
  </span>
</template>

<script>
export default {
  name: "Sidebar",

  data() {
    return {
      sidebarVisible: false,
    };
  },

  computed: {
    routes() {
      return this.$router.options.routes;
    },

    cssClasses() {
      return {
        hidden: ! this.sidebarVisible,
      };
    },
  },
}
</script>

<style lang="scss">
</style>
