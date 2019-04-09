import moment from 'moment'

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
const expensesInRange = (expenses, n = 1, unit = 'week') => {
	const endDate = moment().endOf('day')
	const startDate = moment().subtract(n, unit).startOf('day')
	const list = []

	for (const exp of expenses) {
		if (moment(exp.date).isBetween(startDate, endDate)) {
			list.push(exp)
		}
	}

	if (list.length < 1) {
		return 0
	}

	return list
		.map(expense => expense.price)
		.reduce((total, curr) => total + curr);
}

/**
 * Calculate total expenses in the specified expenses list.
 *
 * @param expenses Array of expense objects
 * @return Number
 */
const expensesSum = (expenses) => {
  if (expenses.length < 1) {
    return 0
  }

  return expenses
    .map(expense => expense.price)
    .reduce((total, curr) => total + curr);
}

export {
	expensesInRange,
	expensesSum,
	filterExpenses,
}
