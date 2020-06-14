<template>
  <money
    class="money-input"
    v-bind="moneyConf"
    @input="$emit('input', $event)"
    :value="value"
  ></money>
</template>

<script>
import { Money } from 'v-money'

export default {
  components: {
    Money,
  },

  props: {
    value: { type: Number, required: false, default: 0, },
  },

  data() {
    return {
      moneyConf: {
        prefix: '$',
        precision: 2,
        masked: false,
      },
    }
  },

  methods: {
    hola(ev) {
      console.debug('hola:', ev)
      this.$emit('input', ev)
    },
  },
}
</script>
