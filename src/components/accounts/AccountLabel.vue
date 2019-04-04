<template>
  <span class="account-label" :style="accountStyle(account)">
    {{ account.name }}
  </span>
</template>

<script>
import { accountStyle } from '@/services/accounts'

export default {
  props: {
    account: { required: true, type: Object },
  },
  methods: {
    accountStyle,
  },
}
</script>
