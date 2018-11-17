<template>
    <form
		name="expense"
		method="POST"
		@submit.prevent="submitExpense"
		class="expense-form"
	>
		<fieldset class="flex">
			<legend>{{ action }} expense</legend>

			<label class="form-field">
				Description:
				<input
					name="description"
					minlength="1"
					pattern="[\\w\\+\\-=]+(\\s+[\\w\\+\\-=]+)*"
					required
					v-model="description"
				>
			</label>

			<label class="form-field">
				Price:
				<input
					type="number"
					name="price"
					min="0"
					step="any"
					required
					v-model="price"
				>
			</label>

			<label class="form-field">
				Quantity:
				<input
					type="number"
					name="qty"
					min="0.01"
					step="any"
					required
					v-model="qty"
				>
			</label>

			<label class="form-field">
				Tags:
				<select
					multiple
					name="tags"
					required
					size="3"
					v-model="tags"
				>
					<option v-for="c in categories">{{ c }}</option>
				</select>
			</label>

			<label class="form-field">
				Date:
				<input
					type="date"
					name="date"
					required
					v-model="date"
				>
			</label>

			<button
				type="button"
				@click.prevent.stop="unsetCurrentExpense"
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
	import { mapMutations, mapState } from 'vuex';

	export default {
		methods: {
			... mapMutations('expenses', [ 'unsetCurrentExpense' ]),

			submitExpense() {
				if (document.forms.expense.checkValidity()) {
					this.$store.dispatch('submitExpense', this.currentExpense)
						.catch((err) => {
							console.error('submitExpense:', err, err.stack);
						});
				} else {
					document.forms.expense.reportValidity();
					console.error('submitExpense: invalid data');
				}
			}
		},
		computed: {
			... mapState([ 'categories' ]),
			... mapState('expenses', [ 'currentExpense' ]),

			action() {
				return this.currentExpense.id ? 'Update' : 'Add';
			},
			description: {
				get() { return this.$store.state.currentExpense.description; },
				set(value) {
					return this.$store.commit('updateCurrentExpenseDescription', value);
				},
			},
			price: {
				get() { return this.$store.state.currentExpense.price; },
				set(value) {
					return this.$store.commit('updateCurrentExpensePrice', value);
				},
			},
			qty: {
				get() { return this.$store.state.currentExpense.qty; },
				set(value) {
					return this.$store.commit('updateCurrentExpenseQty', value);
				},
			},
			tags: {
				get() { return this.$store.state.currentExpense.tags; },
				set(value) {
					return this.$store.commit('updateCurrentExpenseTags', value);
				},
			},
			date: {
				get() { return this.$store.state.currentExpense.date; },
				set(value) {
					return this.$store.commit('updateCurrentExpenseDate', value);
				},
			},
		}
	}
</script>
