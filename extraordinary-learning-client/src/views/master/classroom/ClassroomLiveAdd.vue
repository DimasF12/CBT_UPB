<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header pt-6 pb-3">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Mulai kelas</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Materi dari hati & pikiran serta dengan cinta</span>
					</h3>
					<div class="card-toolbar">
						<div class="form-group">
							<button class="btn btn-primary" :disabled="isLoading" @click="submit">
								<i class="flaticon-doc"></i>{{ isLoading ? 'Processing...' : 'Mulai' }}
							</button>
						</div>
					</div>
				</div>
			</div>
			<FormClassroomLive />
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BFormCheckbox } from 'bootstrap-vue'
import FormClassroomLive from './FormClassLive'
import store from '@/store'

export default {
	name: 'ClassroomLiveAdd',
	components: {
		BFormCheckbox,
		FormClassroomLive
	},
	data() {
		return {
			
		}
	},
	computed: {
		...mapGetters(['baseURL','isLoading']),
	},
	methods: {
		...mapActions('classroom', ['storeLiveClassroom']),
		async submit() {
			try {
				let provider = await this.storeLiveClassroom(this.$route.params.id)
				this.$router.push({ name: 'master.classroom.live', params: { id: provider.id} })
			} catch (error) {
				
			}
		}
	}
}
</script>