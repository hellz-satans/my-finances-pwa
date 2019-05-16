<template>
  <sui-card>
    <sui-card-content>
      <sui-card-header>
        <account-label :account="account" />
        <sui-icon class="right
          floated"
          size="small"
          name="trash"
          @click="deleteAccount(account.id)"
        />
        <sui-icon class="right
          floated"
          size="small"
          name="pencil"
          @click="editAccount(account.id)"
        />
      </sui-card-header>

      <sui-container text-align="center">
        <h2>{{ account.balance | currency }}</h2>
      </sui-container>
    </sui-card-content>
  </sui-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import AccountLabel from '@/components/accounts/AccountLabel.vue'

export default {
  props: {
    account: { required: true, type: Object },
  },
  components: {
    AccountLabel,
  },
  methods: {
    ... mapActions('accounts', [ 'editAccount', 'deleteAccount' ]),
  },
}
</script>
