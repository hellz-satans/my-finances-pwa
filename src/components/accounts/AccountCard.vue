<template>
  <article class="account-card card-item" :style="accountStyle">
    <header class="card-item__header">
      <span class="card-item__name">{{ account.name }}</span>
      <span class="card-item__actions">
        <sui-icon class="right floated"
          size="small"
          name="trash"
          @click="deleteAccountProxy(account)"
        />
        <router-link
          :to="'/account/' + account.key"
        >
          <sui-icon class="right floated"
            size="small"
            name="pencil"
          />
        </router-link>
      </span>
    </header>

    <section class="card-item__body">
      <h3 class="balance">{{ account.balance | currency }}</h3>
    </section>

    <footer class="card-item__footer text-smaller text-right">
      <span class="pointer" @click="toggleIncludeAccount(account.id)">
        <sui-icon
          class="right floated"
          size="small"
          :name="(account.includeInSummary ? 'check' : '') + ' square outline'"
        />
        Include in summary?
      </span>
    </footer>
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
    ... mapActions('accounts', [
      'editAccount',
      'deleteAccount',
      'toggleIncludeAccount',
    ]),

    deleteAccountProxy(account) {
      if (window.confirm('Are you sure?')) {
        this.deleteAccount(account)
      }
    },
  },
}
</script>

<style lang="scss">
.account-card {
  font-size: 18px;
  line-height: 22px;

  .card-item {
    &__name {
      font-size: 1.1em;
      font-weight: 600;
    }
  }

  .balance {
    font-size: 1.25em;
    text-align: center;
    margin-top: 0.5em;
    margin-bottom: 0;
  }
}
</style>
