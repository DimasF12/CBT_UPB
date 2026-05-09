<template>
	<div>
		<div class="" v-if="typeof setting.settings != 'undefined'">
			<div class="form-group">
				<label>Nama sekolah</label>
				<input class="form-control" type="text" v-model="setting.settings.name">
			</div>
			<div class="form-group">
				<label>Email sekolah</label>
				<input class="form-control" type="email" v-model="setting.settings.email">
			</div>
			<div class="form-group">
				<label>Alamat sekolah</label>
				<textarea class="form-control" v-model="setting.settings.address"></textarea>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BFormFile } from 'bootstrap-vue'

export default {
	name: 'SchoolSetting',
	components: {
		BFormFile
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
		...mapActions('setting', ['getDataSetting', 'storeDataSetting', 'storeDataSettingLogo', 'getDataSettingSchool']),
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
		async submit() {
			try {
				await this.storeDataSetting()
				this.$bvToast.toast('Data informasi sekolah berhasil disimpan', successToas())
				this.getDataSettingSchool()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.getDataSetting('school')
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>