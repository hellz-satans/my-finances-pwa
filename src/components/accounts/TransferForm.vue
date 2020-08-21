<template>
  <sui-form
    name="transfer"
    @submit.stop.prevent="doTransfer"
    class="transfer-form"
  >
    <h2>Transfer</h2>

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

    <footer class="actions text-right">
      <sui-button
        positive
        type="submit"
      >Submit</sui-button>
    </footer>
	</sui-form>
</template>

<script>
import { mapActions } from 'vuex'
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
    }),

    doTransfer() {
      this.transfer({
        amount: Math.abs(this.amount),
        from: this.from,
        to: this.to,
      })
      .then((success) => {
        this.$router.push('/');
      });
    },
  },
}
</script>

<style lang="scss">
.transfer-form {
  .sign {
    display: none;
  }
}
</style>
