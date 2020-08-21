<template>
  <section class="account-list">
    <account-card
      v-for="acc in accounts"
      :key="acc.key"
      :account="acc"
    />

    <div class="account-link">
      <router-link to="/account/new">
        <sui-icon name="plus" />
        Add account
      </router-link>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AccountCard from '@/components/accounts/AccountCard.vue'

export default {
	components: {
    AccountCard,
	},
	methods: {
		... mapActions('accounts', [ 'editAccount', 'deleteAccount' ]),
	},
	computed: {
		... mapState('accounts', [ 'accounts' ]),
	}
}
</script>

<style lang="scss">
.account-list {
  display: flex;
  flex-flow: row nowrap;
  overflow-x: scroll;
  max-height: 9rem;
  min-width: 100%;

  .account-card {
    flex: 1 0;
    min-width: 250px;
    margin: 0.5em;
  }

  .account-link {
    margin: auto 1em;
    min-width: 8em;
  }
}

@media (min-width: 500px) {
  .account-list {
    .account-card {
      min-width: 180px;
      margin: 0.5rem;
    }
  }
}
</style>
