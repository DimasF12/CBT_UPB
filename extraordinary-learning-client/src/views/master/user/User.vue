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
								Guru
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage guru sekolah anda</span>
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
								Tambah guru
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
											<input type="text" class="form-control" placeholder="Cari guru..." id="kt_datatable_search_query" v-model="search"/>
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" v-if="typeof teachers.data != 'undefined'">
						<b-table 
                        id="table-transition-example" 
                        :tbody-transition-props="transProps"
                        show-empty
                        :fields="fields"
                        :items="teachers.data"
                        >
                        	<template v-slot:cell(no)="row">
                        		<span style="width: 40px;"><span class="font-weight-bolder" v-text="teachers.from+row.index"></span></span>
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
                        		<b-dropdown  variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon">
									<template v-slot:button-content>
									    <span class="flaticon-squares-4"></span>
									</template>
									<b-dropdown-item  @click="getUserData(row.item.id)" >Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteTeacher(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="teachers.total"
					        :per-page="teachers.per_page"
					        :disabled="isLoading"
					      ></b-pagination>
					      <div class="d-flex align-items-center py-3">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
								<select class="form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary" style="width: 75px;" v-model="perPage">
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
								<span class="badge badge-primary">Total {{ teachers.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Guru" @hide="$store.commit('user/CLEAR_USER')">
			<form class="">
				<div class="form-group">
					<label>NIP</label>
					<input type="text"  class="form-control" v-model="user.uid">
				</div>
				<div class="form-group">
					<label>
						Nama
					</label>
					<div>
						<input type="text" class="form-control" v-model="user.name" :class="{ 'is-invalid' : errors.name }">
						<div class="invalid-feedback" v-if="errors.name">{{ errors.email[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label >
						Email
					</label>
					<div>
						<input type="email" class="form-control" v-model="user.email" :class="{ 'is-invalid' : errors.email }">
						<div class="invalid-feedback" v-if="errors.email">{{ errors.email[0] }}</div>
					</div>
				</div>
				<div class="form-group">
					<label>
						Password
					</label>
					<div>
						<input type="password" class="form-control" v-model="user.password" :class="{ 'is-invalid' : errors.password }">
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
		<b-modal id="modal-import" title="Import guru">
			<b-form-file
		      v-model="file"
		      :state="Boolean(file)"
		      placeholder="Choose a file excel or drop it here..."
		      drop-placeholder="Drop file here..."
		    ></b-form-file>
		    <a href="/download/format-import-user.xlsx" download>Download format import</a>
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
import { BButton, BTable, BPagination, BFormFile, BFormCheckbox, BDropdown, BDropdownItem } from 'bootstrap-vue'
import _ from 'lodash'

export default {
	name: 'UserDataMaster',
	components: {
		BButton, BTable, BPagination, BFormFile, BFormCheckbox, BDropdown, BDropdownItem
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
				{ key: 'user', label: 'User', shortable: true },
				{ key: 'id', label: 'ID' },
				{ key: 'uid', label: 'NIP' },
				{ key: 'actions', label: 'Aksi' }
			],
			search: '',
			user_id: 0
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('user', {
			teachers: state => state.teachers,
			user: state => state.user
		}),
		page: {
            get() {
                return this.$store.state.user.page
            },
            set(val) {
                this.$store.commit('user/SET_PAGE', val)
            }
        }
	},
	methods: {
		...mapActions('user', ['createNewTeacher', 'getTeacherDataTable', 'deleteUser', 'getUser', 'updateUser', 'importTeacher']),	
		async submit() {
			try {
				if(typeof this.user.id != 'undefined') {
					await this.updateUser()
				} else {
					await this.createNewTeacher()
				}
				this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
				this.$bvModal.hide('modal-create')
				this.$store.commit('CLEAR_ERROR')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteTeacher(id) {
			this.$swal({
                title: 'Informasi',
                text: "User akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
                if (result.value) {
                   try {
                   		await this.deleteUser(id)
                   		this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
                   } catch (error) {
                   		this.$bvToast.toast(error.message, errorToas())
                   }
                }
            })
		},
		async getUserData(id) {
			try {
				await this.getUser(id)

				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async upload() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)

				await this.importTeacher(formData)

				this.$bvModal.hide('modal-import')
				this.file = null

				this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
			} catch (error) {	
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	async created() {
		try {
			 this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	watch: {
		page() {
			this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
		},
		search:  _.debounce(function (value) {
            this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
        }, 500),
		perPage() {
			this.getTeacherDataTable({ search: this.search, perPage: this.perPage })
		}
	}
}
</script>
<style>
	.table > tbody > tr > td {
     vertical-align: middle;
}
</style>