<template>
  <article class="account-list">
		<sui-grid v-if="accounts.length" stackable>
			<sui-grid-row>
				<sui-grid-column
          v-for="acc in accounts"
          :key="acc.id"
          :mobile="5"
          :tablet="4"
          :computer="3"
          stretched
        >
          <account-card :account="acc" />
				</sui-grid-column>
				<sui-grid-column :mobile="5" :tablet="4" :computer="3" stretched>
					<account-form></account-form>
				</sui-grid-column>
			</sui-grid-row>
		</sui-grid>

		<sui-container v-if="!accounts.length" text-align="center">
			<h2>Ups! There are no accounts.</h2>
			<account-form></account-form>
		</sui-container>
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
