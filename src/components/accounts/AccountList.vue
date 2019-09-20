<template>
  <article class="account-list">
    <account-card
      v-for="acc in accounts"
      :key="acc.id"
      :account="acc"
    />

    <account-form />
	</article>
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
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-content: space-around;

  .account-card {
    flex: 1 0;
  }

  .account-form {
    flex: 0 1;
    padding: 1rem 0;
    align-self: center;
  }
}

@media (min-width: 500px) {
  .account-list {
    flex-flow: row wrap;

    .account-card {
      min-width: 180px;
      margin: 0.5rem;
    }
  }
}
</style>
