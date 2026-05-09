<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Materi Pembelajaran</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Materi pembelajaran dibagikan</span>
					</h3>
				</div>
				<div class="card-body">
					<div class="table-responsive-md" v-if="typeof classroom_lectures.data != 'undefined'">
						<b-table 
                        id="table-transition-example" 
                        show-empty
                        :fields="fields"
                        :items="classroom_lectures.data"
                        >
                        	<template v-slot:cell(title)="row">
                        		<span>
                        			<div class="d-flex align-items-center">
                        				<div class="symbol symbol-40 symbol-light-primary symbol-sm flex-shrink-0">					
                        					<span class="symbol-label font-size-h4 font-weight-bold ">
                        						<i class="flaticon-earth-globe text-primary"></i>
                        					</span>								
                        				</div>								
                        				<div class="ml-4 d-flex flex-column">									
                        					<router-link :to="{ name: 'lecture.view', params: { id: row.item.lecture.id }}" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-0" v-text="row.item.lecture.title"></router-link>									
                        					<span class="text-muted font-weight-bold" v-text="row.item.lecture.subject.name"></span>	
                        				</div>							
                        			</div>
                        		</span>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="classroom_lectures.total"
					        :per-page="classroom_lectures.per_page"
					        :disabled="isLoading"
					      ></b-pagination>
					      <div class="d-flex align-items-center py-3">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
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
import { errorToas } from '@/core/entities/notif'
import { BPagination ,BDropdownItem, BDropdown } from 'bootstrap-vue'

export default {
	name: 'StudentDataLecture',
	components: {
		BPagination, BDropdownItem, BDropdown
	},
	data: () => ({
		search: '',
		perPage: 10,
		fields: [
			{ key: 'title',thStyle: { display: 'none'} }
		]
	}),
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user',['authenticated']),
		...mapState('lecture',['classroom_lectures']),
		page: {
			get() {
				return this.$store.state.lecture.classroom_lecture_page
			},
			set(val) {
				this.$store.commit('lecture/SET_CLASSROOM_LECTURE_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('lecture',['getDataLectureClassroom']),
	},
	created() {
		if(typeof this.authenticated.classroom == 'undefined') {
			if(this.$route.name != 'master.classroom.join') {
				this.$router.push({ name: 'master.classroom.join' })
			}
			return
		}
		this.getDataLectureClassroom(this.authenticated.classroom.id)
		.then((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		page() {
			this.getDataLectureClassroom(this.authenticated.classroom.id)
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	}
}
</script>