<template>
  <form
    name="transfer"
    @submit.stop.prevent="doTransfer"
    class="transfer-form my-4 mx-2"
  >
    <h2>Transfer</h2>

    <div class="w-full my-3">
      <label class="block" for="price">Amount</label>
      <money-input
        name="amount"
        v-model.lazy="amount"
        :value="amount"
      ></money-input>
    </div>

    <div class="w-full">
      <label class="block" for="from">From</label>
      <accounts-options
        :account="from"
        :exclude="[ to ]"
        @input="from = $event"
      />
    </div>

    <div class="w-full">
      <label for="to">To</label>
      <accounts-options
        :account="to"
        :exclude="[ from ]"
        @input="to = $event"
      />
    </div>

    <footer class="actions text-right">
      <button
        positive
        type="submit"
      >Submit</button>
    </footer>
	</form>
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
