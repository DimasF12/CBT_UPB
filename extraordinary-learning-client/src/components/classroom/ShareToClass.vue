<template>
	<div class="card card-custom gutter-b shadow-none border">
		<div class="card-body p-4">
			<div class="d-flex align-items-center mb-5">
				<div class="symbol symbol-40 symbol-light-success mr-5">
					<span class="symbol-label">
						<img src="/img/007-boy-2.svg" class="h-75 align-self-end" alt="" />
					</span>
				</div>
				<span class="text-dark font-weight-bold font-size-lg">
					{{ authenticated.name }}<br>
					<small>Selamat datang di kelas kami</small>
				</span>
			</div>
			<hr>
			<div class="d-flex align-items-center">
				<b-button v-b-modal.modal-sharee variant="white" class="btn btn-hover-text-primary btn-hover-icon-primary btn-sm btn-text-dark-50 bg-hover-light-primary rounded font-size-sm p-2 mr-2" v-b-tooltip.hover title="Bagikan materi ke kelas ini">
					<span class="svg-icon svg-icon-md svg-icon-dark-25">
						<i class="flaticon-file-2"></i>
					</span>
					Bagikan materi
				</b-button>
				<b-button v-b-modal.modal-task variant="white"  class="btn btn-sm btn-text-dark-50 btn-hover-icon-primary btn-hover-text-primary bg-hover-light-primary rounded font-size-sm p-2" v-b-tooltip.hover title="Bagikan tugas ke kelas ini">
					<span class="svg-icon svg-icon-md svg-icon-dark-25">
						<i class="flaticon-edit-1"></i>
					</span>
					Bagikan tugas
				</b-button>
			</div>
		</div>
		<b-modal id="modal-sharee" title="Bagikan materi ke kelas">
			<form>
				<div class="form-group">
					<label>Materi</label>
					<v-select label="title" :reduce="item => item.id" :options="lectures.data" v-model="lecture_id" :filterable="false" @search="onSearchLecture">
						<template slot="no-options">
					    	Ketik untuk mencari materi anda..
					    </template>
					</v-select>
				</div>
				<div class="form-group">
					<label>Body</label>
					<textarea class="form-control" v-model="body" placeholder="Tulis sedikit text">
						
					</textarea>
				</div>
			</form>
			<template v-slot:modal-footer="{ cancel }">
				<b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
					Cancel
				</b-button>
				<b-button size="sm" variant="primary" @click="sharee" :disabled="isLoading">
					{{ isLoading ? 'Processing...' : 'Bagikan' }}
				</b-button>
			</template>
		</b-modal>
		<b-modal id="modal-task" title="Bagikan tugas ke kelas">
			<form>
				<div class="form-group">
					<label>Tugas</label>
					<v-select label="title" :reduce="item => item.id" :options="tasks.data" v-model="task_id" :filterable="false" @search="onSearchTask">
						<template slot="no-options">
					    	Ketik untuk mencari tugas anda..
					    </template>
					</v-select>
				</div>
				<div class="form-group">
					<label>Body</label>
					<textarea class="form-control" v-model="task_body" placeholder="Tulis sedikit text">
						
					</textarea>
				</div>
			</form>
			<template v-slot:modal-footer="{ cancel }">
				<b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
					Cancel
				</b-button>
				<b-button size="sm" variant="primary" @click="submitshareeTask" :disabled="isLoading">
					{{ isLoading ? 'Processing...' : 'Bagikan' }}
				</b-button>
			</template>
		</b-modal>
	</div>
</template>
<script >
import { BButton } from 'bootstrap-vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import _ from 'lodash'

export default {
	name: 'ShareToClassroom',
	components: {
		BButton, VSelect
	},
	data() {
		return {
			lecture_id: '',
			body: '',
			task_id: '',
			task_body: ''
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated']),
		...mapState('lecture',['lectures']),
		...mapState('task',['tasks']),
	},
	methods: {
		...mapActions('lecture',['getDataLectures', 'shareeLectureToClassroom','getDataLectureClassroom']),
		...mapActions('task',['getDataTasks','shareeTask','getDataClassroomTasks']),
		async sharee() {
			try {
				await this.shareeLectureToClassroom({
					id: this.lecture_id,
					data: {
						classroom_id: this.$route.params.id,
						body: this.body
					}
				})
				await this.getDataLectureClassroom(this.$route.params.id)
				this.$bvModal.hide('modal-sharee')
				this.lecture_id = ''
				this.body = ''
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submitshareeTask() {
			try {
				await this.shareeTask({
					id: this.task_id,
					data: {
						classroom_id: this.$route.params.id,
						body: this.task_body
					}
				})
				await this.getDataClassroomTasks(this.$route.params.id)
				this.$bvModal.hide('modal-task')
				this.task_id = ''
				this.task_body = ''
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}	
		},
		onSearchLecture(search, loading) {
	      loading(true);
	      this.searchLecture(loading, search, this);
	    },
	    searchLecture: _.debounce((loading, search, vm) => {
	    	vm.getDataLectures({ perPage: 50, search: escape(search) })
	    	.then((res) => {
	    		loading(false)
	    	})
	    }, 350),
	    onSearchTask(search, loading) {
	      loading(true);
	      this.searchTask(loading, search, this);
	    },
	    searchTask: _.debounce((loading, search, vm) => {
	    	vm.getDataTasks({ perPage: 50, search: escape(search) })
	    	.then((res) => {
	    		loading(false)
	    	})
	    }, 350)
	},
	created() {
		
	}
}
</script>