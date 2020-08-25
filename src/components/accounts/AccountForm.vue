<template>
  <form
    name="account"
    class="account-form px-2 py-4"
    @submit.stop.prevent="submitAccount"
  >
    <div class="w-full mb-4">
      <label class="block font-semibold mb-3" for="account_name">Name</label>
      <input
        class="block appearance-none w-full bg-gray-100 border border-gray-500 p-2 rounded focus:outline-none focus:bg-white focus:border-gray-600"
        id="account_name"
        name="account_name"
        v-model="name"
        placeholder="Name"
        minlength="1"
        pattern=".+"
        required
      />
    </div>

    <div v-if="loaded" class="w-full mb-4">
      <label class="block font-semibold mb-3" for="account_balance">Balance</label>
      <money-input
        id="account_balance"
        name="account_balance"
        v-model.lazy="balance"
        placeholder="Balance"
        required
        :value="balance"
      ></money-input>
    </div>

    <div class="w-full">
      <label class="block font-semibold" for="account_color">Color</label>
      <div class="mt-2">
        <v-swatches v-model="color" inline :swatches="colorList" />
      </div>
    </div>

    <footer class="actions text-right">
      <button
        type="submit"
      >Save</button>
    </footer>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MoneyInput from '@/components/MoneyInput'
import VSwatches from 'vue-swatches'
import COLORS    from '@/config/colors';

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

    colorList() { return COLORS; },
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
