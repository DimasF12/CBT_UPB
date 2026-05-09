<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon-home-2 text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Kelas
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage Kelas</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline" data-toggle="tooltip" title="" data-placement="left" data-original-title="Quick actions">
							<b-button variant="light-primary" v-b-modal.modal-import class="font-weight-bolder font-size-sm mr-2">
								<i class="flaticon-upload-1"></i>
								Import
							</b-button>
							<b-button variant="primary" v-b-modal.modal-create class="font-weight-bolder font-size-sm">
								<i class="flaticon2-add-square"></i>
								Tambah kelas
							</b-button>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="mb-10">
						<div class="row align-items-center">
							<div class="col-lg-9 col-xl-8">
								<div class="row align-items-center">
									<div class="col-md-4 my-2 my-md-0">
										<div class="input-icon">
											<input type="text" class="form-control" placeholder="Cari kelas..." id="kt_datatable_search_query" v-model="search"/>
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" v-if="typeof classrooms.data != 'undefined'">
						<b-table 
                        show-empty
                        :fields="fields"
                        :items="classrooms.data"
                        >
                        	<template v-slot:cell(no)="row">
                        		<span style="width: 40px;"><span class="font-weight-bolder" v-text="classrooms.from+row.index"></span></span>
                        	</template>
                        	<template v-slot:cell(classroom)="row">
                        		<span style="width: 250px;">
                        			<div class="d-flex align-items-center">
                        				<div class="symbol symbol-40 symbol-light-primary symbol-sm flex-shrink-0">					
                        					<span class="symbol-label font-size-h4 font-weight-bold">{{ row.item.grade }}</span>								
                        				</div>								
                        				<div class="ml-4 d-flex flex-column">									
                        					<router-link :to="{ name: 'master.classroom.dashboard', params: { id: row.item.id }}" v-b-tooltip.hover title="Ke lobi kelas" class="text-dark-75 font-weight-bold text-hover-primary font-size-lg mb-0" v-text="row.item.name"></router-link>				
                        					<span class="text-muted" v-text="row.item.group"></span>	
                        				</div>							
                        			</div>
                        		</span>
                        	</template>
                        	<template v-slot:cell(actions)="row">
                        		<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret class="bg-hover-light-primary rounded-pill btn-icon" >
									<template v-slot:button-content>
									    <span class="flaticon-squares-4"></span>
									</template>
									<b-dropdown-item  @click="getClassroom(row.item.id)" >Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteClassroom(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="classrooms.total"
					        :per-page="classrooms.per_page"
					        :disabled="isLoading"
					      ></b-pagination>
					      <div class="d-flex align-items-center py-3">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
								<select class="form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary" style="width: 75px;" v-model.number="perPage">
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
					    		<span class="badge badge-primary">Total {{ classrooms.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Kelas" @hide="$store.commit('classroom/CLEAR_CLASSROOM')">
			<form class="">
				<div class="form-group">
					<label>
						Nama
					</label>
					<div>
						<input type="text" class="form-control" v-model="classroom.name" :class="{ 'is-invalid' : errors.name }">
						<div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Grade
					</label>
					<div>
						<input type="number" class="form-control" v-model.number="classroom.grade" :class="{ 'is-invalid' : errors.grade }">
						<div class="invalid-feedback" v-if="errors.grade">{{ errors.grade[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Group
					</label>
					<div>
						<input type="TEXT" class="form-control" v-model="classroom.group" :class="{ 'is-invalid' : errors.group }">
						<div class="invalid-feedback" v-if="errors.group">{{ errors.group[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Wali kelas
					</label>
					<div>
						<select class="form-control" v-model="classroom.teacher_id">
							<option :value="teacher.id" v-for="teacher in teachers.data" :key="teacher.id">{{ teacher.name }}</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<label>
						Telegram ID
					</label>
					<div>
						<input type="text" class="form-control" v-model="classroom.settings.telegram_id">
					</div>
				</div>
			</form>
			<template v-slot:modal-footer="{ cancel }">
		      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        Cancel
		      </b-button>
		      <b-button size="sm" variant="primary" @click="submit" :disabled="isLoading">
		        {{ isLoading ? 'Processing...' : 'Simpan' }}
		      </b-button>
		    </template>
		</b-modal>
		<b-modal id="modal-import" title="Import kelas">
			<b-form-file
		      v-model="file"
		      :state="Boolean(file)"
		      placeholder="Choose a file excel or drop it here..."
		      drop-placeholder="Drop file here..."
		    ></b-form-file>
		    <a href="/download/format-import-classroom.xlsx" download="">Download import format</a>
			<template v-slot:modal-footer="{ cancel }">
		      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        Cancel
		      </b-button>
		      <b-button size="sm" variant="primary" @click="importDataClassroom" :disabled="isLoading">
		        {{ isLoading ? 'Processing...' : 'Upload' }}
		      </b-button>
		    </template>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem } from 'bootstrap-vue'
import _ from 'lodash'

export default {
	name: 'ClassroomData',
	components: {
		BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem
	},
	data() {
		return {
			perPage: 10,
			search: '',
			fields: [
				{ key: 'no', label: '#' },
				{ key: 'classroom', label: 'Nama' },
				{ key: 'actions', label: 'Aksi' }
			],
			file: null
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('classroom',['classrooms','classroom']),
		...mapState('user', ['teachers']),
		page: {
			get() {
				return this.$store.state.classroom.page
			},
			set(val) {
				this.$store.commit('classroom/SET_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('classroom', ['getDataClassrooms', 'getDataClassroom', 'createNewClassroom', 'deleteDataClassroom', 'importClassroom', 'updateDataClassroom']),
		...mapActions('user', ['getTeacherDataTable']),
		async changeData() {
			try {
				await this.getDataClassrooms({ perPage: this.perPage, search: this.search})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submit() {
			try {
				if(typeof this.classroom.id != 'undefined') {
					await this.updateDataClassroom()
				} else {
					await this.createNewClassroom()
				}
				this.changeData()
				this.$bvModal.hide('modal-create')
				this.$bvToast.toast('Kelas berhasil disimpan', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteClassroom(id) {
			this.$swal({
                title: 'Informasi',
                text: "Kelas akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
                if (result.value) {
					try {
						await this.deleteDataClassroom(id)
						this.changeData()
					} catch (error) {
						this.$bvToast.toast(error.message, errorToas())
					}
                }
            })
		},
		async getClassroom(id) {
			try {
				await this.getDataClassroom(id)

				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async importDataClassroom() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)

				await this.importClassroom(formData)
				this.$bvModal.hide('modal-import')
				this.file = null
				this.changeData()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.getTeacherDataTable({ perPage: 200 })
		this.changeData()
	},
	watch: {
		page() {
			this.changeData()
		},
		search: _.debounce(function(value) {
			this.changeData()
		}, 500),
		perPage() {
			this.changeData()
		}
	}
}
</script>
<style>
	.table > tbody > tr > td {
     vertical-align: middle;
}
</style>