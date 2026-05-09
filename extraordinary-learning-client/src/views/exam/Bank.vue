<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card mb-10">
				<div class="card-header p-4 d-flex justify-content-between">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon2-crisp-icons text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Banksoal
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Daftar banksoal</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline">
							<b-button variant="primary" v-b-modal.modal-create>
								<i class="flaticon2-add-square"></i>
								Tambah banksoal
							</b-button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<transition name="fade">
				<div class="col-md-8" v-if="typeof question_banks.data != 'undefined'">
					<table class="table table-borderless table-sm">
						<tr v-for="row in question_banks.data" :key="row.id">
							<td>
								<div class="card ">
									<div class="card-header p-0 d-flex justify-content-between">
										<div class="d-flex align-items-center">
											<b-button squared class="mr-1" variant="light-success" size="sm" @click="getData(row.id)" v-b-tooltip.hover title="Edit banksoal">
												<i class="flaticon2-contract"></i> Edit
											</b-button>
											<b-button squared class="mr-1" variant="light-warning" size="sm" @click="duplicateBank(row.id)" v-b-tooltip.hover title="Gandakan banksoal">
												<i class="flaticon2-copy"></i>
											</b-button>
											<b-button squared variant="light-danger" size="sm" @click="deleteData(row.id)" v-b-tooltip.hover title="Hapus banksoal">
												<i class="flaticon2-trash"></i>
											</b-button>
										</div>
									</div>
								</div>
								<div class="card" >
								  <div class="card-body p-4">
									  	<div class="d-flex align-items-center justify-content-between">
										    <div class="d-flex flex-column flex-grow-1">
												<a href="#" class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
													{{ row.code }}
												</a>
												<span class="text-muted font-weight-bold">{{ row.subject.name }}</span>
											</div>
											<div class="d-flex flex-column align-items-right">
												<div>
												<span class="badge bg-light-primary mr-1" v-if="row.mc_count > 0"><i class="flaticon2-list-2"></i> {{ row.mc_count }} [{{ row.percentage.mc }}%]</span>
												<span class="badge bg-light-success" v-if="row.esay_count > 0"><i class="flaticon2-list-3"></i> {{ row.esay_count }} [{{row.percentage.esay}}%]</span>
												</div>

											</div>
										</div>
										<router-link :to="{ name: 'exam.bank.questions', params: { id: row.id } }" class="stretched-link"></router-link>
									</div>
								</div>
							</td>
						</tr>
					</table>
					<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					    <b-pagination
					        v-model="page"
					        :total-rows="question_banks.total"
					        :per-page="question_banks.per_page"
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
							<span class="badge badge-primary">Total {{ question_banks.total }} data</span>
						</div>
					</div>
				</div>
				</transition>
				<transition name="fade">
				<div class="col-md-4" v-if="typeof question_banks.data != 'undefined'">
					<div class="alert alert-custom alert-light-primary fade show mb-5" role="alert">
                        <div class="alert-icon">
                            <i class="flaticon-warning"></i>
                        </div>
                        <div class="alert-text">
                            <strong>Peringatan</strong><br>
                            Kami tidak menyarankan untuk mengubah banksoal setelah digunakan untuk ujian, karena dapat berpengaruh kepada analisis, gunakan fitur gandakan banksoal
                        </div>
                        <div class="alert-close">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">
                                    <i class="ki ki-close"></i>
                                </span>
                            </button>
                        </div>
                    </div>
				</div>
				</transition>
			</div>
		</div>
		<b-modal id="modal-create" title="Banksoal" @hide="function() { $store.commit('question/CLEAR_QUESTION_BANK'); index_create = 0; $store.commit('CLEAR_ERROR') }" no-close-on-backdrop>
			<div v-if="index_create == 0">
				<div class="form-group">
					<label>Mata pelajaran</label>
					<v-select label="name" :reduce="item => item.id" :options="subjects" v-model="question_bank.subject_id">
					</v-select>
					<span class="text-danger" v-if="errors.subject_id">{{ errors.subject_id[0] }}</span>
				</div>
				<div class="form-group">
					<label>Nama banksoal</label>
					<input type="text" class="form-control" :class="{ 'is-invalid' : errors.code }" v-model="question_bank.code">
					<div class="invalid-feedback" v-if="errors.code">{{ errors.code[0] }}</div>
				</div>
				<div class="form-group">
					<label>Kopetensi Dasar</label>
					<input type="text" class="form-control" v-model="question_bank.standart" placeholder="Tulis nomor kompetensi (opsional)">
				</div>
			</div>
			<div v-if="index_create == 1">
				<div class="form-group">
					<label>Jumlah soal pilihan ganda</label>
					<div class="input-group">
						<div class="input-group-prepend" v-show="question_bank.mc_count > 0">
							<button class="btn btn-light-primary" type="button" @click="question_bank.mc_count -= 1">
								<strong>-</strong>
							</button>
						</div>
						<input type="number" class="form-control" :class="{ 'is-invalid' : errors.mc_count }" v-model.number="question_bank.mc_count">
						<div class="input-group-append">
							<button class="btn btn-light-success" type="button" @click="question_bank.mc_count += 1">
								<strong>+</strong>
							</button>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label>Jumlah soal esay</label>
					<div class="input-group">
						<div class="input-group-prepend" v-show="question_bank.esay_count > 0">
							<button class="btn btn-light-primary" type="button" @click="question_bank.esay_count -= 1">
								<strong>-</strong>
							</button>
						</div>
						<input type="number" class="form-control" :class="{ 'is-invalid' : errors.esay_count }" v-model.number="question_bank.esay_count">
						<div class="input-group-append">
							<button class="btn btn-light-success" type="button" @click="question_bank.esay_count += 1">
								<strong>+</strong>
							</button>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>% Pilihan ganda</label>
							<input type="number" class="form-control" v-model.number="question_bank.percentage.mc" @input="checkTotal">
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>% Esay</label>
							<input type="number" class="form-control" v-model.number="question_bank.percentage.esay" @input="checkTotal">
						</div>
					</div>
				</div>
				<div class="alert bg-light-primary" v-show="total_error">
					Total harus 100 !!!
				</div>
			</div>
			<template v-slot:modal-footer="{ cancel }">
				<b-button variant="secondary" size="sm" @click="cancel()" :disabled="isLoading" v-if="index_create == 0">
                	Cancel
             	</b-button>
				<b-button variant="secondary" size="sm" @click="index_create -= 1" :disabled="isLoading" v-if="index_create > 0">
					Sebelumnya
				</b-button>
				<b-button variant="primary" size="sm"  @click="index_create += 1" :disabled="isLoading" v-if="index_create < 1">
					Selanjutnya
				</b-button>
				<b-button variant="primary" size="sm"  @click="submit" :disabled="isLoading" v-if="!total_error && index_create == 1">
					{{ isLoading ? 'Processing...' : 'Simpan' }}
				</b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BDropdown, BDropdownItem, BPagination, BBadge } from 'bootstrap-vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
	name: 'ExamBank',
	components: {
		BButton, BDropdown, BDropdownItem, BPagination,BBadge,
		VSelect
	},
	data: () => ({
		perPage: 10,
		total_error: false,
		fields: [
			{ key: 'details', label: 'Detail' },
			{ key: 'code', label: 'Kode' },
			{ key: 'actions' }
		],
		index_create: 0
	}),
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('question', ['question_banks','question_bank']),
		...mapState('classroom', ['myclassrooms']),
		page: {
			get() {
				return this.$store.state.question.question_banks_page
			},
			set(val) {
				this.$store.commit('question/SET_QUESTION_BANKS_PAGE', val)
			}
		},
		subjects() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.subject.id)) {
					map.set(item.subject.id, true);
					result.push(item)
				}
			}
			return result.map(item =>{
				return {
					id: item.subject.id,
					name: item.subject.name
				}
			});
		},
	},
	methods: {
		...mapActions('question',['getDataQuestionBanks', 'createDataQuestionBank', 'getDataQuestionBank', 'deleteDataQuestionBank', 'updateDataQuestionBank', 'duplicateDataQuestionBank']),
		...mapActions('classroom', ['getDataClassromMine']),
		changeData() {
			this.getDataQuestionBanks({ perPage: this.perPage })
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		submit() {
			if(typeof this.question_bank.id != 'undefined') {
				this.updateDataQuestionBank()
				.then((res) => {
					this.$bvToast.toast('Banksoal diupdate', successToas())
					this.changeData()
					this.$bvModal.hide('modal-create')
				})
				.catch((error) => {
					this.$bvToast.toast(error.message, errorToas())
				})
				return;
			}
			this.createDataQuestionBank()
			.then((res) => {
				this.$bvToast.toast('Banksoal ditambahkan', successToas())
				this.changeData()
				this.$bvModal.hide('modal-create')
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		checkTotal() {
			let total = this.question_bank.percentage.mc + this.question_bank.percentage.esay
			this.total_error = total != 100 ? true : false
		},
		getData(id) {
			this.getDataQuestionBank(id)
			.then((res) => {
				this.$bvModal.show('modal-create')
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		deleteData(id) {
			this.$swal({
                title: 'Informasi',
                text: "Bnksoal akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if(result.value) {
            		try {
            			await this.deleteDataQuestionBank(id)
            			this.changeData()
            		} catch (error) {
            			this.$bvToast.toast(error.message, errorToas())
            		}
            	}
            })
		},
		duplicateBank(id) {
			this.$swal({
                title: 'Informasi',
                text: "Bnksoal akan digandakan beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if(result.value) {
            		try {
            			await this.duplicateDataQuestionBank(id)
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
		this.getDataClassromMine()
	},
	watch: {
		page() {
			this.changeData()
		},
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