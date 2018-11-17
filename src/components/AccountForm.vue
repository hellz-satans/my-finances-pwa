<template>
    <form
		name="account"
		method="POST"
		@submit.prevent="submitAccount"
		class="account-form"
	>
		<fieldset class="flex">
			<legend>{{ action }} account</legend>

			<label class="form-field">
				Name:
				<input
					name="account_name"
					id="account_name"
					minlength="1"
					pattern="[\\w\\+\\-=]+(\\s+[\\w\\+\\-=]+)*"
					required
					v-model="name"
				>
			</label>

			<label class="form-field">
				Balance:
				<input
					type="number"
					name="account_balance"
					id="account_balance"
					step="any"
					required
					v-model="balance"
				>
			</label>

			<button
				type="button"
				@click.prevent.stop="unsetCurrentAccount"
				v-if="action === 'Update'"
				class="white bg-danger form-reset"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="form-submit"
			>
				{{ action }}
			</button>
		</fieldset>
	</form>
</template>

<script>
    export default {
        methods: {
            ... Vuex.mapMutations([ 'unsetCurrentAccount' ]),
            submitAccount() {
                if (document.forms.account.checkValidity()) {
                    const data = {
                        name: this.name,
                        balance: this.balance
                    };
                    this.$store.dispatch('submitAccount', this.currentAccount)
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
            ... Vuex.mapState([ 'currentAccount' ]),
            action() {
                return this.currentAccount.id ? 'Update' : 'Add';
            },
            name: {
                get() { return this.$store.state.currentAccount.name; },
                set(value) {
                    return this.$store.commit('updateCurrentAccountName', value);
                },
            },
            balance: {
                get() { return this.$store.state.currentAccount.balance; },
                set(value) {
                    return this.$store.commit('updateCurrentAccountBalance', value);
                },
            }
        }
    }
</script>
