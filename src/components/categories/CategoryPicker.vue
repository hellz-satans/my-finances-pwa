<template>
  <div class="category-picker relative">
    <button
      type="button"
      class="w-full btn rounded text-white flex flex-col flex-no-wrap justify-center items-center p-2"
      :style="'background:'+(category.color)"
      :disabled="disabled"
      @click="open = !open"
    >
      <div><fa :icon="[ 'fas', category.icon ]" /></div>
      <div>{{ (category.name || '______________') }}</div>
    </button>

    <div
      v-if="open"
      class="w-full flex flex-row flex-wrap bg-white absolute origin-top-right rounded-md shadow-xl z-10 border border-gray-600"
    >
      <div
        v-for="(opt, i) in options"
        :key="i"
        @click="$emit('input', opt) ; open = false"
        :style="'background:' + (opt.color || 'var(--default-color-dark, #666)')"
        class="text-white rounded m-1 border border-gray-400 pointer p-2 shadow-2xl"
      >
        <fa :icon="[ 'fas', opt.icon ]" />
        {{ opt.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryPicker",

  props: {
    options: { type: Array, required: true, },
    category: { type: Object, required: true, },
    disabled: { type: Boolean, required: false, default: false, },
  },

  data() {
    return {
      open: false,
    };
  },
}
</script>

<style lang="scss">
.category-picker {
  > button {
    min-height: 4em;
  }
}
</style>
