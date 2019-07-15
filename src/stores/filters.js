import moment from 'moment'

/**
 * Filter the expense with the given filters criteria
 *
 * @param expense Object
 * @param filters [{ field: String, op: ['<','<=','>','>=','==','==='], value: var }]
 */
const filterExpenses = (expense, filters) => {
  let f = null, // current filter
    allow = true

  for (const i in filters) {
    f = filters[i]

    switch (f.op) {
      case '<':
        allow = expense[f.field] < f.value
        break
      case '<=':
        allow = expense[f.field] <= f.value
        break
      case '>':
        allow = expense[f.field] > f.value
        break
      case '>=':
        allow = expense[f.field] >= f.value
        break
      case '==':
        allow = expense[f.field] == f.value
        break
      case '===':
        allow = expense[f.field] === f.value
        break
      default:
        allow = true
    }

    // if a single restriction fails, reject
    if (!allow)
      return false
  }

  return allow
}

/**
 * Calculate total expenses in the specified range.
 *
 * @param n Number
 * @param unit String Any moment.js compatible unit
 * @return Promise
 */
const expensesInRange = (expenses, n = 1, unit = 'week', options = {}) => {
	const endDate = moment().endOf('day')
	const startDate = moment().subtract(n, unit).startOf('day')
	const list = []
  // expenses sorted in decreasing order?
  options.decreasing = options.decreasing || true

	for (const exp of expenses) {
		if (moment(exp.date).isBetween(startDate, endDate)) {
			list.push(exp)
		} else if (options.decreasing) {
      break
    }
	}

  if (list.length === 0) {
    return 0
  }

	return list
		.map(expense => expense.price)
		.reduce((total, curr) => total + curr)
}

/**
 * Calculate total expenses in the specified expenses list.
 *
 * @param expenses Array of expense objects
 * @return Number
 */
const expensesSum = (expenses) => {
  if (expenses.length === 0) {
    return 0
  }

  return expenses
    .map(expense => expense.price)
    .reduce((total, curr) => total + curr)
}

/**
 * Summarize data by a given field.
 *
 * Suppose you have an array of data like this:
 *
 * 	[
 * 		{ date: '2018-01-01', price: 100 },
 * 		{ date: '2018-02-02', price: 100 },
 * 		{ date: '2018-01-01', price: 150 }
 * 	]
 *
 * 	This function returns as summarized array like this:
 *
 * 	[
 * 		{ date: '2018-01-01', price: 250 },
 * 		{ date: '2018-02-02', price: 100 },
 * 	]
 *
 * @param  data [Object]
 * @param  key String
 * @return [Object]
 */
const mergeData = (data, pivot, summarizable) => {
  const result = [],
    dict = {};
  let tmpObj = null;

  // summarize total by pivot (date)
  data.forEach((el, i, arr) => {
    if (!dict[el[pivot]]) {
      dict[el[pivot]] = 0;
    }
    dict[el[pivot]] += el[summarizable];
  });

  // push day entry
  for (const key in dict) {
    tmpObj = {};
    tmpObj[pivot] = key;
    tmpObj[summarizable] = dict[key];
    result.push(tmpObj)
  }

  return result;
}

export {
	expensesInRange,
	expensesSum,
	filterExpenses,
  mergeData,
}
