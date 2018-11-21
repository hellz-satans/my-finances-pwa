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

export default db;
