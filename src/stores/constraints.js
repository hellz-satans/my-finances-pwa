import validate from 'validate.js'

validate.validators.notZero = function(value, options, key, attributes) {
  let err = null;

  if (value === 0) {
    err = 'cannot be zero'
  }

  return err;
}

const expense = {
  price: {
    presence: true,
    numericality: true,
    notZero: true,
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
    presence: false,
    length: {
      minimum: 1,
      maximum: 128,
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
