<template>
  <aside class="sidebar">
    <fa
      class="pointer"
      @click="visible = !visible"
      :name="visible ? 'close' : 'bars'"
      icon="bars"
    />

    <transition name="grow-235">
      <nav v-if="visible">
        <router-link
          v-for="route in routes"
          v-if="! route.hide"
          :key="route.name"
          :to="route.path"
          :exact="route.exact"
          @click.native="visible = false"
        >
          <fa :icon="[ 'fas', route.icon ]" />
          <span>{{ route.name }}</span>
        </router-link>
      </nav>
    </transition>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",

  data() {
    return {
      visible: false,
    };
  },

  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },
}
</script>

<style lang="scss">
$cubic: cubic-bezier(0.4, 0.1, 0.165, 1.0);
$bg: #333;
$border-radius-max: 100em;
$border-radius-mid: 75em;
$border-radius-min: 1em;
$duration: 0.5s;
$final-width: 70%;

.sidebar {
  display: inline-block;

  nav {
    position: absolute;
    top: 2em; // this is arbitrary -- we need to know header's height
    right: 0;
    overflow: hidden;
    width: $final-width;
    text-align: left;
    z-index: 99;

    a {
      color: white;
      display: block;
      background: $bg;
      padding: 0.75em;
      padding-right: 2em;
      text-transform: uppercase;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;

      &:visited { color: white; }
      &.active  { background: lighten($bg, 20%); }

      svg {
        width: 1.2em !important;
        margin-right: 0.5em;
      }

      &:last-child {
        border-radius: 0 0 0 $border-radius-min;
      }
    }
  }
}

// TODO: move these classes out of component?
.grow-235-enter {
  transform: translate(50%, -50%) scale(0);
  height: 1em;
  border-radius: 0 0 0 $border-radius-max;
  opacity: 0;
}
.grow-235-leave {
  transition: all $duration $cubic;
  border-radius: 0 0 0 $border-radius-min;
}

.grow-235-enter-active {
  transition: all $duration $cubic;
  border-radius: 0 0 0 $border-radius-mid;
}
.grow-235-leave-active {
  transition: all $duration $cubic;
  border-radius: 0 0 0 $border-radius-mid;
}

.grow-235-enter-to {
  transform: translate(0, 0) scale(1);
  border-radius: 0 0 0 $border-radius-min;
  height: auto;
  opacity: 1;
}
.grow-235-leave-to {
  transform: translate(50%, -50%) scale(0);
  border-radius: 0 0 0 $border-radius-max;
  opacity: 0;
}
</style>
