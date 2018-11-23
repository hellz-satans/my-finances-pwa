<template>
    <article class="account-list">
		<sui-grid v-if="accounts.length" stackable>
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
	import { mapActions, mapGetters, mapState } from 'vuex';
	import AccountForm from '../components/AccountForm.vue';

	export default {
		components: {
			AccountForm,
		},
		methods: {
			... mapActions('accounts', [ 'editAccount', 'deleteAccount' ])
		},
		computed: {
			... mapState('accounts', [ 'accounts' ]),
		}
	}
</script>
