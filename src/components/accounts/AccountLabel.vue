<template>
  <span class="account-label" :style="accountStyle">
    {{ innerAccount.name }}
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    account: { type: Object, required: false, default: null },
    accountId: { type: Number, required: false, default: null }
  },
  data() {
    return {
      // local copy of account so we can have an `account` prop
      innerAccount: {},
    }
  },
  computed: {
    ... mapState('accounts', [ 'accounts' ]),
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
    } else if (this.accountId) {
      this.innerAccount = this.accounts.find(acc => acc.id === this.accountId)
    }
  },
}
</script>
