<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card mb-10">
				<div class="card-header pt-2 pl-4 pr-4 pb-2 d-flex justify-content-between">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon2-rectangular text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Soal
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage soal</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<router-link :to="{ name: 'exam.bank' }" class="btn btn-light-primary mr-2" v-b-tooltip.hover title="Kembali ke daftar banksoal">
							<i class="flaticon2-left-arrow-1"></i>Kembali
						</router-link>
						<b-dropdown  variant="link" toggle-class="text-decoration-none" no-caret>
							<template v-slot:button-content>
								<b-button variant="primary">
									<i class="flaticon2-add-square"></i>
									Tambah soal
								</b-button>
							</template>
							<b-dropdown-item  @click="addQuestion(1)">
								Pilihan ganda
							</b-dropdown-item>
							<b-dropdown-item @click="addQuestion(2)">
								Esay
							</b-dropdown-item>
							<b-dropdown-item v-b-modal.modal-import>
								Import dari file .docx
							</b-dropdown-item>
						</b-dropdown>
					</div>
				</div>
			</div>
			<div class="row">
				<transition name="fade">
				<div class="col-md-8" v-if="typeof questions.data != 'undefined'">
					<div class="card" v-for="(row,index) in questions.data">
						<div class="card-header p-4 pb-0">
							
					 		<div class="d-flex align-items-center">
					 			<b-button size="sm" variant="white" class="btn-icon" v-b-toggle="'question_'+row.id" v-b-tooltip.hover title="Toggle detail soal">
					 				<i class="flaticon2-circle-vol-2"></i>
					 			</b-button>
					 			<div class="d-flex flex-column flex-grow-1">
					 				<div>
					 					<span class="badge bg-light-danger mr-1">{{ questions.from + index }}</span>
										<span class="badge" :class="row.type == '1' ? 'badge-primary' : 'badge-success'">{{ row.type == '1' ? 'Pilihan ganda' : 'Esay' }}</span>
					 				</div>
								</div>
								<div>
									<b-button variant="light-warning" class="mr-1" size="sm" v-b-tooltip.hover title="Edit soal" @click="getData(row.id)"><small><i class="flaticon2-contract"></i> Edit</small></b-button>
									<b-button variant="light-danger" size="sm" v-b-tooltip.hover title="Hapus soal" @click="deleteData(row.id)"><small><i class="flaticon2-trash"></i></small></b-button>
								</div>
					 		</div>
						</div>
						<b-collapse :id="'question_'+row.id">
					 	<div class="card-body p-4">
							<div v-html="row.question">
							  	
							</div>
							<table class="table table-sm table-borderless" v-if="row.options != ''">
								<tr v-for="(option, index) in row.options" :key="index">
									<td width="20px">
										<i class="flaticon2-hexagonal text-success" v-if="option.correct == '1'"></i>
										<i class="flaticon2-hexagonal text-danger" v-if="option.correct == '0'"></i>
									</td>
									<td>
										<div v-html="option.body"></div>
									</td>
								</tr>
							</table>
						</div>
						</b-collapse>
					</div>
					<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					    <b-pagination
					      v-model="page"
					      :total-rows="questions.total"
					      :per-page="questions.per_page"
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
							<span class="badge badge-primary">Total {{ questions.total }} data</span>
						</div>
					</div>
				</div>
				</transition>
				<div class="col-md-4">
					<transition name="fade">
					<div class="card gutter-b" v-if="question_bank.subject_id != null">
						<div class="card-header p-4 border-0 pb-0">
							<div class="d-flex align-items-center mb-1">
								<div class="symbol symbol-40 symbol-light-primary mr-5">
									<span class="symbol-label">
										<i class="flaticon2-soft-icons-1 text-primary"></i>
									</span>
								</div>
								<div class="d-flex flex-column flex-grow-1">
									<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
										{{ question_bank.code }}
									</span>
									<div class="d-flex">
										<div class="d-flex align-items-center pr-5">
											<span class="svg-icon svg-icon-md svg-icon-primary">
											</span>
											<span class="text-muted font-weight-bold" v-if="typeof question_bank.subject != 'undefined'">{{ question_bank.subject.name }}</span>
										</div>
									</div>
								</div>
							</div>	
						</div>
						<div class="card-body p-4 pt-0">
							<span class="badge bg-light-primary mr-1" v-b-tooltip.hover title="Jumlah soal pilihan ganda" v-if="question_bank.mc_count > 0"><i class="flaticon2-list-2"></i> {{ question_bank.mc_count }} [{{ question_bank.percentage.mc }}%]</span>
							<span class="badge bg-light-success mr-1" v-if="question_bank.esay_count > 0" v-b-tooltip.hover title="Jumlah soal esay"><i class="flaticon2-list-3"></i> {{ question_bank.esay_count }} [{{question_bank.percentage.esay}}%]</span>
							<span class="badge bg-light-info" v-if="typeof questions.data != 'undefined'" v-b-tooltip.hover title="Jumlah soal yang telah dibuat">
								<i class="flaticon2-laptop"></i> {{ questions.total }}
							</span>
						</div>
					</div>	
					</transition>
					<transition name="fade">
					<div class="card gutter-b" v-if="typeof question_bank.standart_data != 'undefined' && question_bank.standart_data != null">
						<div class="card-body p-4">
							<strong>{{question_bank.standart_data.code }}</strong>
							<div v-html="question_bank.standart_data.body">

							</div>
						</div>
					</div>	
					</transition>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Soal" size="lg" @hide="$store.commit('question/CLEAR_QUESTION')" no-close-on-backdrop>
			<VuePerfectScrollbar
				style="max-height: 60vh;"
			>
			<div class="container">
				<FormQuestion />
			</div>
			</VuePerfectScrollbar>
			<template v-slot:modal-footer="{ ok, cancel, hide }">
		      	<b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        	Cancel
		      	</b-button>
				<b-button size="sm" variant="primary" @click="submit" :disabled="isLoading">
		        	{{ isLoading ? 'Processing...' : 'Simpan' }}
		      	</b-button>
			</template>
		</b-modal>
		<b-modal id="modal-import" title="Import soal" no-close-on-backdrop>
			<b-form-file
  			  accept=".docx"
			  v-model="file"
			  :state="Boolean(file)"
			  placeholder="Choose a file docx or drop it here..."
			  drop-placeholder="Drop file here..."
			></b-form-file>
			<a :href="baseURL+'/download/format-input-soal-doc.docx'" download>Download template import</a>
			<template v-slot:modal-footer="{ ok, cancel, hide }">
		      	<b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        	Cancel
		      	</b-button>
				<b-button size="sm" variant="primary" @click="submitFileImport" :disabled="isLoading">
		        	{{ isLoading ? 'Processing...' : 'Import' }}
		      	</b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BButton, BDropdown, BDropdownItem, BPagination, BCollapse, VBToggle, BOverlay,BFormFile  } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'
