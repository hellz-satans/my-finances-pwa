<template>
  <span class="account-label" :style="accountStyle">
    {{ account.name }}
  </span>
</template>

<script>
export default {
  props: {
    account: { required: true, type: Object },
  },
  computed: {
    accountStyle() {
      const styles = {
        'padding-left': '3px',
        'border-left': `4px solid ${this.account.color}`
      }
      let str = ''

      for (const k in styles) {
        str += `${k}: ${styles[k]};`
      }

      return str
    },
  },
}
</script>
