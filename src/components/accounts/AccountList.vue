<template>
  <section class="account-list">
    <account-card
      v-for="acc in accounts"
      :key="acc.id"
      :account="acc"
    />

    <account-form />
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AccountCard from '@/components/accounts/AccountCard.vue'
import AccountForm from '@/components/accounts/AccountForm.vue'

export default {
	components: {
    AccountCard,
		AccountForm,
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
  max-height: 8rem;
  min-width: 100%;

  .account-card {
    flex: 1 0;
    min-width: 250px;
    margin: 0.5em;
  }

  .account-form {
    padding: 1rem 0;
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
