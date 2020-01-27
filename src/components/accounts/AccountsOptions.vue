<style lang="scss">
  .accounts-options {
    margin: 0.5rem 0 0.85rem;
    text-align: center;
  }
</style>

<template>
  <div class="accounts-options">
    <sui-button
      size="tiny"
      type="button"
      v-for="acc in filteredAccounts"
      :key="acc.id"
      @click="$emit('input', acc.key)"
      :style="accountButtonStyles(acc)"
    >
      {{ acc.name }}
    </sui-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AccountsOptions',

  props: {
    account: { type: String, required: false, default: null },
    exclude: { type: Array, required: false, default: () => [], },
  },

  methods: {
    accountButtonStyles(acc) {
      const styles = {
        'background-color': acc.color,
        'color': 'white'
      }

      if (this.account === acc.key) {
        styles['transform'] = 'scale(1.1)'
        styles['margin-left'] = styles['margin-right'] = '0.75rem'
        styles['box-shadow'] = `0 0 0.5rem ${acc.color}`
      }

      return styles
    },
  },

  computed: {
    ... mapState('accounts', [ 'accounts', ]),

    filteredAccounts() {
      return this.accounts.filter(el => this.exclude.indexOf(el.key) === -1)
    }
  },
}
</script>
