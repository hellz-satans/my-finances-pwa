<template>
	<section class="accounts">
		<h2>Accounts</h2>
		<account-form></account-form>
		<account-list></account-list>
	</section>
</template>

<script>
	import AccountForm from '../components/AccountForm.vue';
	import AccountList from '../components/AccountList.vue';

	export default {
		components: {
			AccountForm,
			AccountList,
		},
	}
</script>
