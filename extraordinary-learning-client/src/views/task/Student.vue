<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Tugas saya</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Tugas dibagikan</span>
					</h3>
				</div>
				<div class="card-body">
					<div class="table-responsive-md" v-if="typeof classroom_tasks.data != 'undefined'">
						<b-table 
	                        id="table-transition-example" 
	                        show-empty
	                        :fields="fields"
	                        :items="classroom_tasks.data"
	                        >
	                        <template v-slot:cell(title)="row">
	                        	<span>
	                        		<div class="d-flex align-items-center">
	                        			<div class="symbol symbol-40 symbol-light-primary symbol-sm flex-shrink-0">					
	                        				<span class="symbol-label font-size-h4 font-weight-bold ">
	                        					<i class="flaticon-edit-1 text-primary"></i>
	                        				</span>								
	                        			</div>								
	                        			<div class="ml-4 d-flex flex-column">									
	                        				<router-link :to="{ name: 'task.view', params: { id: row.item.task.id }}" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-0" v-text="row.item.task.title">
	                        				</router-link>
	                        				<span class="text-muted">Batas {{ row.item.task.lastsubmit }}</span>				
	                        			</div>							
	                        		</div>
	                        	</span>
	                        </template>
	                        <template v-slot:cell(status)="row">
	                        	<span class="badge badge-danger" v-show="!row.item.task.status">Belum selesai</span>
	                        	<span class="badge badge-success" v-show="row.item.task.status">Selesai</span>
	                        </template>
	                    </b-table>
	                    <div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
						    <b-pagination
						        v-model="page"
						        :total-rows="classroom_tasks.total"
						        :per-page="classroom_tasks.per_page"
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
import { successToas, errorToas } from '@/core/entities/notif'
import { BPagination } from 'bootstrap-vue'

export default {
	name: 'TaskStudent',
	components: {
		BPagination
	},
	data: () => ({
		fields: [
			{ key: 'title', thStyle: { display: 'none'} },
			{ key: 'status', thStyle: { display: 'none' }}
		],
	}),
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated']),
		...mapState('task',['classroom_tasks']),
		page: {
			get() {
				return this.$store.state.task.classroom_task_page
			},
			set(val) {
				this.$store.commit('task/SET_CLASSROOM_TASK_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('task',['getDataClassroomTasks'])
	},
	created() {
		if(typeof this.authenticated.classroom == 'undefined') {
			if(this.$route.name != 'master.classroom.join') {
				this.$router.push({ name: 'master.classroom.join' })
			}
			return
		}
		this.getDataClassroomTasks(this.authenticated.classroom.id)
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		page() {
			this.getDataClassroomTasks(this.authenticated.classroom.id)
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	}
}
</script>