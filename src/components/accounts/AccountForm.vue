<template>
	<div>
		<sui-button @click.native="toggleModal(true)">Add account</sui-button>

		<sui-modal v-model="accountModal" size="tiny">
			<sui-modal-header>Add account</sui-modal-header>
			<sui-modal-content>
				<sui-form name="account" method="POST">
					<sui-form-field>
						<label for="account_name">Name</label>
						<sui-input
							id="account_name"
							name="account_name"
							v-model="name"
							placeholder="Name"
							minlength="1"
							pattern="[\w\+\-=]+(\s+[\w\+\-=]+)*"
							required
						/>
					</sui-form-field>

					<sui-form-field>
						<label for="account_balance">Balance</label>
						<sui-input
							id="account_balance"
							name="account_balance"
							v-model="balance"
							placeholder="Balance"
							type="number"
							step="any"
							required
						/>
					</sui-form-field>

					<sui-form-field>
						<label for="account_color">Color</label>
						<swatches v-model="color" inline />
					</sui-form-field>
				</sui-form>
			</sui-modal-content>
			<sui-modal-actions>
				<sui-button @click="toggleModal">Close</sui-button>
				<sui-button positive @click="submitAccount">Save</sui-button>
			</sui-modal-actions>
		</sui-modal>
	</div>
	
</template>

<script>
	import { mapMutations, mapActions, mapState } from 'vuex';
	import Swatches from 'vue-swatches'

	export default {
		components: {
			Swatches,
		},
		methods: {
			... mapMutations('accounts', [ 'unsetCurrentAccount' ]),
			... mapActions('accounts', [ 'toggleModal' ]),
			submitAccount() {
				if (document.forms.account.checkValidity()) {
					this.$store.dispatch('accounts/submitAccount', this.currentAccount)
						.catch((err) => {
							console.error('submitAccount:', err, err.stack);
						});
				} else {
					document.forms.account.reportValidity();
					console.error('submitAccount: invalid data');
				}
			}
		},
		computed: {
			... mapState('accounts', [ 'currentAccount', 'openModal' ]),
			action() {
				return this.currentAccount.id ? 'Update' : 'Add';
			},
			name: {
				get() { return this.$store.state.accounts.currentAccount.name; },
				set(value) {
					return this.$store.commit('accounts/updateCurrentAccountName', value);
				},
			},
			balance: {
				get() { return this.$store.state.accounts.currentAccount.balance; },
				set(value) {
					return this.$store.commit('accounts/updateCurrentAccountBalance', value);
				},
			},
			color: {
				get() { return this.$store.state.accounts.currentAccount.color; },
				set(value) {
					return this.$store.commit('accounts/updateCurrentAccountColor', value);
				},
			},

			accountModal: {
				get() { return this.$store.state.accounts.openModal; },
				set(value) { return this.$store.commit('accounts/toggleModal'); },
			},
		}
	}
</script>