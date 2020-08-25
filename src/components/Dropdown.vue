<template>
  <div class="dropdown relative">
    <select
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      class="block appearance-none w-full bg-gray-100 border border-gray-500 p-2 rounded focus:outline-none focus:bg-white focus:border-gray-600"
    >
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>

    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
      <fa icon="caret-down" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",

  props: {
    options: { type: Array, required: true, },
    placeholder: { type: String, default: "Select an option", },
  },
}
</script>

<style lang="scss">
</style>
