<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-5">
					<div class="card card-custom">
						<div class="card-header flex-wrap border-0 pt-6 pb-0">
							<h3 class="card-title align-items-start flex-column">
								<span class="card-label font-weight-bolder text-dark">Mata Pelajaran</span>
								<span class="text-muted mt-1 font-weight-bold font-size-sm">Mata pelajaran saya</span>
							</h3>
							<div class="card-toolbar">
								<div class="dropdown dropdown-inline" data-toggle="tooltip" title="" data-placement="left" data-original-title="Quick actions">
									<b-button variant="primary" v-b-modal.modal-create class="font-weight-bolder font-size-sm">
										<span class="svg-icon svg-icon">
								          <inline-svg
								            class="svg-icon"
								            src="/media/svg/icons/Design/Flatten.svg"
								          />
								        </span>
										Tambah matpel
									</b-button>
								</div>
							</div>
						</div>
						<div class="card-body">
							<div class="d-flex align-items-center mb-10" v-for="subject in mysubjects">
								<div class="symbol symbol-40 symbol-light-primary mr-5">
									<div class="symbol-label">
										{{ subject.subject.name.charAt(0) }}
									</div>
								</div>
								<div class="d-flex flex-column flex-grow-1 font-weight-bold">
									<span class="text-dark mb-1 font-size-lg">{{ subject.subject.name }}</span>
								</div>
									 <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
									    <template v-slot:button-content>
									      <i class="flaticon-more-1"></i>
									    </template>
									    <b-dropdown-item @click="deleteSubject(subject.id)">Hapus</b-dropdown-item>
									</b-dropdown>
								</div>
							</div>
							<div class="d-flex align-items-center" v-if="isLoading">
								<div class="mr-2 text-muted">Loading...</div>
								<div class="spinner spinner-primary mr-10"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<b-modal id="modal-create" title="Tambah mata pelajaran">
				<div class="form-group">
					<label>Mata pelajaran</label>
					<select class="form-control form-control-lg form-control-solid" v-model="data.subject_id">
						<option v-for="subject in filteredSubjects" :value="subject.id">{{ subject.name }}</option>
					</select>
				</div>
				<template v-slot:modal-footer="{ cancel }">
			      <b-button size="sm" variant="primary" @click="submitNewSubject" :disabled="isLoading">
			        {{ isLoading ? 'Processing...' : 'Simpan' }}
			      </b-button>
			      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
			        Cancel
			      </b-button>
			    </template>
			</b-modal>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BButton, BDropdownItem, BDropdown } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'SubjectMe',
	components: {
		BButton, BDropdownItem, BDropdown
	},
	data() {
		return {
			data: {
				subject_id: null
			}
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('subject',['mysubjects','subjects']),
		filteredSubjects() {
			if(typeof this.subjects.data != 'undefined') {
				let mysubjects = this.mysubjects.map(item => item.subject_id)
				let subjects = this.subjects.data.filter(item => mysubjects.indexOf(item.id) == -1)
				return subjects
			}
			return []
		}
	},
	methods: {
		...mapActions('subject',['getDataSubjectsMine', 'getDataSubjects', 'removeDataSubjectMe', 'createNewSubjectMine']),
		changeData() {
			this.getDataSubjectsMine()
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		submitNewSubject() {
			this.createNewSubjectMine(this.data)
			.then((res) => {
				this.$bvModal.hide('modal-create')
				this.data.subject_id = null
				this.changeData()
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
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
                		await this.removeDataSubjectMe(id)

                		this.changeData()
                	} catch (error) {
                		this.$bvToast.toast(error.message, errorToas())
                	}
                }
            })
		}
	},
	created() {
		this.changeData()

		this.getDataSubjects({ perPage: 200 }) 
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>