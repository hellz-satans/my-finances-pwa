<template>
  <article class="category-card card" :style="categoryStyle">
    <header class="card-header">
      <span class="card-actions">
      </span>
    </header>

    <div class="card-body">
      {{ category.name }}
    </div>

    <footer class="card-footer">
    </footer>
  </article>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
    category: { required: true, type: Object },
  },

  computed: {
    categoryStyle() {
      const styles = {
        'background-color': this.category.color || '#ccd',
        'color': this.category.color ? '#eee' : '#333',
      }
      let str = ''

      for (const k in styles) {
        str += `${k}: ${styles[k]};`
      }

      return str
    },
  },

  methods: {
    ... mapActions('categories', [
    ]),

    deletecategoryProxy(category) {
      if (window.confirm('Are you sure?')) {
        this.deletecategory(category)
      }
    },
  },
}
</script>

<style lang="scss">
.category-card {
}
</style>
