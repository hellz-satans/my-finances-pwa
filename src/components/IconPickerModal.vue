<template>
  <div class="icon-picker">
    <div class="toggler" @click.stop.prevent="isOpen = true">
      <fa :icon="icon" />
    </div>

    <v-modal
      v-if="isOpen"
      title="Pick an icon"
      @close="isOpen = false"
    >
      <div class="w-full mb-3">
        <div class="relative">
          <div class="absolute left-0 inset-y-0 pl-3 flex items-center">
            <fa :icon="[ 'fas', 'search' ]" />
          </div>

          <input
            class="block w-full bg-gray-100 border border-gray-500 rounded p-2 pl-8 focus:outline-none focus:bg-white focus:border-gray-600"
            placeholder="Search..."
            v-model="search"
          />
        </div>
      </div>

      <div class="icon-list">
        <div
          class="icon-container"
          v-for="(arr, i) in iconList"
          :key="i"
          @click="$emit('input', arr[1]) ; isOpen = false"
        >
          <fa :icon="arr" />
          <span class="icon-name text-xsmall">{{ arr[1] }}</span>
        </div>
      </div>

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
import { fas } from '@fortawesome/free-solid-svg-icons'

export default {
  components: {
    VModal,
  },

  props: {
    icon: { type: String, required: false, default: 'dollar', },
  },

  data() {
    return {
      isOpen: false,
      search: '',
    };
  },

  computed: {
    iconList() {
      const list = [];

      for (let k in fas) {
        // avoid long names as they ruin the spacing
        if (fas[k].iconName
            && fas[k].iconName.length < 12
            && fas[k].iconName.startsWith(this.search)
        )
          list.push([ 'fas', fas[k].iconName ]);
      }

      return list;
    },
  },
}
</script>

<style lang="scss">
.icon-picker {
  .toggler {
    border: solid 1px #ccc;
    border-radius: 6px;
    cursor: pointer;
    padding: 0.25em;
    text-align: center;
  }

  .icon-list {
    display: flex;
    flex-flow: row wrap;
    max-height: 18rem;
    margin: 1.5em 0;
    overflow-y: scroll;

    .icon-container {
      cursor: pointer;
      border: 1px solid var(--border-color-light, #ccc);
      border-radius: 6px;
      display: flex;
      flex-flow: column nowrap;
      min-width: 3em;
      margin: 0.25em;
      padding: 0.25em;
      align-items: center;
      justify-content: center;

      .icon { margin: 0 auto; }
    }
  }
}
</style>
