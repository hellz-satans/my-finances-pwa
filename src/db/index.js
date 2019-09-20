/**
 * Offline database using Dexie.js.
 *
 * This SHOULD be treated as schema migrations, i.e.:
 * DO NOT modify existing versions, rather increase the version
 * and provide an upgrade handler.
 *
 * For more information, see https://dexie.org/docs/Version/Version.upgrade()
 */
import Dexie from 'dexie';
import seeds from '@/db/seeds';

const db = new Dexie('Finances');

db.version(1).stores({
  accounts: '++id,name,balance',
  expenses: '++id,description,price,qty,tags,date',
  tags: '++id,name'
});

// add color to accounts
db.version(2).stores({
  accounts: '++id,name,balance,color',
}).upgrade((trans) => {
	const defaultColor = '#68BC00';

	return trans.accounts
		.toCollection()
		.modify((acc) => {
			if (!acc.color) {
				acc.color = defaultColor;
			}
		});
});

/**
 * Add categories and subcategories.
 *
 * They are all stored in the same collection, but subcategories are
 * differentiated by the field `isSubcategory` which is a simple boolean flag.
 */
db.version(3).stores({
	categories: '&key,name,icon,isSubcategory',
	tags: null,
});

/**
 * Add preferences
 *
 * This is meant to be a key-value collection for things like user settings,
 * and the like. Maybe even stuff that doesn't fit anywhere else (like a
 * savings goal).
 * Feel free to add any property to **stored** objects, we only declare
 * properties that we want to index.
 *
 * See https://dexie.org/docs/API-Reference#quick-reference
 */
db.version(4).stores({
	preferences: '&key,value'
});

/**
 * Remove expeneses' quantity field.
 *
 * To improve a little bit the expense creation process.
 */
db.version(5).upgrade((transaction) => {
  return transaction.expenses
    .toCollection()
    .modify((exp) => {
      if (exp.qty > 1) {
        exp.price = exp.price * exp.qty
      }

      delete exp.qty
    })
})

/**
 * Add sign to prices
 */
db.version(6).upgrade((transaction) => {
  return transaction.expenses
    .toCollection()
    .modify((exp) => {
      exp.price = exp.price * -1
    })
})

/**
 * Add `key` to accounts and use it as primary key.
 *
 * Numerical IDs were a mistake. After the account is deleted, the expenses
 * records are left without a discernible account.
 */
db.version(7).stores({
  accounts: '++id,&key,name,balance',
}).upgrade(async (trans) => {
  let accountsMap = {}

	await trans.accounts
		.toCollection()
		.modify((acc) => {
      let k = acc.name.toLowerCase()
      accountsMap[acc.id] = k
      acc.key = k
		});

  return trans.expenses
    .toCollection()
    .modify((exp) => {
      if (accountsMap[exp.accountId]) {
        exp.account = accountsMap[exp.accountId]
      }
      delete exp.accountId
    })
});


export default db;
