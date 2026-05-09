<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Import soal</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Import soal dari docx file</span>
					</h3>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline">
							<router-link :to="{ name: 'exam.bank.questions', params: { id: $route.params.id} }" class="btn btn-light-primary mr-2">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
							<button class="btn btn-primary" :disabled="isLoading" @click="submit">
								<i class="flaticon-doc"></i>{{ isLoading ? 'Processing...' : 'Upload' }}
							</button>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="input-group">
						<b-form-file
						  accept=".docx"
					      v-model="file"
					      :state="Boolean(file)"
					      placeholder="Choose a file docx or drop it here..."
					      drop-placeholder="Drop file here..."
					    ></b-form-file>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BFormFile } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'ImportQuestion',
	components: {
		BFormFile
	},
	data() {
		return {
			file: null
		}
	},
	computed: {
		...mapGetters(['isLoading'])
	},
	methods: {
		...mapActions('question', ['importDataQuestionBank']),
		async submit() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)

				await this.importDataQuestionBank({
					id: this.$route.params.id,
					data: formData
				})
				this.$bvToast.toast('Soal berhasil diimport', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	}
}
</script>