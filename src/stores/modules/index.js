import { AccountsStore } from './accounts'
import { CategoriesStore } from './categories'
import { ExpensesStore } from './expenses'
import { PreferencesStore } from './preferences'

export {
	AccountsStore as Accounts,
	CategoriesStore as Categories,
	ExpensesStore as Expenses,
	PreferencesStore as Preferences,
}

export default {
	accounts: AccountsStore,
	categories: CategoriesStore,
	expenses: ExpensesStore,
	preferences: PreferencesStore,
}
