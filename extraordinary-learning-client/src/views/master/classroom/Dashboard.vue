<template>
	<div class="d-flex flex-column flex-root">
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="d-flex flex-column flex-md-row">
					<div class="flex-md-row-auto w-md-275px w-xl-325px">
						<ClassProfile />
					</div>
					<div class="flex-md-row-fluid ml-md-6 ml-lg-8">
						<div class="row">
							<div class="col-xxl-6">
								<ClassTimeline />
							</div>
							<div class="col-xxl-6">
								<ScheduleToday />
								<ClassStudentLoby />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import ClassProfile from '@/components/classroom/Profile'
import ClassTimeline from '@/components/classroom/Timeline'
import ClassStudentLoby from '@/components/classroom/StudentOnline'
import ScheduleToday from '@/components/classroom/ScheduleToday'
import { mapState } from 'vuex'

export default {
	name: 'ClassroomDashboard',
	components: {
		ClassProfile,
		ClassTimeline,
		ClassStudentLoby,
		ScheduleToday
	},
	computed: {
		...mapState('user',['authenticated'])
	}
}
</script>