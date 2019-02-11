<template>
	<article class="preference-modal">
		<sui-button size="mini" @click.native="toggleModal(preferenceKey)">
			Edit {{ preferenceKey }}
			<sui-icon
				class="right floated"
				size="small"
				name="pencil"
			/>
		</sui-button>

		<sui-modal v-model="preferenceModal" size="tiny">
			<sui-modal-header>
				Edit {{ preferenceKey }}
			</sui-modal-header>

			<sui-modal-content>
				<sui-form @submit.prevent.stop="" name="expense" method="POST">
					<sui-form-field>
						<label for="preferenceKey">{{ preferenceKey }}</label>
						<sui-input
							name="preferenceKey"
							required
							v-model="value"
						/>
					</sui-form-field>
				</sui-form>
			</sui-modal-content>

			<sui-modal-actions>
				<sui-button @click="toggleModal(preferenceKey)">Close</sui-button>
				<sui-button positive @click.native="submitPreference">Save</sui-button>
			</sui-modal-actions>
		</sui-modal>
	</article>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
	props: {
		preferenceKey: { type: String, required: true },
	},
	methods: {
		... mapActions('preferences', [
			'toggleModal',
			'createPreference',
			'updatePreference',
		]),
		submitPreference() {
			if (this.preferences.some(el => el.key === this.preferenceKey)) {
				this.updatePreference({ key: this.preferenceKey, value: this.value })
			} else {
				this.createPreference({ key: this.preferenceKey, value: this.value })
			}
		},
	},
	computed: {
		... mapState('preferences', [ 'preferences' ]),
		preferenceModal: {
			get() { return this.$store.state.preferences.modals[this.preferenceKey] },
			set(v) { this.$store.commit('preferences/toggleModal', this.preferenceKey) },
		},
	},
  data() {
    return {
			value: null
    }
  },
	created() {
		const pref = this.preferences.find(el => el.key === this.preferenceKey)

		if (pref) {
			this.value = pref.value
		}
	},
}
</script>

