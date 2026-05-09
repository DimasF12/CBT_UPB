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
								Jadwal ujian
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Daftar jadwal ujian</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline">
							<b-button variant="primary" v-b-modal.modal-create>
								<i class="flaticon2-add-square"></i>
								Tambah jadwal
							</b-button>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="table-responsive-md" v-if="typeof schedules.data != 'undefined'">
						<b-table :fields="fields"
						  show-empty
						  :items="schedules.data">
						  	<template v-slot:cell(details)="row">
								<b-button size="sm" variant="primary" class="btn-icon" @click="row.toggleDetails">
									<small>
										<i :class="row.detailsShowing ? 'flaticon-circle' : 'flaticon-plus'" class="text-white"></i>
									</small>
								</b-button>
							</template>
							<template v-slot:cell(name)="row">
								<span style="width: 250px;">
									<div class="d-flex flex-column flex-grow-1 font-weight-bold">
										<span class="text-dark mb-1 font-size-lg">
											{{ row.item.name }}
										</span>
										<span class="text-muted font-weight-bold">{{ row.item.question_bank.code }}</span>
									</div>
								</span>
							</template>
							<template v-slot:row-details="row">
								<div class="card">
									<div class="card-body p-2">
										<div class="table-responsive-md">
											<table class="table table-bordered mb-0">
												<tr>
													<td width="150px">Tanggal</td>
													<td>{{ row.item.date }}</td>
												</tr>
												<tr>
													<td>Tipe</td>
													<td>{{ row.item.type | exam_type }}</td>
												</tr>
												<tr>
													<td>Mulai</td>
													<td>{{ row.item.start_time }}</td>
												</tr>
												<tr>
													<td>Durasi</td>
													<td>{{ row.item.duration/60 }} Menit</td>
												</tr>
												<tr>
													<td>Setting</td>
													<td>
														<span class="badge mr-1" :class="row.item.setting.random_question == '1' ? 'badge-success' : 'badge-dark'">Acak soal</span>
														<span class="badge mr-1" :class="row.item.setting.random_option == '1' ? 'badge-success' : 'badge-dark'">Acak opsi</span>
													</td>
												</tr>
											</table>
										</div>
									</div>
								</div>
							</template>
							<template v-slot:cell(status)="row">
								<span class="switch">
									<label>
									<input type="checkbox" :value="true" v-model="row.item.isactive" @change="setStatus(row.item.id, row.item.isactive)"/>
									<span></span>
									</label>
								</span>
							</template>
							<template v-slot:cell(actions)="row">
								<div class="text-right">
									<b-button variant="light-primary" class="btn-icon" size="sm mr-1" :to="{ name: 'exam.schedule.check', params: { id: row.item.id }}" v-b-tooltip.hover title="Koreksi jawaban esay siswa"><i class="flaticon2-rectangular"></i></b-button>
									<b-button variant="light-primary" class="btn-icon" size="sm mr-1" :to="{ name: 'exam.schedule.point', params: { id: row.item.id }}" v-b-tooltip.hover title="Lihat hasil ulangan"><i class="flaticon2-crisp-icons"></i></b-button>
                        		<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon"  v-b-tooltip.hover title="Menu lainnya">
									<template v-slot:button-content>
									    <span class="flaticon-more text-secondary"></span>
									</template>
									<b-dropdown-item @click="getData(row.item.id)">Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteData(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
								</div>
                        	</template>
						</b-table>
						<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="schedules.total"
					        :per-page="schedules.per_page"
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
								<span class="badge badge-primary">Total {{ schedules.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-create" title="Jadwal ujian" @hide="function() { $store.commit('exam_schedule/CLEAR_SCHEDULE'); index_create = 0}" no-close-on-backdrop>
			<div v-if="index_create == 0">
				<div class="form-group">
					<label>Nama</label>
					<input type="text" class="form-control" v-model="schedule.name" :class="{ 'is-invalid' : errors.name }" placeholder="Nama ujian">
				</div>
				<div class="form-group">
					<label>Tipe ulangan</label>
					<v-select label="name" :reduce="item => item.id" :options="exam_types" v-model="schedule.type">
					</v-select>
					<span class="text-danger" v-if="errors.question_bank_id">{{ errors.question_bank_id[0] }}</span>
				</div>
				<div class="form-group">
					<label>Banksoal</label>
					<v-select label="code" :reduce="item => item.id" :options="question_banks.data" v-model="schedule.question_bank_id">
					</v-select>
					<span class="text-danger" v-if="errors.question_bank_id">{{ errors.question_bank_id[0] }}</span>
				</div>
				<div class="form-group">
					<label>Kelas</label>
					<v-select label="name" multiple :reduce="item => item.id" :options="classrooms" v-model="schedule.classrooms">
					</v-select>
					<span class="text-danger" v-if="errors.classrooms">{{ errors.classrooms[0] }}</span>
				</div>
			</div>
			<div v-if="index_create == 1">
				<div class="form-group">
					<label>Tanggal</label>
					<VueCtkDateTimePicker v-model="schedule.date" only-date format='YYYY-MM-DD' formatted='DD-MM-YYYY' label="Tanggal pelaksanaan" id="tanggal_pelaksanaan"/>
					<span class="text-danger" v-if="errors.date">{{ errors.date[0] }}</span>
				</div>
				<div class="form-group">
					<label>Waktu mulai</label>
					<VueCtkDateTimePicker v-model="schedule.start_time" only-time format='HH:mm' formatted='HH:mm' label="Waktu pelaksanaan" id="waktu_pelaksanaan"/>
					<span class="text-danger" v-if="errors.start_time">{{ errors.start_time[0] }}</span>
				</div>
				<div class="form-group">
					<label>Durasi</label>
					<input type="number" class="form-control" v-model.number="schedule.duration" :class="{ 'is-invalid' : errors.duration }" placeholder="Menit">
				</div>
			</div>
			<div v-if="index_create == 2">
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
								<label>Acak Soal</label>
									<span class="switch">
									<label>
									<input type="checkbox" value="1"  v-model="schedule.setting.random_question"/>
									<span></span>
									</label>
								</span>
							</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<div class="form-group">
								<label>Acak Opsi</label>
									<span class="switch">
									<label>
									<input type="checkbox" value="1"  v-model="schedule.setting.random_option"/>
									<span></span>
									</label>
								</span>
							</div>
							</div>
					</div>
				</div>
			</div>
			<template v-slot:modal-footer="{ cancel }">
		      <b-button size="sm" variant="secondary" @click="index_create -= 1" :disabled="isLoading" v-if="index_create > 0">
		        Sebelumnya
		      </b-button>
					<b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading" v-if="index_create == 0">
		        Cancel
		      </b-button>
		      <b-button size="sm" variant="primary" @click="submit" :disabled="isLoading" v-if="index_create == 2">
		        {{ isLoading ? 'Processing...' : 'Simpan' }}
		      </b-button>
					<b-button size="sm" variant="primary" @click="index_create += 1" v-if="index_create < 2">
						Selanjutnya
					</b-button>
		    </template>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BFormCheckbox, BPagination, BDropdown, BDropdownItem} from 'bootstrap-vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

export default {
	name: 'Schedule',
	components: {
		BButton, BFormCheckbox, BPagination, BDropdown, BDropdownItem, VSelect,
		VueCtkDateTimePicker
	},
	data: () => ({
		perPage: 10,
		fields: [
			{ key: 'details', label: '', thStyle: { display: 'none'} },
			{ key: 'name', label: '',thStyle: { display: 'none'} },
			{ key: 'status', label: '', thStyle: { display: 'none'} },
			{ key: 'actions', thStyle: { display: 'none'}}
		],
		index_create: 0,
		exam_types: [
			{ id: 0, name: 'Ulangan Rutin' },
			{ id: 1, name: 'Ulangan Harian' },
			{ id: 2, name: 'Ulangan Tengah Semester' },
			{ id: 3, name: 'Ulangan Akhir Semester' }
		]
	}),
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('exam_schedule', ['schedule','schedules']),
		...mapState('question', ['question_banks']),
		...mapState('classroom',['myclassrooms']),
		classrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result.map(item =>{
				return {
					id: item.classroom.id,
					name: item.classroom.name
				}
			});
		},
		page: {
			get() {
				return this.$store.state.exam_schedule.schedules_page
			},
			set(val) {
				this.$store.commit('exam_schedule/SET_SCHEDULES_PAGE', val)
			}
		}
	},
	filters: {
		exam_type(type) {
			let exam_types = [
				'Ulangan Rutin',
				'Ulangan Harian',
				'Ulangan Tengah Semester',
				'Ulangan Akhir Semester'
			]
			return exam_types[type];
		}
	},
	methods: {
		...mapActions('exam_schedule', ['getDataExamSchedules', 'getDataExamSchedule', 'deleteExamSchedule','createExamSchedule','updateExamSchedule', 'setExamScheduleStatus']),
		...mapActions('classroom', ['getDataClassromMine']),
		...mapActions('question',['getDataQuestionBanks']),
		changeData() {
			this.getDataExamSchedules({ perPage: this.perPage })
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		async submit() {
			try {
				if(typeof this.schedule.id != 'undefined') {
					await this.updateExamSchedule()
				} else {
					await this.createExamSchedule()
				}
				this.$bvModal.hide('modal-create')
				this.changeData()
				this.$bvToast.toast('Jadwal ujian berhasil disimpan', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteData(id) {
			this.$swal({
                title: 'Informasi',
                text: "Jadwal akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if(result.value) {
            		try {
            			await this.deleteExamSchedule(id)
            			this.changeData()
            		} catch (error) {
            			this.$bvToast.toast(error.message, errorToas())
            		}
            	}
            })
		},
		async getData(id) {
			try {
				await this.getDataExamSchedule(id)
				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		setStatus(id, status) {
			this.setExamScheduleStatus({
				id: id,
				isactive: (status == true ? 1 : 0)
			})
			.then((res) => {
				this.$bvToast.toast('Status berhasil diubah', successToas())
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	},
	created() {
		this.changeData()
		this.getDataQuestionBanks({ perPage: this.perPage })
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})

		this.getDataClassromMine()
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
	}
}
</script>
<style>
	.table > tbody > tr > td {
     vertical-align: middle;
}
</style>