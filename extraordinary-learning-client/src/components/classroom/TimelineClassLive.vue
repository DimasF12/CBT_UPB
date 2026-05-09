<template>
	<div>
		<div class="card card-custom gutter-b shadow-none border" v-for="liveclass in classlives">
			<div class="card-body pt-4 pl-5 pr-4 pb-2 ribbon  ribbon-right">
				<div class="ribbon-target bg-primary" style="top: 10px; right: -2px;">
					Kelas langsung <br>
					{{ liveclass.start_time }}
				</div>
				<div class="d-flex align-items-center">
					<div class="symbol symbol-45 symbol-primary symbol-circle mr-5">
						<span class="symbol-label">
							<span class="svg-icon svg-icon-lg svg-icon-primary">
								<i class="flaticon-technology-2 text-white"></i>
							</span>
						</span>
					</div>
					<div class="d-flex flex-column flex-grow-1">
						<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
							{{ liveclass.teacher_name }}
						</span>
						<div class="d-flex">
							<div class="d-flex align-items-center">
								<span class="text-muted font-weight-bold">{{ liveclass.subject_name }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="pt-3">
					<router-link :to="{ name: 'master.classroom.live', params: { id: liveclass.classroom_live_id }}" class="stretched-link"></router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BDropdownItem, BDropdown } from 'bootstrap-vue'

export default {
	name: 'TimelineClassLive',
	data() {
		return {
			key: null
		}
	},
	components: {
		BDropdownItem, BDropdown
	},
	computed: {
		...mapState('user',['authenticated']),
		...mapState('classroom', ['classlives'])
	},
	methods: {
		...mapActions('classroom', ['getDatalivesClassroom']),
	},
	created() {
		if(this.authenticated.role == '2') {
			if(typeof this.authenticated.classroom == 'undefined') {
				if(this.$route.name != 'master.classroom.join') {
					this.$router.push({ name: 'master.classroom.join' })
				}
				return
			}
			this.key = this.authenticated.classroom.id
		} else {
			this.key = this.$route.params.id
		}

		this.getDatalivesClassroom(this.key)
		.then((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>