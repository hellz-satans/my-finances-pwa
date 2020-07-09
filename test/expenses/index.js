const DEFAULT_URL = 'http://localhost:8000'
const price = 10.57
const secondPrice = price * 2
const description = "some expense"

module.exports = {
  '1) an expense can be registered': function(browser) {
    browser
      .url(DEFAULT_URL)
      .waitForElementVisible('.expense-form-button')
      .click('.expense-form-button')
      .setValue('.expense-form .money-input', `${price}`)
      .setValue('.expense-form input[name=description]', description)
      .click('.expense-form .expense-form-submit')
      .assert.visible('.expenses-list')
      .assert.visible('.expenses-list table tbody tr td')
      .assert.containsText('.expenses-list table tbody', price)
      .assert.containsText('.expenses-list table tbody', description)
    ;
  },

  '2) expense can be edited': function(browser) {
    browser
      .assert.visible('.expenses-list')
      .click('.expenses-list table tbody .edit-expense-button')
      .assert.visible('.expense-form')
      .assert.domPropertyContains('.expense-form input[name=description]', 'value', description)
      .setValue('.expense-form .money-input', '')
      .setValue('.expense-form .money-input', `${secondPrice}`)
      .click('.expense-form .expense-form-submit')
      .assert.containsText('.expenses-list table tbody', secondPrice)
      .assert.containsText('.expenses-list table tbody', description)
  },

  '3) expense can be deleted': function(browser) {
    browser
      .click('.expenses-list table tbody .delete-expense-button')
      .assert.not.containsText('.expenses-list', secondPrice)
      .assert.not.containsText('.expenses-list', description)
  },
}
