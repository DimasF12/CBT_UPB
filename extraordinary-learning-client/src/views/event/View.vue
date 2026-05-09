<template>
	<div>
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-4">
						<div class="card card-custom shadow-none border">
							<div class="card-body p-4">
								<table class="table table-borderless">
									<tr>
										<td width="100px">Lokasi</td>
										<td>{{ event.location }}</td>
									</tr>
									<tr>
										<td>Tanggal</td>
										<td>{{ event.date }}</td>
									</tr>
									<tr>
										<td>Waktu</td>
										<td>{{ event.time }}</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
					<div class="col-md-8">	
						<div class="card card-custom shadow-none border">
							<div class="card-header flex-wrap pt-6 pb-6">
									<h3 class="card-title align-items-start flex-column">
									<span class="card-label font-weight-bolder text-dark">{{ event.title }}</span>
									<span class="text-muted mt-1 font-weight-bold font-size-sm">{{ event.location }}</span>
								</h3>
							</div>
							<div class="card-body">
							
								<div class="mt-2" v-html="event.body">
									
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
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'ViewEvent',
	computed: {
		...mapState('event', ['event'])
	},
	methods: {
		...mapActions('event', ['getDataEvent'])
	},
	created() {
		this.getDataEvent(this.$route.params.id)
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>