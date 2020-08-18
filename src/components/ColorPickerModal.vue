<template>
  <div class="color-picker">
    <span class="toggler" @click.stop.prevent="$emit('open')">
      <sui-icon name="eye dropper" />
    </span>

    <sui-modal v-model="isOpen">
      <sui-modal-header>Pick a color</sui-modal-header>

      <sui-modal-content scrolling>
        <v-swatches @input="$emit('input', $event) ; $emit('close')" inline />
      </sui-modal-content>

      <sui-modal-actions class="text-right">
        <sui-button @click.native.prevent.stop="$emit('close')">
          Close
        </sui-button>
      </sui-modal-actions>
    </sui-modal>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches';

export default {
  components: {
    VSwatches,
  },

  props: {
    isOpen: { type: Boolean, required: true, },
  },
}
</script>

<style lang="scss">
.color-picker {
  .toggler {
    text-align: center;
    cursor: pointer;
    padding: 0.25em;
    padding-left: 0.5em;
  }
}
</style>
