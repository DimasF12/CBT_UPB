<template>
	<div class="card card-custom gutter-b shadow-none border">
		<div class="card-header align-items-center border-0 mt-4">
			<h3 class="card-title align-items-start flex-column">
				<span class="font-weight-bolder text-dark">Jadwal hari ini</span>
				<span class="text-muted mt-3 font-weight-bold font-size-sm">
					<span class="badge badge-primary" v-b-tooltip.hover title="Jumlah jadwal hari ini">{{ schedules.length }} terjadwal hari ini</span>
				</span>
			</h3>
			<div class="card-toolbar">
			</div>
		</div>
		<div class="card-body pt-4">
			<span v-if="schedules.length === 0" class="text-muted">Tidak ada jadwal mengajar hari ini</span>
			<div class="timeline timeline-1">
					<div class="timeline-sep bg-primary-opacity-20"></div>
					<div class="timeline-item"  v-for="schedule in schedules" :key="schedule.id">
							<div class="timeline-label">{{ schedule.from_time.substring(0,5) }}</div>
							<div class="timeline-badge">
									<i class="flaticon2-crisp-icons-1 text-primary "></i>
							</div>
							<div class="timeline-content text-muted font-weight-normal">
								{{ schedule.classroom_name }} - {{ schedule.subject_name }} <br>
								Berakhir pada {{ schedule.end_time.substring(0,5) }}
							</div>
					</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	name: 'ScheduleToday',
	data() {
		return {
			key: null
		}
	},
	computed: {
		...mapState('user', ['authenticated']),
		...mapState('classroom',['schedules'])
	},
	methods: {
		...mapActions('classroom', ['getDataSchedulesClassroomToday'])
	},
	created() {
		if(this.authenticated.role == '2') {
			if(typeof this.authenticated.classroom == 'undefined') {
				this.$router.push({ name: 'master.classroom.join' })
				return
			}
			this.key = this.authenticated.classroom.id
		} else {
			this.key = this.$route.params.id
		}

		this.getDataSchedulesClassroomToday(this.key)
		.catch((error) => {

		})
	}
}
</script>