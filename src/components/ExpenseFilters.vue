<style lang="scss">
	.expense-filter {
		.expense-filter-title {
			display: none;
		}

		.expense-filter input[type=number] {
			width: 5rem;
		}

		.expense-filter-form {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-evenly;
			align-items: center;
			align-content: space-around;
		}
	}
</style>

<template>
	<nav class="expense-filter">
		<h3 class="expense-filter-title">Filters</h3>
		<form
			name="filters"
			method="GET"
			@submit.prevent="filter"
			class="expense-filter-form"
		>
			<label class="form-field">
				From
				<input type="date" name="start_date" v-model="startDate">
			</label>
			<label class="form-field">
				Until
				<input type="date" name="end_date" v-model="endDate">
			</label>

			<fieldset>
				<legend>Price</legend>
				<label class="form-field">
					<span hidden>Comparator</span>
					<select name="price_comparator" v-model="comparator">
						<option value="<=">Up to</option>
						<option value=">=">At least</option>
					</select>
				</label>
				<label class="form-field">
					<span hidden>Unit price</span>
					<input type="number" name="grand_total" step="any" v-model="price">
				</label>
			</fieldset>

			<button type="reset" class="form-reset" @click="resetFilters">
				Reset
			</button>
			<button type="submit" class="form-submit">
				Apply
			</button>
		</form>
	</nav>
</template>

<script>
	export default {
		name: 'ExpenseFilters',
		data() {
			return {
				startDate: null,
				endDate: null,
				comparator: '>=',
				price: 0
			};
		},

		methods: {
			filter() {
				console.info('filtering: from',
					this.startDate,
					'until',
					this.endDate,
					'. Price',
					this.comparator,
					this.price
				);

				this.$store.dispatch('expenses/filterExpenses', {
					startDate: this.startDate,
					endDate: this.endDate,
					comparator: this.comparator,
					price: this.price,
				});
			},
			resetFilters() {
				this.startDate = this.endDate = null;
				this.comparator = '>=';
				this.price = 0;
				this.$store.dispatch('expenses/filterExpenses', {});
			}
		}
	}
</script>
