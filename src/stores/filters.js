import db from '@/db';

/**
 * Filter the expense with the given filters criteria
 *
 * @param expense Object
 * @param filters [{ field: String, op: ['<','<=','>','>=','==','==='], value: var }]
 */
const filterExpenses = (expense, filters) => {
  let f = null, // current filter
    allow = true;

  for (const i in filters) {
    f = filters[i];

    switch (f.op) {
      case '<':
        allow = expense[f.field] < f.value;
        break;
      case '<=':
        allow = expense[f.field] <= f.value;
        break;
      case '>':
        allow = expense[f.field] > f.value;
        break;
      case '>=':
        allow = expense[f.field] >= f.value;
        break;
      case '==':
        allow = expense[f.field] == f.value;
        break;
      case '===':
        allow = expense[f.field] === f.value;
        break;
      default:
        allow = true;
    }

    // if a single restriction fails, reject
    if (!allow)
      return false;
  }

  return allow;
}

/**
 * Calculate total expenses in the specified range.
 *
 * @param n Number
 * @param unit String Any moment.js compatible unit
 * @return Promise
 */
const expensesInRange = (n = 1, unit = 'week') => {
	const endDate = moment()
	const startDate = moment().subtract(n, unit)

	return db.expenses
		.toArray()
		.then((arr) => {
			const list = []

			for (let exp of arr) {
				if (moment(exp.date).isBetween(startDate, endDate)) {
					list.push(exp)
				}
			}

			return list
		})
		.then((expenses) => {
			if (expenses.length < 1) {
				return 0
			}

			return expenses
				.map(expense => expense.price * expense.qty)
				.reduce((total, curr) => total + curr);
		})
}

export {
	expensesInRange,
	filterExpenses,
}
