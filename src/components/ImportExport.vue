<template>
	<sui-card-group class="import-export" :items-per-row="2">
		<sui-card>
			<sui-card-content>
				<sui-card-header>Import</sui-card-header>
				<sui-card-description>
					<p>Select an exported file and import it</p>
					<input
						ref="importFile"
						name="importFile"
						type="file"
						accept="application/json"
						@change="handleFile"
					/>
				</sui-card-description>
			</sui-card-content>
		</sui-card>

		<sui-card>
			<sui-card-content>
				<sui-card-header>Export</sui-card-header>
				<sui-card-description>
					<ul>
						<li>Accounts</li>
						<li>Expenses</li>
					</ul>
				</sui-card-description>
			</sui-card-content>
			<sui-button
				type="button"
				color="teal"
				@click.prevent.stop="exportData"
				attached="bottom"
			>
				<sui-icon name="download" />
				Download
			</sui-button>
		</sui-card>
	</sui-card-group>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	methods: {
		... mapActions([ 'exportData', 'importData' ]),
		handleFile() {
			const files = this.$refs.importFile.files

			if (files.length > 0) {
				const reader = new FileReader()

				reader.addEventListener('load', (ev) => {
					const data = JSON.parse(ev.target.result)
					this.importData(data)
				})

				reader.readAsBinaryString(files.item(0))
			}
		}
	}
}
</script>
