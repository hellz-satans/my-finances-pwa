<template>
	<sui-form name="account" method="POST" @submit.prevent="submitAccount">
		<sui-form-field>
			<label for="account_name">Account Name</label>
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

		<sui-button type="button"  @click.prevent.stop="unsetCurrentAccount" v-if="action === 'Update'">Cancel</sui-button>
		<sui-button type="submit">{{ action }}</sui-button>
	</sui-form>
</template>

<script>
	import { mapMutations, mapState } from 'vuex';

	export default {
		methods: {
			... mapMutations('accounts', [ 'unsetCurrentAccount' ]),
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
			... mapState('accounts', [ 'currentAccount' ]),
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
			}
		}
	}
</script>
