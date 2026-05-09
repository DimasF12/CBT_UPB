<template>
	<div class="d-flex flex-column flex-root">
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="d-flex flex-column flex-md-row">
					<div class="flex-md-row-auto w-md-275px w-xl-325px">
						<SchoolProfile/>
					</div>
					<div class="flex-md-row-fluid ml-md-6 ml-lg-8">
						<div class="row">
							<div class="col-xxl-6">
								<SchoolInfo />
							</div>
							<div class="col-xxl-6">
								<SchoolEvent />
								<ScheduleToday v-if="authenticated.role == '1'"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
const SchoolProfile = () => import('@/components/school/Profile')
const SchoolInfo = () => import('@/components/school/Information')
const SchoolEvent = () => import('@/components/school/UpcommingEvent')
const ScheduleToday = () => import('@/components/school/ScheduleToday')
import { mapState } from 'vuex'

export default {
	name: 'SchoolDashboard',
	components: {
		SchoolProfile,
		SchoolInfo,
		SchoolEvent,
		ScheduleToday
	},
	computed: {
		...mapState('user', ['authenticated'])
	}
}

</script>