import FormQuestion from './FormQuestion'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
	name: 'ExamBankQuestion',
	components: {
		BButton, BDropdown, BDropdownItem,BPagination, BCollapse , VBToggle, FormQuestion, VuePerfectScrollbar, BOverlay, BFormFile
	},
	data: () => ({
		perPage: 10,
		fields: [
			{ key: 'details', label: 'Detail' },
			{ key: 'no', label: 'Tipe soal' },
			{ key: 'actions', label: 'Aksi' }
		],
		file: null
	}),
	computed: {
		...mapGetters(['isLoading','baseURL']),
		...mapState('question', ['questions', 'question', 'setting', 'question_bank']),
		page: {
			get() {
				return this.$store.state.question.questions_page
			},
			set(val) {
				this.$store.commit('question/SET_QUESTIONS_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('question', ['getDataQuestionBank','getDataQuestions', 'getDataQuestion', 'deleteDataQuestion', 'createDataQuestion', 'updateDataQuestion', 'importDataQuestionBank']),
		changeData() {
			this.getDataQuestions({ id: this.$route.params.id, perPage: this.perPage })
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		deleteData(id) {
			this.$swal({
                title: 'Informasi',
                text: "Soal akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!',
                showLoaderOnConfirm: true,
            }).then(async (result) => {
                if (result.value) {
                	try {
                		await this.deleteDataQuestion(id)
                		this.changeData()
                		this.$bvToast.toast('Soal berhasil dihapus', successToas())
                	} catch (error) {
                		this.$bvToast.toast(error.message, errorToas())
                	}
                }
            })
		},
		async addQuestion(type) {
			if(type === 1){
				this.$store.state.question.question.options = []
				for(let i = 0; i < this.setting.opsi_max; i++) {
					let option = ''
					this.$store.state.question.question.options.push(option)
				}
			} else {
				this.$store.state.question.question.type = 2	
			}
			this.$store.state.question.question.question_bank_id = this.$route.params.id
			await this.$bvModal.show('modal-create')

			let tag = document.getElementById("modal-create___BV_modal_content_")
			if(tag !== null) {
				tag.removeAttribute("tabindex");
			}
		},
		getData(id) {
			this.getDataQuestion(id)
			.then((res) => {
				this.$bvModal.show('modal-create')
				let tag = document.getElementById("modal-create___BV_modal_content_")
				if(tag !== null) {
					tag.removeAttribute("tabindex");
				}
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		async submit() {
			try {
				if (this.question.correct === null && this.question.type == 1) {
			        this.$swal({
			          title: 'Kunci jawaban kosong',
			          text: "Pilih jawaban yang benar",
			          icon: 'error',
			        })
			        return
			    }
			    if(typeof this.question.id != 'undefined') {
			    	await this.updateDataQuestion()
			    } else {
					await this.createDataQuestion()
			    }
				this.$bvToast.toast('Soal berhasil disimpan', successToas())
				
				this.$bvModal.hide('modal-create')
				this.changeData()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submitFileImport() {
			try {
				let formData = new FormData()
				formData.append('file', this.file)

				await this.importDataQuestionBank({
					id: this.$route.params.id,
					data: formData
				})
				this.$bvModal.hide('modal-import')
				this.changeData()
				this.$bvToast.toast('Soal berhasil diimport', successToas())
				this.file = null
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.changeData()
		this.getDataQuestionBank(this.$route.params.id)
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		page() {
			this.changeData()
		},
		perPage() {
			this.changeData()
		}
	},
	destroyed() {
		this.$store.state.question.questions = []
		this.$store.commit('question/CLEAR_QUESTION_BANK')
	}
}
</script>
<style>
	[tabindex="-1"]:focus:not(:focus-visible) { outline: 0 !important; }
</style>