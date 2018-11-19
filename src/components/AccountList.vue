<template>
    <article class="account-list">
		<h3>Total balance: ${{ totalBalance }}</h3>

		<sui-grid stackable>
			<sui-grid-row>
				<sui-grid-column v-for="acc in accounts" :key="acc.id" :mobile="5" :tablet="4" :computer="3" stretched>
					<sui-card>
						<sui-card-content>
							<sui-card-header>
								{{ acc.name }}
								<sui-icon class="right floated" size="small" name="trash" @click="deleteAccount(acc.id)" />
								<sui-icon class="right floated" size="small" name="pencil" @click="editAccount(acc.id)" />
							</sui-card-header>

							<sui-container text-align="center">
								<h2>{{ acc.balance }}</h2>
							</sui-container>
						</sui-card-content>
					</sui-card>
				</sui-grid-column>

				<sui-grid-column v-if="accounts.length === 0">
					<p>
						Ups! There are no accounts.
						<router-link to="/accounts" is="sui-menu-item">
							Add an account
							<sui-icon class="right floated" size="small" name="plus" />
						</router-link>
					</p>
				</sui-grid-column>
			</sui-grid-row>
		</sui-grid>
	</article>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex';

	export default {
		methods: {
			... mapActions('accounts', [ 'editAccount', 'deleteAccount' ])
		},
		computed: {
			... mapState('accounts', [ 'accounts' ]),
			... mapGetters('accounts', [ 'totalBalance' ])
		}
	}
</script>
