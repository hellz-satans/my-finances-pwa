<template>
	<div>
		<h3>Total ${{ totalExpenses }}</h3>
		<expense-filters></expense-filters>

		<table class="ui table">
			<thead>
				<tr>
					<th scope="col">Grand total</th>
					<th scope="col">Price</th>
					<th scope="col">Qty</th>
					<th scope="col">Description</th>
					<th scope="col">Tags</th>
					<th scope="col">Date &darr;</th>
					<th scope="col">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="e in expenses" :key="e.id">
					<td><b>{{ e.qty * e.price | currency }}</b></td>
					<td>{{ e.price | currency}}</td>
					<td>{{ e.qty }}</td>
					<td>{{ e.description }}</td>
					<td>{{ e.tags.join(', ') }}</td>
					<td>{{ e.date | format }}</td>
					<td>
						<sui-button size="mini" animated="vertical">
							<sui-button-content visible>
								<sui-icon name="trash" />
							</sui-button-content>
							<sui-button-content @click="deleteExpense(e.id)" hidden>Delete</sui-button-content>
						</sui-button>

						<sui-button size="mini" animated="vertical">
							<sui-button-content visible>
								<sui-icon name="pencil" />
							</sui-button-content>
							<sui-button-content @click="editExpense(e.id)" hidden>Edit</sui-button-content>
						</sui-button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex';
	import ExpenseFilters from './ExpenseFilters.vue';

	export default {
		name: 'ExpenseList',
		components: {
			ExpenseFilters,
		},
		methods: {
			... mapActions('expenses', [ 'editExpense', 'deleteExpense' ])
		},
		computed: {
			... mapState('expenses', [ 'expenses' ]),
			... mapGetters('expenses', [ 'totalExpenses' ])
		}
	}
</script>
