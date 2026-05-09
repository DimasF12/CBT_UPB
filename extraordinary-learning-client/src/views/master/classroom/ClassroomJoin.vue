<template>
	<div class="d-flex flex-column flex-root">
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-5">
						<div class="card card-custom">
							<div class="card-body">
								<div class="alert bg-light-info">
									<strong>Informasi</strong><br>
									Anda belum mendapatkan kelas, minta walikelas anda
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
export default {
	name: 'ClassroomJoin',
	data: () => ({
		data: {
			invitation_code: ''
		}
	}),
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
	},
	methods: {
		...mapActions('classroom', ['joinClassroom']),
		...mapActions('user', ['getUserLogin']),
		async join() {
			try {
				await this.joinClassroom(this.data)
				await this.getUserLogin()
				this.$router.push({ name: 'master.classroom.student'})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	}
}
</script>