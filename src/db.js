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

const db = new Dexie('Finances');

db.version(1).stores({
  accounts: '++id,name,balance',
  expenses: '++id,description,price,qty,tags,date',
  tags: '++id,name'
});

export default db;
