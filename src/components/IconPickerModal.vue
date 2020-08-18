<template>
  <div class="icon-picker">
    <div class="toggler" @click.stop.prevent="$emit('open')">
      <sui-icon :name="icon" />
    </div>

    <sui-modal v-model="isOpen">
      <sui-modal-header>Pick an icon</sui-modal-header>

      <sui-modal-content scrolling>
        <div class="icon-list">
          <div
            class="icon-container"
            v-for="(name, i) in iconList"
            :key="i"
            @click="$emit('input', name) ; $emit('close')"
          >
            <sui-icon :name="name" />
            <span class="icon-name">{{ name }}</span>
          </div>
        </div>
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
import ICON_LIST from '@/config/icons';

export default {
  props: {
    isOpen: { type: Boolean, required: true, },
    icon: { type: String, required: false, default: 'dollar', },
  },

  computed: {
    iconList() {
      return ICON_LIST;
    },
  },
}
</script>

<style lang="scss">
.icon-picker {
  .toggler {
    border: solid 1px #ccc;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    padding: 0.25em;
    padding-left: 0.5em;
  }

  .icon-list {
    display: flex;
    flex-flow: row wrap;

    .icon-container {
      cursor: pointer;
      border: 1px solid #888;
      border-radius: 6px;
      display: flex;
      flex-flow: column nowrap;
      min-width: 3em;
      margin: 0.25em;
      padding: 0.25em;
      text-align: center;

      .icon { margin: 0 auto; }
    }
  }
}
</style>
