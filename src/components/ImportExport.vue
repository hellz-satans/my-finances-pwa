<template>
	<sui-card-group class="import-export" :items-per-row="3" stackable>
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
			<sui-button
				type="button"
				color="green"
				@click.prevent.stop="readData"
				attached="bottom"
			>
				<sui-icon name="upload" />
				Upload
			</sui-button>
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

		<sui-card>
			<sui-card-content>
				<sui-card-header>Destroy</sui-card-header>
				<sui-card-description>
					<p>
						Destroy <strong>all</strong> local data
						&mdash; export first if unsure
					</p>
				</sui-card-description>
			</sui-card-content>
			<sui-button
				type="button"
				color="red"
				@click.prevent.stop="deleteData"
				attached="bottom"
			>
				<sui-icon name="trash" />
				Destroy
			</sui-button>
		</sui-card>
	</sui-card-group>
</template>

<script>
import { mapActions } from 'vuex'

export default {
	methods: {
		... mapActions([ 'deleteData', 'exportData', 'importData' ]),
		handleFile() {
			if (this.$refs.importFile.files.length > 0) {
				this.readData()
			}
		},

		readData() {
			if (this.$refs.importFile.files.length > 0) {
				const reader = new FileReader()

				reader.addEventListener('load', (ev) => {
					const data = JSON.parse(ev.target.result)
					this.importData(data)
				})

				reader.readAsBinaryString(this.$refs.importFile.files.item(0))
			}
		},
	}
}
</script>
