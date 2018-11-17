<template>
    <article class="expense-list">
    <h3>Total ${{ totalExpenses }}</h3>
    <expense-filters></expense-filters>
    <table>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Grand total</th>
          <th scope="col">Price</th>
          <th scope="col">Qty</th>
          <th scope="col">Description</th>
          <th scope="col">Tags</th>
          <th scope="col">Date &darr;</th>
          <th scope="col" colspan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(e, i) in expenses">
          <th scope="row">{{ i+1 }}</th>
          <td><b>${{ e.qty * e.price }}</b></td>
          <td>${{ e.price }}</td>
          <td>{{ e.qty }}</td>
          <td>{{ e.description }}</td>
          <td class="smaller">{{ e.tags.join(', ') }}</td>
          <td class="smaller">
            {{ e.date.getUTCMonth() + 1 }}/{{ e.date.getUTCDate() }}/{{ e.date.getUTCFullYear() }}
          </td>
          <td>
            <button @click="editExpense(e.id)">
              Edit &#9998;
            </button>
          </td>
          <td>
            <button class="white bg-red" @click="deleteExpense(e.id)">
              Delete &#128465;
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script>
  export default {
    methods: {
      ... Vuex.mapActions([ 'editExpense', 'deleteExpense' ]),
    },
    computed: {
      ... Vuex.mapState([ 'expenses' ]),
      ... Vuex.mapGetters([ 'totalExpenses' ]),
    }
  }
</script>
