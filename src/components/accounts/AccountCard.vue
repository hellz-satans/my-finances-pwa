<template>
  <article class="account-card card" :style="accountStyle">
    <header class="m-0">
      <span class="card-name">{{ account.name }}</span>

      <span class="card-actions">
        <fa class="right floated text-small mr-1 text-white"
          :icon="[ 'fas', 'trash' ]"
          @click="deleteAccountProxy(account)"
        />

        <router-link
          :to="'/account/' + account.key"
        >
          <fa class="right floated text-small mr-3 text-white"
            :icon="[ 'fas', 'edit' ]"
          />
        </router-link>
      </span>
    </header>

    <section class="m-0 p-0">
      <h3 class="balance">{{ account.balance | currency }}</h3>
    </section>

    <footer class="m-0 text-smaller text-right">
      <span class="pointer" @click="toggleIncludeAccount(account.id)">
        <fa
          class="right floated mt-1 ml-1 text-small"
          :icon="[ 'far', `${(account.includeInSummary ? 'check-' : '')}square` ]"
        />
        Include in balance?
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

  .card {
    &-name {
      font-size: 1.1em;
      font-weight: 500;
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
