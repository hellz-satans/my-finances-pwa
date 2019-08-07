import db from '@/db'

const exportDB = async function() {
  const data = {}
  const promises = []

  promises.push(db.accounts.toArray().then(arr => data.accounts = arr))
  promises.push(db.expenses.toArray().then(arr => data.expenses = arr))
  promises.push(db.preferences.toArray().then(arr => data.preferences = arr))

  await Promise.all(promises)

  return data
}

export default {
  exportDB,
}

export {
  exportDB,
}
