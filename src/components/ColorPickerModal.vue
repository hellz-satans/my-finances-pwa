<template>
  <div class="color-picker">
    <div class="toggler" @click.stop.prevent="isOpen = true">
      <fa :icon="[ 'fas', 'eye-dropper' ]" />
    </div>

    <v-modal
      v-if="isOpen"
      title="Pick a color"
      @close="isOpen = false"
    >
      <div>
        <v-swatches
          @input="$emit('input', $event) ; isOpen = false"
          inline
          shapes="circles"
          :swatches="colorList"
        />
      </div>

      <hr>

      <div class="actions text-right">
        <button
          type="button"
          class="text-gray-700 py-2 px-4 hover:underline"
          @click.prevent.stop="isOpen = false"
        >
          Close
        </button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import VModal from '@/components/VModal.vue';
import VSwatches from 'vue-swatches';
import COLORS    from '@/config/colors';

export default {
  components: {
    VModal,
    VSwatches,
  },

  data() {
    return {
      isOpen: false,
    };
  },

  computed: {
    colorList() { return COLORS; },
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
