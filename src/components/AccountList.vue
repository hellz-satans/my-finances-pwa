<template>
    <article class="account-list">
    <h3>Total balance: ${{ totalBalance }}</h3>
    <ul>
      <li v-for="acc in accounts">
        <b>{{ acc.name }}</b>: {{ acc.balance }}
        <button @click="editAccount(acc.id)">
          Edit &#9998;
        </button>
        <button class="white bg-red" @click="deleteAccount(acc.id)">
          Delete &#128465;
        </button>
      </li>
    </ul>
  </article>
</template>

<script>
  export default {
    methods: {
      ... Vuex.mapActions([ 'editAccount', 'deleteAccount' ]),
    },
    computed: {
      ... Vuex.mapState([ 'accounts' ]),
      ... Vuex.mapGetters([ 'totalBalance' ]),
    }
  }
</script>
