<template>
  <sui-form
    @submit.prevent.stop="submitForm"
    class="preference-form"
    name="preference"
    method="POST"
  >
    <sui-form-field v-if="loaded">
      <label for="preferenceKey">{{ key }}</label>
      <sui-input
        id="preferenceKey"
        name="preferenceKey"
        required
        v-model="value"
      />
    </sui-form-field>

    <footer class="actions text-right">
      <sui-button type="submit" positive>Save</sui-button>
    </footer>
  </sui-form>
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
