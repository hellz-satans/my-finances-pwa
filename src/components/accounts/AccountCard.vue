<template>
  <article class="account-card" :style="accountStyle">
    <header class="account-card--header">
      <span class="account-card__name">{{ account.name }}</span>
      <span class="account-card__actions">
        <sui-icon class="right floated"
          size="small"
          name="trash"
          @click="deleteAccountProxy(account.id)"
        />
        <sui-icon class="right floated"
          size="small"
          name="pencil"
          @click="editAccount(account.id)"
        />
      </span>
    </header>

    <h3 class="account-card__balance">{{ account.balance | currency }}</h3>
  </article>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
    account: { required: true, type: Object },
  },
  computed: {
    accountStyle() {
      const backgroundColor = this.account ? this.account.color : 'transparent'
      const color = this.account ? '#eee' : 'inherit'
      const styles = {
        'background-color': backgroundColor,
        'color': color,
      }
      let str = ''

      for (const k in styles) {
        str += `${k}: ${styles[k]};`
      }

      return str
    },
  },
  methods: {
    ... mapActions('accounts', [ 'editAccount', 'deleteAccount' ]),

    deleteAccountProxy(id) {
      if (window.confirm('Are you sure?')) {
        this.deleteAccount(id)
      }
    },
  },
}
</script>

<style lang="scss">
.account-card {
  font-size: 18px;
  line-height: 22px;
  padding: 0.5em 1em;
  margin: 0.4em 0;
  border-radius: 6px;

  &--header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  &__name {
    font-weight: 600;
    font-size: 1.1em; // em, not rem
  }

  &__actions {
    .icon:not(:last-child) {
      margin-right: 0.75em;
    }
  }

  &__balance {
    font-size: 1.25em;
    text-align: center;
    margin-top: 0.5em;
  }
}
</style>
