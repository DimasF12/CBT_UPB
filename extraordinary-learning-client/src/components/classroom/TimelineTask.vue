<template>
	<div v-if="typeof classroom_tasks.data != 'undefined'">
		<div class="card card-custom shadow-none border gutter-b" v-for="task in classroom_tasks.data" :key="task.id">
			<div class="card-body p-4">
				<div class="d-flex align-items-center">
					<div class="symbol symbol-45 symbol-light mr-5">
						<b-button variant="primary" class="btn-icon btn-circle"  v-b-toggle="'task_'+task.id">
			 				<i class="flaticon-edit-1"></i>
						</b-button>
					</div>
					<div class="d-flex flex-column flex-grow-1">
						<router-link :to="{ name: 'task.view', params: { id: task.task.id }}" class="text-dark-75 text-hover-primary mb-1 font-size-lg font-weight-bold">
							{{ task.task.title }} <span class="badge badge-success" v-if="authenticated.role == 1 && task.task.status == true">selesai</span>
						</router-link>
						<div class="d-flex">
							<div class="d-flex align-items-center pr-5">
								<span class="text-muted">{{ task.created_at }}</span>
							</div>
						</div>
					</div>
					<b-dropdown class="bg-hover-light-primary rounded-pill" v-if="authenticated.role == '1'" variant="link" toggle-class="text-decoration-none" no-caret>
						<template v-slot:button-content>
						<span class="flaticon-more-v5"></span>
						</template>
						<b-dropdown-item @click="deleteData(task.id)">Hapus</b-dropdown-item>
					</b-dropdown>
				</div>
				<b-collapse :id="'task_'+task.id">
				<div class="pt-3">
					<p class="text-dark-75 font-size-lg font-weight-normal pt-5 mb-2">{{ task.body}}</p>
				</div>
				</b-collapse>
			</div>
		</div>
		<div class="mt-7" v-if="classroom_tasks.data.length == 0 ">
			<div class="">
				<p class="text-muted">Tidak ada tugas yang dibagikan</p>
			</div>
		</div>
		<b-pagination
			v-if="classroom_tasks.data.length > 0"
			v-model="page"
			:total-rows="classroom_tasks.total"
			:per-page="classroom_tasks.per_page"
			:disabled="isLoading"
			>
		</b-pagination>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BDropdownItem, BDropdown, BPagination, BButton, BCollapse } from 'bootstrap-vue'

export default {
	name: 'TimelineTask',
	data() {
		return {
			key: null
		}
	},
	components: {
		BDropdownItem, BDropdown, BPagination, BButton, BCollapse
	},
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
		...mapActions('task',['getDataClassroomTasks', 'deleteTaskSharee']),
		changeData() {
			this.getDataClassroomTasks(this.key)
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		deleteData(id) {
			this.$swal({
                title: 'Informasi',
                text: "Tugas akan dihapus dari kelas ini",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if (result.value) {
                	try {
                		await this.deleteTaskSharee(id)
                		this.changeData()
                	} catch (error) {
                		this.$bvToast.toast(error.message, errorToas())
                	}
                }
            })
		}
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

		this.changeData()
	},
	watch: {
		page() {
			this.getDataClassroomTasks(this.key)
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	}
}
</script>