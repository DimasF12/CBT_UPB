<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
						<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon2-crisp-icons text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Koreksi tugas
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Koreksi tugas siswa</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="form-group">
							<router-link :to="{ name: 'task.index' }" class="btn btn-light-primary mr-2">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="mb-10">
						<div class="row align-items-center">
							<div class="col-lg-9 col-xl-8">
								<div class="row align-items-center">
									<div class="col-md-5 my-2 my-md-0">
											<v-select label="name" :reduce="item => item.id" :options="classrooms" v-model="classroom_id">

											</v-select>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md"  v-if="classroom_id !=  '' && classroom_id != null && classroom_submit_tasks.length !== 0">
						<b-table 
                        id="table-transition-example" 
                        show-empty
                        :fields="fields"
                        :items="classroom_submit_tasks"
                        >
                        	<template v-slot:cell(name)="row">
                        		<span @click.prevent="showData(row.item.id)" role="button">
                        			<div class="d-flex align-items-center">
                        				<div class="d-flex flex-column">
                        					<a href="#" @click.prevent="showData(row.item.id)" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-0" v-text="row.item.student.name"></a>
                        					<span class="text-muted" >{{ row.item.created_at }}</span>
                        				</div>
                        			</div>
                        		</span>
                        	</template>
                        	<template v-slot:cell(actions)="row">
														<div class="text-right">

															<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon">
										<template v-slot:button-content>
												<span class="flaticon-more text-secondary"></span>
										</template>
										<b-dropdown-item @click="showData(row.item.id)">Lihat</b-dropdown-item>
										<b-dropdown-item @click="deleteAssignment(row.item.id)">Hapus</b-dropdown-item>
									</b-dropdown>
														</div>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
                    		<div class="d-flex align-items-center py-3">
							<span class="badge badge-primary mr-1">Total {{ classroom_submit_tasks.length }} data</span>
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
							</div>
                    	</div>
					</div>
						<p class="text-muted" v-if="classroom_id != '' && classroom_id != null && classroom_submit_tasks.length == 0">Tidak ada tugas yang dapat dikoreksi saat ini atau siswa belum ada yang mengumpulkan</p>
											<p class="text-muted" v-if="classroom_id == '' || classroom_id == null"><i class="flaticon2-information"></i> Pilih kelas yang ingin ditampilkan</p>
				</div>
			</div>
			<b-modal id="modal-assign" title="Tugas siswa" size="lg">
				<VuePerfectScrollbar
			      style="max-height: 60vh; position: relative;"
			    >
			    	<div  v-if="typeof use_data.content != 'undefined'">
						<div v-for="file in use_data.content.file" :key="file.id">
							<img :src="`${baseURL}/storage/attachment/${file}`" class="img-thumbnail"  v-if="file.match(/jpg.*/) || file.match(/png.*/)">
							<a :href="`${baseURL}/storage/attachment/${file}`" target="_blank" v-else>{{ file }}</a>
						</div>
			    	</div>
			    	<div v-if="typeof use_data.content != 'undefined' && use_data.content.type == 'text'" v-html="use_data.content.body">
			    		
			    	</div>
				</VuePerfectScrollbar>
				<div class="form-group mb-3 mt-5">
				  <input type="number" :min="0" :max="100" class="form-control" placeholder="Nilai: 0 - 100" v-model.number="point">
				</div>
				<template v-slot:modal-footer="{ cancel }">
			      <b-button size="sm" variant="primary" @click="submit" :disabled="isLoading">
			        {{ isLoading ? 'Processing...' : 'Simpan' }}
			      </b-button>
			    </template>
			</b-modal>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { errorToas, successToas } from '@/core/entities/notif'
import { BButton, BDropdown, BDropdownItem} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
	name: 'TaskCheck',
	components: {
		BButton, BDropdown, BDropdownItem, VuePerfectScrollbar, VSelect
	},
	data: () => ({
		classroom_id: '',
		fields: [
			{ key: 'name', thStyle: { display: 'none' }},
			{ key: 'actions', thStyle: { display: 'none'} }
		],
		use_data: {},
		point: 0
	}),
	computed: {
		...mapGetters(['isLoading','baseURL']),
		...mapState('task', ['classroom_submit_tasks']),
		...mapState('classroom', ['myclassrooms']),
		classrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result.map(item => ({
				id: item.classroom.id,
				name: item.classroom.name
			}));
		},
	},
	methods: {
		...mapActions('task', ['getDataUncheckedTask', 'deleteDataStudentTask', 'createNewTaskResult']),
		...mapActions('classroom', ['getDataClassromMine']),
		deleteFromList(id) {
			let index = this.classroom_submit_tasks.map(item => item.id).indexOf(id)
			this.classroom_submit_tasks.splice(index, 1)
		},
		getData() {
			this.getDataUncheckedTask({ 
				task_id: this.$route.params.id,
				classroom_id: this.classroom_id
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		deleteAssignment(id) {
			this.$swal({
                title: 'Informasi',
                text: "Tugas siswa akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if(result.value) {
            		try {
            			await this.deleteDataStudentTask(id)
            			let index = this.classroom_submit_tasks.map(item => item.id).indexOf(id)
            			this.classroom_submit_tasks.splice(index,1)
            		} catch (error) {
            			this.$bvToast.toast(error.message, errorToas())
            		}
            	}
            })
		},
		showData(id) {
			let index = this.classroom_submit_tasks.map(item => item.id).indexOf(id)
			this.use_data = this.classroom_submit_tasks[index]
			this.$bvModal.show('modal-assign')
		},
		async submit() {
			try {
				await this.createNewTaskResult({
					student_task_id: this.use_data.id,
					point: this.point
				})
				this.$bvModal.hide('modal-assign')
				this.point = 0
				this.deleteFromList(this.use_data.id)
				this.$bvToast.toast('Nilai berhasil disimpan', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.getDataClassromMine()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		classroom_id(val) {
			if(val != '' && val != null) {
				this.getData()
			}
		}
	}
}
</script>