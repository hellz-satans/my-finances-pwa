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
			margin-bottom: 1rem;

			legend {
				font-weight: 600;
				padding: 0 0.50rem;
			}
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
				<sui-input
					id="start_date"
					name="start_date"
					placeholder="From"
					type="date"
					v-model="startDate"
				/>
			</label>

			<label class="form-field">
				Until
				<sui-input
					id="end_date"
					name="end_date"
					placeholder="Until"
					type="date"
					v-model="endDate"
				/>
			</label>

			<fieldset>
				<legend>Price</legend>
				<label class="form-field">
					<span hidden>Comparator</span>
					<sui-dropdown
						placeholder="Comparator"
						selection
						:options="comparatorOptions"
						v-model="comparator"
					/>
				</label>

				<label class="form-field">
					<span hidden>Unit price</span>
					<sui-input
						id="grand_total"
						name="grand_total"
						placeholder="Unit price"
						type="number"
						step="any"
						v-model="price"
					/>
				</label>
			</fieldset>

			<sui-button
				type="reset"
				content="Reset"
				icon="x"
				label-position="right"
				@click="resetFilters"
			/>

			<sui-button
				type="submit"
				content="Filter"
				icon="filter"
				label-position="right"
			/>
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
				price: 0,
				comparatorOptions: [
					{ text: 'Up to', value: '<=' },
					{ text: 'At least', value: '>=' },
				]
			};
		},
		methods: {
			filter() {
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
