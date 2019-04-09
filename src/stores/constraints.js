const expense = {
  price: {
    presence: true,
    numericality: {
      greaterThan: 0,
    },
  },
  date: {
    presence: true,
  },
  category: {
    presence: true,
    length: {
      minimum: 1,
    },
  },
  subcategory: {
    presence: true,
    length: {
      minimum: 1,
    },
  },
  description: {
    presence: true,
    length: {
      minimum: 1,
    },
  },
}

const preference = {
  value: {
    presence: true,
    length: {
      minimum: 1,
    },
  },
}

export {
  expense as expenseConstraints,
  preference as preferenceConstraints,
}

export default {
  expense,
  preference,
}
