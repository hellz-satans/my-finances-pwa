<template>
  <form
    @submit.prevent.stop="submitForm"
    class="preference-form rounded shadow-md p-5"
    name="preference"
    method="POST"
  >
    <div class="mb-4" v-if="loaded">
      <label
        for="preferenceKey"
        class="block font-bold mb-2"
      >
        {{ key }}
      </label>
      <input
        id="preferenceKey"
        name="preferenceKey"
        class="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
        v-model="value"
      />
    </div>

    <footer class="actions text-right">
      <button
        type="submit"
        class="btn-submit"
      >Save</button>
    </footer>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PreferenceForm',

  data() {
    return {
      key:    null,
      value:  null,
      loaded: false,
    };
  },

  methods: {
    ... mapActions('preferences', [ 'submitPreference', ]),

    submitForm() {
      this.submitPreference({ key: this.key, value: this.value })
        .then((n) => {
          // if we hit save but not change the value (update action), n = 0
          if (n >= 0) {
            this.$router.push('/');
          }
        });
    },
  },

  computed: {
    ... mapState('preferences', [ 'preferences', ]),
  },

  mounted() {
    // give the browser time to load preferences
    window.setTimeout((ev) => {
      this.key = this.$route.params.key;

      if (this.preferences[this.key]) {
        this.value = this.preferences[this.key];
      }

      this.loaded = true;
    }, 600);
  },
}
</script>

<style lang="scss">
.preference-form {
  label { text-transform: capitalize !important; }
}
</style>
