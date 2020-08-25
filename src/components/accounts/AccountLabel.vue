<template>
  <span class="account-label" :style="accountStyle" v-if="innerAccount">
    {{ accountName }}
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    account: { type: Object, required: false, default: null },
    accountKey: { type: String, required: false, default: null }
  },
  data() {
    return {
      // local copy of account so we can have an `account` prop
      innerAccount: null,
    }
  },

  computed: {
    ... mapState('accounts', [ 'cache' ]),

    accountName() {
      return (this.innerAccount != null)
        ? this.innerAccount.name
        : this.accountKey;
    },

    accountStyle() {
      const color = this.innerAccount ? this.innerAccount.color : 'transparent'
      const styles = {
        'padding-left': '3px',
        'border-left': `4px solid ${color}`
      }
      let str = ''

      for (const k in styles) {
        str += `${k}: ${styles[k]};`
      }

      return str
    },
  },

  mounted() {
    if (this.account) {
      this.innerAccount = this.account
    } else if (this.accountKey) {
      this.innerAccount = this.cache[this.accountKey]
    }
  },
}
</script>
