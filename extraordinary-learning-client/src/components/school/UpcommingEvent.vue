<template>
	<div class="card card-custom gutter-b shadow-none border">
		<!--begin::Header-->
		<div class="card-header  p-4 d-flex justify-content-between">
			<div class="d-flex align-items-center">
				<div class="symbol symbol-45 symbol-light-primary mr-5">
					<b-button variant="primary" class="btn-icon"  v-b-toggle="'dent_2'">
			 			<i class="flaticon-app"></i>
					</b-button>
				</div>
				<div class="d-flex flex-column flex-grow-1">
					<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
						Kegiatan mendatang</span>
					</span>
					<div class="d-flex">
						<div class="d-flex align-items-center pr-5">
							<span class="svg-icon svg-icon-md svg-icon-primary">
							</span>
							<span class="text-muted font-weight-bold">Daftar kegiatan sekolah</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<b-collapse :id="'dent_2'">
		<div class="card-body pt-2 p-4" v-if="public_events.length > 0">
			<!--begin::Item-->
			<div class="d-flex align-items-center justify-content-between mb-10" v-for="event in public_events" :key="event.id"> 
				<!--end::Symbol-->
				<!--begin::Text-->
				<div class="d-flex align-items-center">
					
				<div class="symbol symbol-45 symbol-light-info symbol-circle mr-5">
					<span class="symbol-label">
						<span class="svg-icon svg-icon-lg svg-icon-info">
							<i class="flaticon-calendar-with-a-clock-time-tools text-info"></i>
						</span>
					</span>
				</div>
				<div class="d-flex flex-column font-weight-bold mr-5">
					<router-link :to="{ name: 'event.view', params: { id: event.id }}" class="text-dark text-hover-info mb-1 font-size-lg">{{ event.title }}</router-link>
					<span class="text-muted">{{ event.location }}</span>
				</div>
				</div>
				<div class="d-flex flex-column font-weight-bold text-right">
					<span class="text-dark mb-1 font-size-lg">{{ event.date }}</span>
					<span class="text-muted">{{ event.time }}</span>
				</div>
				<!--end::Text-->
			</div>
			<!--end::Item-->
		</div>
		<div class="card-body" v-else>
			<p class="text-muted">Tidak ada kegiatan mendatang</p>
		</div>
		<!--end::Body-->
		</b-collapse>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BCollapse } from 'bootstrap-vue'

export default {
	naem: 'UpcommingEvent',
	components: {
		BButton, BCollapse
	},
	computed: {
		...mapState('event', ['public_events'])
	},
	methods: {
		...mapActions('event', ['getDataEventPublic'])
	},
	created() {
		this.getDataEventPublic()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>