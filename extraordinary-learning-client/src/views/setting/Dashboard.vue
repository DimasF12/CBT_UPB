<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="row">
				<div class="col-md-4">
					<div class="list-group">
					  <router-link :to="{}" class="list-group-item list-group-item-action active">
					    v1.0.1 High School Version
					  </router-link>
					  <a href="#" @click="getSchool" class="list-group-item list-group-item-action">Data sekolah</a>
						<a href="#" @click="getLogoSchool" class="list-group-item list-group-item-action">Logo sekolah</a>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-school" title="Data sekolah">
			<School />
			<template v-slot:modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel()">
        Cancel
      </b-button>
			<b-button variant="primary" @click="submitSchool">
				Simpan
			</b-button>
    </template>
		</b-modal>
		<b-modal id="modal-logo" title="Logo sekolah" hide-footer>
			<div class="input-group">
				<b-form-file
					accept=".jpg, .png, .jpeg"
						v-model="file"
						:state="Boolean(file)"
						placeholder="Choose school's logo or drop it here..."
						drop-placeholder="Drop file here..."
					></b-form-file>
					<div class="input-group-append">
						<button class="btn btn-primary" type="button" :disabled="isLoading" @click="upload">{{ isLoading ? 'Processing...' : 'Upload' }}</button>
					</div>
			</div>
			<span class="form-text text-muted">Allowed file types: png, jpg, jpeg.</span>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BFormFile, BButton } from 'bootstrap-vue'
import School from './School'

export default {
	name: 'SettingDashboard',
	components: {
		School, BButton, BFormFile
	},
	data: () => ({
		file: null
	}),
	computed: {
		...mapGetters(['isLoading', 'baseURL']),
		...mapState(['errors']),
		...mapState('setting', ['setting'])
	},
	methods: {
		...mapActions('setting', ['storeDataSetting', 'getDataSettingSchool', 'storeDataSettingLogo']),
		getSchool() {
			this.$bvModal.show('modal-school')
		},
		getLogoSchool() {
			this.$bvModal.show('modal-logo')
		},
		async submitSchool() {
			try {
				await this.storeDataSetting()
				this.$bvToast.toast('Data informasi sekolah berhasil disimpan', successToas())
				this.$bvModal.hide('modal-school')
				this.getDataSettingSchool()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async upload() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)
				formData.append('name', 'school')

				await this.storeDataSettingLogo(formData)
				this.file = null
				this.$bvToast.toast('Logo berhasil diupload', successToas())
				this.getDataSettingSchool()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
	}
}
</script>