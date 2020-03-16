<style lang="scss">
.transfer-form {
  &-button {
    position: fixed;
    bottom: 5rem;
    right: 1rem;
    z-index: 999;
  }
}
</style>

<template>
	<article class="transfer-form">
		<sui-button
      class="transfer-form-button"
      @click.native="toggleModal"
      circular
      color="blue"
      icon="exchange"
    />

		<sui-modal v-model="transferModal" size="tiny">
			<sui-modal-header>Transfer</sui-modal-header>

			<sui-modal-content scrolling>
        <sui-form name="transfer" @submit.stop.prevent="doTransfer">
          <sui-form-field>
            <label for="price">Amount</label>
            <money-input
              name="amount"
              v-model.lazy="amount"
              :value="amount"
            ></money-input>
          </sui-form-field>

          <sui-form-field>
            <label for="from">From</label>
            <accounts-options
              :account="from"
              :exclude="[ to ]"
              @input="from = $event"
            />
          </sui-form-field>

          <sui-form-field>
            <label for="to">To</label>
            <accounts-options
              :account="to"
              :exclude="[ from ]"
              @input="to = $event"
            />
          </sui-form-field>
        </sui-form>
			</sui-modal-content>

			<sui-modal-actions>
				<sui-button @click="toggleModal" type="button">
          Close
        </sui-button>
				<sui-button
          positive
          type="submit"
          @click="doTransfer"
        >Submit</sui-button>
			</sui-modal-actions>

		</sui-modal>
	</article>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AccountsOptions from '@/components/accounts/AccountsOptions'
import MoneyInput from '@/components/MoneyInput'

export default {
  components: {
    AccountsOptions,
    MoneyInput,
  },

  data() {
    return {
      amount: 0,
      from: null,
      to: null,
    }
  },

  methods: {
    ... mapActions({
      transfer: 'accounts/transfer',
      toggleModal: 'accounts/toggleTransferModal',
    }),

    doTransfer() {
      this.transfer({
        amount: this.amount,
        from: this.from,
        to: this.to,
      })
    },
  },

  computed: {
    ... mapState({
      transferModal: state => state.accounts.transferModal,
    }),
  }
}
</script>
