<template>
	<div>
		<div class="d-flex flex-column-fluid" >
			<div class="container">
				<div class="row">
					<div class="col-md-8">	
						<div class="card card-custom shadow-none border">
							<div class="card-header flex-wrap p-4">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
									<h3 class="card-title align-items-start flex-column">
									<span class="card-label font-weight-bolder text-dark">{{ task.title }}</span>
									<span class="text-muted mt-1 font-weight-bold font-size-sm">{{ task.created_at }}</span>
								</h3>
							</div>
							<div class="card-body p-4" v-html="task.body">
								
							</div>
						</div>
						
					</div>
					<div class="col-md-4" v-if="authenticated.role == '2'">
						<SendTask />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import SendTask from '@/components/task/SendTask'

export default {
	name: 'LectureView',
	components: {
		SendTask
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated']),
		...mapState('task',['task']),
	},
	methods: {
		...mapActions('task',['getDataTask'])
	},
	async created() {
		try {
			await this.getDataTask(this.$route.params.id)
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	destroyed() {
		this.$store.state.task.task = {}
	}
}
</script>