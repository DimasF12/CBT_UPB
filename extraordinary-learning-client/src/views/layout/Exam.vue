<template>
	<div>
		<KTHeaderMobile></KTHeaderMobile>
		<div class="d-flex flex-column flex-root" v-if="typeof authenticated.id != 'undefined'">
			<div class="d-flex flex-row flex-column-fluid page" id="kt_body_content">
				<div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
					<KTHeader></KTHeader>
					<div class="content d-flex flex-column flex-column-fluid" id="kt_content">
			    		<router-view />
			    	</div>
			    	<KTFooter></KTFooter>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import KTHeader from '@/components/header/HeaderExam'
import KTHeaderMobile from '@/components/header/HeaderMobileExan'
import KTFooter from '@/components/footer/Footer'

export default {
	name: 'Exam',
	components: {
		KTHeader,
		KTHeaderMobile,
		KTFooter
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated']),
		...mapState('exam', ['uncomplete'])
	},
	methods: {
		...mapActions('exam', ['getDataExamSchedule','getDataExamActive', 'getDataExamUncomplete'])
	},
	async created() {
		try {
			if(this.$route.name != 'exam.while') {
				await this.getDataExamSchedule()
				await this.getDataExamActive()
				await this.getDataExamUncomplete()
			}
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	watch: {
		uncomplete(val) {
			if(this.$route.name != 'exam.while' && typeof val.exam_schedule_id != 'undefined') {
				this.$router.replace({
					name: 'exam.while'
				})
			}
		}
	}
}
</script>
<style lang="scss">
	@import "@/assets/sass/exam";
</style>