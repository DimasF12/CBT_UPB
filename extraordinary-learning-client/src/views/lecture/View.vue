<template>
	<div>
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-8">	
						<div class="card card-custom shadow-none border">
							<div class="card-header flex-wrap pt-6 pb-6">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
								<h3 class="card-title align-items-start flex-column">
									<span class="card-label font-weight-bolder text-dark">{{ lecture.title }}</span>
									<span class="text-muted mt-1 font-weight-bold font-size-sm">{{ lecture.created_at }}</span>
								</h3>
							</div>
							<div class="card-body">
								<div v-html="lecture.body">
									
								</div>
								<iframe id="fred" title="PDF in an i-Frame" :src="`${baseURL}/storage/${lecture.addition}`" height="700px" width="100%" frameborder="0" scrolling="no" v-if="lecture.addition != null"></iframe>
							</div>
						</div>
						<div class="card card-custom shadow-none border">
							<div class="card-body p-4">
								<DianComment />
							</div>
						</div>
					</div>

					<div class="" :class="authenticated.role == '1' || authenticated.role == '0' ? 'col-md-4' : ''" >
						<DianOnlineStudent />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import DianComment from '@/components/lecture/Comment'
import DianOnlineStudent from '@/components/lecture/OnlineStudent'

export default {
	name: 'LectureView',
	components: {
		DianComment,
		DianOnlineStudent
	},
	computed: {
		...mapGetters(['isLoading','baseURL']),
		...mapState('user',['authenticated']),
		...mapState('lecture',['lecture']),
	},
	methods: {
		...mapActions('lecture',['getDataLecture'])
	},
	async created() {
		try {
			await this.getDataLecture(this.$route.params.id)
		} catch (error) {

		}
	},
	destroyed() {
		this.$store.state.lecture.lecture = {}
	}
}
</script>