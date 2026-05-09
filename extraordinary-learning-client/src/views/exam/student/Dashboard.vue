<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card card-custom shadow-none border">
					<div class="card-header flex-wrap border-0 pt-6 pb-0">
						<h3 class="card-title align-items-start flex-column">
							<span class="card-label font-weight-bolder text-dark">Jadwal ujian</span>
							<span class="text-muted mt-1 font-weight-bold font-size-sm">Daftar ujian yang dapat diikuti</span>
						</h3>
						<div class="card-toolbar">
							<div class="form-group">
								<router-link :to="{ name: 'home' }" class="btn btn-light-primary mr-2">
									<i class="flaticon-squares-4"></i>Dashboard
								</router-link>
							</div>
						</div>
					</div>
					<div class="card-body">
						<form @submit.prevent="submit">
							<div v-if="schedules && schedules.length > 0">
								<div class="form-group">
									<label>Jadwal ujian</label>
									<select class="form-control" v-model="data.exam_schedule_id">
										<option :value="schedule.id" v-for="schedule in schedules" :key="schedule.id">{{ schedule.name }}</option>
									</select>
								</div>
								<div class="form-group">
									<b-button variant="primary" type="submit" block :disabled="isLoading">
										{{ isLoading ? 'Processing...' : 'Submit' }}
									</b-button>
								</div>
							</div>
							<div v-else>
								<p class="text-muted">Tidak ada jadwal ujian untuk anda saat ini</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton } from 'bootstrap-vue'

export default {
	name: 'ExamStudentDashboard',
	components: {
		BButton
	},
	data() {
		return {
			data: {
				exam_schedule_id: ''
			}
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('exam', ['schedules']),
		...mapState('user', ['authenticated']),
	},
	methods: {
		...mapActions('exam', ['createDataExam', 'getDataExamActive']),
		async submit() {
			try {
				await this.createDataExam(this.data)
				await this.getDataExamActive()
				this.$router.replace({ name: 'exam.prepare' })
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	}
}
</script>