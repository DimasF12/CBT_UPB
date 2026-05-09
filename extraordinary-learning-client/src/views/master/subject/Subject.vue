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
								Mata Pelajara
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage Mata pelajaran</span>
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
								Tambah matpel
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
											<input type="text" class="form-control" placeholder="Cari matpel..." id="kt_datatable_search_query" v-model="search"/>
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" v-if="typeof subjects.data != 'undefined'">
						<b-table 
						small
                        show-empty
                        :fields="fields"
                        :items="subjects.data"
                        >
                        	<template v-slot:cell(no)="row">
                        		<span style="width: 40px;"><span class="font-weight-bolder" v-text="subjects.from+row.index"></span></span>
                        	</template>
                        	<template v-slot:cell(name)="row">
                        		<div class="d-flex flex-column">
                        			<div  class="text-dark-75 font-weight-bolder font-size-lg mb-0">
                        				{{ row.item.name }}
                        			</div>
                        			<span class="text-muted font-weight-bold">{{ row.item.description }}</span>
                        		</div>
                        	</template>
                        	<template v-slot:cell(actions)="row">
                        		<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon">
									<template v-slot:button-content>
									    <span class="flaticon-squares-4"></span>
									</template>
									<b-dropdown-item  @click="getSubject(row.item.id)" >Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteSubject(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="subjects.total"
					        :per-page="subjects.per_page"
					        :disabled="isLoading"
					      ></b-pagination>
					      <div class="d-flex align-items-center py-3">
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
								<select class="form-control form-control-sm text-primary font-weight-bold mr-4 border-0 bg-light-primary" style="width: 75px;" v-model.int="perPage">
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
								<span class="badge badge-primary">Total {{ subjects.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Mata pelajaran"@hide="$store.commit('subject/CLEAR_FORM_SUBJECT')" no-close-on-backdrop>
			<form class="9">
				<div class="form-group">
					<label>
						Nama
					</label>
					<div>
						<input type="text" class="form-control" v-model="subject.name" :class="{ 'is-invalid' : errors.name }">
						<div class="invalid-feedback" v-if="errors.name">{{ errors.email[0] }}</div>
					</div>
				</div>
				<div class="form-group ">
					<label>
						Deskripsi
					</label>
					<div >
						<textarea  class="form-control" v-model="subject.description" :class="{ 'is-invalid' : errors.description }" placeholder="Optional"></textarea>
						<div class="invalid-feedback" v-if="errors.description">{{ errors.email[0] }}</div>
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

		<b-modal id="modal-import" title="Import matpel">
			<b-form-file
		      v-model="file"
		      :state="Boolean(file)"
		      placeholder="Choose a file excel or drop it here..."
		      drop-placeholder="Drop file here..."
		    ></b-form-file>
		    <a href="/download/format-import-subject.xlsx" download="">Download import format</a>
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
import { mapState, mapGetters, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem } from 'bootstrap-vue'
import _ from 'lodash'

export default {
	name: 'SubjectData',
	components: {
		BButton, BTable, BPagination, BFormFile, BDropdown, BDropdownItem
	},
	data() {
		return {
			perPage: 10,
			search: '',
			fields: [
				{ key: 'no', label: '#' },
				{ key: 'name', label: 'Nama' },
				{ key: 'actions', label: 'Aksi' }
			],
			file: null
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('subject', {
			subjects: state => state.subjects,
			subject: state => state.subject
		}),
		page: {
			get() {
				return this.$store.state.subject.page
			},
			set(val) {
				this.$store.commit('subject/SET_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('subject', ['getDataSubjects', 'createNewSubject', 'removeDataSubject', 'getDataSubject', 'updateDataSubject', 'importDataSubject']),
		async changeData() {
			try {
				await this.getDataSubjects({ perPage: this.perPage, search: this.search})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submit() {
			try {
				if(typeof this.subject.id != 'undefined') {
					await this.updateDataSubject()
				} else {
					await this.createNewSubject()
				}
				this.changeData()
				this.$bvModal.hide('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteSubject(id) {
			this.$swal({
                title: 'Informasi',
                text: "Mata pelajaran akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
                if (result.value) {
                   try {
                   		await this.removeDataSubject(id)
                   		this.changeData()
                   } catch (error) {
                   		this.$bvToast.toast(error.message, errorToas())
                   }
                }
            })
		},
		async getSubject(id) {
			try {
				await this.getDataSubject(id)
				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async upload() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)

				await this.importDataSubject(formData)
				this.$bvModal.hide('modal-import')
				this.file = null

				this.changeData()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())	
			}
		}
	},
	created() {
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