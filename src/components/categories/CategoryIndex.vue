<template>
  <section class="category-index">
    <nav class="text-right">
      <router-link
        is="sui-menu-item"
        to="/category/new"
      >
        Add
        <sui-icon name="plus" color="blue" />
      </router-link>
    </nav>
  </section>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
.category-index {
}
</style>
