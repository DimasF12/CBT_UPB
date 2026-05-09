<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header pt-6">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Buat materi</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Materi dari hati & pikiran serta dengan cinta</span>
					</h3>
					<div class="card-toolbar">
						<div class="form-group">
							<router-link :to="{ name: 'lecture.index' }" class="btn btn-light-primary mr-2">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
							<button class="btn btn-primary" :disabled="isLoading" @click="submit">
								<i class="flaticon-doc"></i>{{ isLoading ? 'Processing...' : 'Simpan' }}
							</button>
						</div>
					</div>
				</div>
			</div>
			<lecture-form />	
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import LectureForm from './Form'

export default {
	name: 'AddLecture',
	components: {
		LectureForm
	},
	computed: {
		...mapGetters(['isLoading']),
	},
	methods: {
		...mapActions('lecture',['createNewLecture']),
		async submit() {
			try {
				await this.createNewLecture()
				this.$router.push({ name: 'lecture.index' })
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.$store.commit('lecture/CLEAR_FORM_LECTURE')
	}
}
</script>