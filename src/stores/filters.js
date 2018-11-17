export default {
  /**
   * Filter the expense with the given filters criteria
   *
   * @param expense Object
   * @param filters [{ field: String, op: ['<','<=','>','>=','==','==='], value: var }]
   */
  filterExpenses(expense, filters) {
    let f = null, // current filter
      allow = true;

    for (const i in filters) {
      f = filters[i];

      switch (f.op) {
        case '<':
          allow = exp[f.field] < f.value;
          break;
        case '<=':
          allow = exp[f.field] <= f.value;
          break;
        case '>':
          allow = exp[f.field] > f.value;
          break;
        case '>=':
          allow = exp[f.field] >= f.value;
          break;
        case '==':
          allow = exp[f.field] == f.value;
          break;
        case '===':
          allow = exp[f.field] === f.value;
          break;
        default:
          allow = true;
      }

      // if a single restriction fails, reject
      if (!allow)
        return false;
    }

    return allow;
  },
}
