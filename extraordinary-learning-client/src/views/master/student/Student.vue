<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon-user text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Peserta didik
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage peserta didik</span>
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
								Tambah peserta
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
											<input type="text" class="form-control" placeholder="Cari siswa..." id="kt_datatable_search_query" v-model="search"/>
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" v-if="typeof students.data != 'undefined'">
						<b-table 
                        id="table-transition-example" 
                        :tbody-transition-props="transProps"
                        show-empty
                        :fields="fields"
                        :items="students.data"
                        >
                        	<template v-slot:cell(no)="row">
                        		<span style="width: 40px;"><span class="font-weight-bolder" v-text="students.from+row.index"></span></span>
                        	</template>
                        	<template v-slot:cell(user)="row">
                        		<span style="width: 250px;">
                        			<div class="d-flex align-items-center">
                        				<div class="symbol symbol-40 symbol-light-primary symbol-sm flex-shrink-0">									
                        					<img class="" src="/media/users/100_13.jpg" alt="photo" v-if="row.item.details != null && typeof row.item.details.avatar != 'undefined' && row.item.settings.avatar != ''">
                        					<span class="symbol-label font-size-h4 font-weight-bold" v-else>{{ row.item.name.charAt(0) }}</span>								
                        				</div>								
                        				<div class="ml-4">									
                        					<div class="text-dark-75 font-weight-bold font-size-lg mb-0" v-text="row.item.name"></div>									
                        					<span class="text-muted" v-text="row.item.email"></span>								
                        				</div>							
                        			</div>
                        		</span>
                        	</template>
                        	<template v-slot:cell(actions)="row">
                        		<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon">
									<template v-slot:button-content>
									    <span class="flaticon-squares-4"></span>
									</template>
									<b-dropdown-item  @click="getUserData(row.item.id)" >Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteStudent(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="students.total"
					        :per-page="students.per_page"
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
								<span class="badge badge-primary">Total {{ students.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Siswa" @hide="$store.commit('user/CLEAR_STUDENT')">
			<form class="">
				<div class="form-group" v-if="typeof student.id == 'undefined'">
					<label>Kelas</label>
					<v-select label="name" :reduce="item => item.id" :options="classrooms.data" 
						v-model="student.classroom_id" :filterable="false" @search="onSearchClassroom">
						<template slot="no-options">
					    	Ketik untuk mencari kelas..
					    </template>
					</v-select>
				</div>
				<div class="form-group">
					<label>NIS</label>
					<input type="text" v-model="student.uid"  class="form-control">
				</div>
				<div class="form-group">
					<label>
						Nama
					</label>
					<div>
						<input type="text" class="form-control" v-model="student.name" :class="{ 'is-invalid' : errors.name }">
						<div class="invalid-feedback" v-if="errors.name">{{ errors.email[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Email
					</label>
					<div>
						<input type="email" class="form-control" v-model="student.email" :class="{ 'is-invalid' : errors.email }">
						<div class="invalid-feedback" v-if="errors.email">{{ errors.email[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Password
					</label>
					<div>
						<input type="password" class="form-control" v-model="student.password" :class="{ 'is-invalid' : errors.password }">
						<div class="invalid-feedback" v-if="errors.password">{{ errors.password[0] }}</div>
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
		<b-modal id="modal-import" title="Import peserta">
			<div class="form-group">
				<label>Kelas</label>
				<v-select label="name" :reduce="item => item.id" :options="classrooms.data" 
					v-model="classroom_id" :filterable="false" @search="onSearchClassroom">
					<template slot="no-options">
				    	Ketik untuk mencari kelas..
				    </template>
				</v-select>
			</div>
			<b-form-file
		      v-model="file"
		      :state="Boolean(file)"
		      placeholder="Choose a file excel or drop it here..."
		      drop-placeholder="Drop file here..."
		    ></b-form-file>
		    <a href="/download/format-import-student.xlsx" download="">Download import format</a>
			<template v-slot:modal-footer="{ cancel }">
		      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        Cancel
		      </b-button>
		      <b-button size="sm" variant="primary" @click="upload" :disabled="isLoading">
		        {{ isLoading ? 'Processing...' : 'Upload' }}
		      </b-button>
		    </template>
		</b-modal>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem } from 'bootstrap-vue'
import _ from 'lodash'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
	name: 'UserDataMaster',
	components: {
		BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem, VSelect
	},
	data() {
		return {
			transProps: {
              name: 'flip-list'
            },
			data: {
				name: '',
				email: '',
				password: '',
			},
			file: null,
	        perPage: 10,
			fields: [
				{ key: 'no', label: '#' },
				{ key: 'user', label: 'Peserta', shortable: true },
				{ key: 'uid', label: 'NIS' },
				{ key: 'actions', label: 'Aksi' }
			],
			classroom_id: '',
			search: ''
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('user',['student','students']),
		...mapState('classroom',['classrooms','classroom']),
		page: {
            get() {
                return this.$store.state.user.student_page
            },
            set(val) {
                this.$store.commit('user/SET_STUDENT_PAGE', val)
            }
        }
	},
	methods: {
		...mapActions('user', ['createNewStudent', 'getDataStudents','deleteUser', 'getStudent', 'updateStudent', 'importStudent']),
		...mapActions('classroom', ['getDataClassrooms']),
		changeData() {
			this.getDataStudents({ search: this.search, perPage: this.perPage })
		},
		clearForm() {
			this.data = {
				name: '',
				email: '',
				password: ''
			}
		},	
		async submit() {
			try {
				if(typeof this.student.id != 'undefined') {
					await this.updateStudent()
				} else {
					await this.createNewStudent(this.data)
				}
				this.changeData()
				this.$bvModal.hide('modal-create')
				this.clearForm()
				this.$store.commit('CLEAR_ERROR')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteStudent(id) {
			this.$swal({
                title: 'Informasi',
                text: "Peserta akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
                if (result.value) {
                   try {
                   		await this.deleteUser(id)
                   		this.changeData()
                   } catch (error) {
                   		this.$bvToast.toast(error.message, errorToas())
                   }
                }
            })
		},
		async getUserData(id) {
			try {
				await this.getStudent(id)

				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async upload() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)
				formData.append('classroom_id', this.classroom_id)

				await this.importStudent(formData)

				this.$bvModal.hide('modal-import')
				this.file = null

				this.changeData()
			} catch (error) {	
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		onSearchClassroom(search, loading) {
			loading(true)
			this.searchClassroom(loading, search, this)
		},
		searchClassroom: _.debounce((loading, search, vm) => {
			vm.getDataClassrooms({ perPage: 10, search: search})
			.then((res) => {
	    		loading(false)
	    	})
		}, 350)
	},
	async created() {
		try {
			this.changeData()
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	watch: {
		page() {
			this.changeData()
		},
		search:  _.debounce(function (value) {
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