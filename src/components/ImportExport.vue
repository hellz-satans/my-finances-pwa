<style lang="scss">
	.import-export {
	}
</style>

<template>
	<article class="import-export">
		<sui-button
			type="button"
			color="olive"
			@click.prevent.stop="importData"
		>
			Import
			<sui-icon class="right" name="upload" />
		</sui-button>

		<sui-button
			type="button"
			color="teal"
			@click.prevent.stop="exportData"
		>
			Export
			<sui-icon class="right" name="download" />
		</sui-button>
	</article>
</template>

<script>
	import { mapActions } from 'vuex';

	export default {
		data() {
			return {
			};
		},
		methods: {
			... mapActions([ 'exportData', 'importData' ]),
		},
	};
</script>
