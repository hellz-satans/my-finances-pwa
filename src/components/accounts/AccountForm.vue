<template>
  <sui-form
    name="account"
    class="account-form"
    @submit.stop.prevent="submitAccount"
  >
    <sui-form-field>
      <label for="account_name">Name</label>
      <sui-input
        id="account_name"
        name="account_name"
        v-model="name"
        placeholder="Name"
        minlength="1"
        pattern=".+"
        required
      />
    </sui-form-field>

    <sui-form-field v-if="loaded">
      <label for="account_balance">Balance</label>
      <money-input
        id="account_balance"
        name="account_balance"
        v-model.lazy="balance"
        placeholder="Balance"
        required
        :value="balance"
      ></money-input>
    </sui-form-field>

    <sui-form-field>
      <label for="account_color">Color</label>
      <v-swatches v-model="color" inline />
    </sui-form-field>

    <footer class="actions text-right">
      <sui-button
        type="submit"
        positive
      >Save</sui-button>
    </footer>
  </sui-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MoneyInput from '@/components/MoneyInput'
import VSwatches from 'vue-swatches'

export default {
  components: {
    MoneyInput,
    VSwatches,
  },

  data() {
    return {
      balance: 0,
      color:   '#1fbc9c',
      key:     null,
      loaded:  false,
      name:    null,
    };
  },

  methods: {
    submitAccount() {
      const data = {
        balance: this.balance,
        color:   this.color,
        key:     this.key,
        name:    this.name,
      }

      if (document.forms.account.checkValidity()) {
        this.$store.dispatch('accounts/submitAccount', data)
          .then((success) => {
            if (success) {
              this.$router.push('/')
            } else {
              console.error('something went wrong')
            }
          })
          .catch((err) => {
            console.error('submitAccount:', err, err.stack);
          });
      } else {
        document.forms.account.reportValidity();
        console.error('submitAccount: invalid data');
      }
    },

    loadForm(key) {
      let acc = this.accounts.find(a => a.key == key);

      if (acc) {
        this.balance = acc.balance;
        this.color   = acc.color;
        this.key     = acc.key;
        this.name    = acc.name;
      }
    },
  },
  computed: {
    ... mapState('accounts', [ 'accounts', ]),

    action() {
      return this.key ? 'Update' : 'Add';
    },
  },

  created() {
    let key = this.$route.params.account_key

    if (key && key != 'new') {
      this.loadForm(key)
    }

    this.loaded = true;
  },
}
</script>
