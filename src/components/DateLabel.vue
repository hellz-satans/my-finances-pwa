<template>
  <span class="date-label" @click="toggleFormat">
    <span v-if="format === 'ago'">
      {{ date | ago }}
    </span>
    <span v-else>
      {{ date | format('HH:mm MMM D, YYYY') }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    date: { required: true, },
  },

  data() {
    return {
      format: 'ago',
    }
  },

  methods: {
    toggleFormat(ev) {
      if (this.format === 'ago')
        this.format = 'raw'
      else
        this.format = 'ago'
    },
  },
}
</script>
