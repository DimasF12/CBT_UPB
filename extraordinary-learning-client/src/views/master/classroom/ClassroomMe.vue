<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card mb-10">
				<div class="card-header p-4 d-flex justify-content-between">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon-clipboard text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Kelas saya
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Kelas saya mengajar</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline">
							<b-button variant="primary" v-b-modal.modal-create>
								<i class="flaticon2-add-square"></i>
								Tambah kelas
							</b-button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-8" v-if="filteredClassrooms.length == 0">
							<div class="">
								<p class="text-muted 5 font-size-lg font-weight-normal pt-5 mb-2">Tidak ada kelas, silakan tambah kelas anda mengajar terlebih dahulu</p>
							</div>
						</div>
						<div class="col-md-8" v-for="(classroom, index) in filteredClassrooms" :key="index">
							<div class="card">
								<div class="card-header p-0 d-flex justify-content-between">
									<div class="d-flex align-items-center">
										<b-button squared variant="light-primary" size="sm" :disabled="isLoading" @click="manageClassroom(classroom.classroom.id)" v-b-tooltip.hover title="Manage" >
											<i class="flaticon-list-2"></i> Manage
										</b-button>
										<b-button squared variant="light-success" size="sm" v-if="typeof authenticated.classroom != 'undefined' && authenticated.classroom.id == classroom.classroom.id" @click="getStudents(authenticated.classroom.id)" :disabled="isLoading" v-b-tooltip.hover title="Daftar siswa kelas" >
											<i class="flaticon-user"></i> Siswa kelas
										</b-button>
										<b-button squared variant="light-info" size="sm" v-b-tooltip.hover title="Ke lobi kelas" :to="{ name: 'master.classroom.dashboard', params: { id: classroom.classroom_id }}" >
											<i class="flaticon-home-2"></i> Dashboard
										</b-button>
									</div>
								</div>
							</div>
							<div class="card" >
								<div class="card-body p-4 ribbon ribbon-clip ribbon-right">
									<div class="ribbon-target" style="top: 5px;" v-if="typeof authenticated.classroom != 'undefined' && authenticated.classroom.id == classroom.classroom.id">
										<span class="ribbon-inner bg-primary"></span>Wali kelas
									</div>
									<div class="d-flex align-items-center">
										<div class="d-flex flex-column flex-grow-1 font-weight-bold">
											<span class="text-dark mb-1 font-size-lg">
												{{ classroom.classroom.name }}
											</span>
										</div>
									</div>
									<router-link :to="{ name: 'master.classroom.dashboard', params: { id: classroom.classroom_id }}" class="stretched-link"></router-link>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="alert alert-custom alert-light-primary fade show mb-5" role="alert">
							<div class="alert-icon">
								<i class="flaticon-info"></i>
							</div>
							<div class="alert-text">
								<strong>Informasi</strong><br>
							Klik manage untuk mengatur jadwal dan laporam absensi
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
					</div>
				</div>
				
			</div>
		</div>
		<b-modal id="modal-create" title="Kelas">
			<AddClassroom />
			<template v-slot:modal-footer="{ cancel }">
		    <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		      Cancel
		    </b-button>
		    <b-button size="sm" variant="primary" @click="submit" :disabled="isLoading">
		      {{ isLoading ? 'Processing...' : 'Simpan' }}
		    </b-button>
		  </template>
		</b-modal>
		<b-modal id="modal-manage" title="Manage" @hide="classroomSubject = []" size="xl" hide-footer>
			<table class="table table-bordered">
				<tbody>
					<tr v-for="(classroom,index) in classroomSubject" :key="classroom.id">
						<td width="40px">{{ index + 1 }}</td>
						<td>{{ classroom.subject.name }}</td>
						<td>
							<b-button class="mr-1" variant="light-success" size="sm" @click="getSchedules(classroom.id)" v-b-tooltip.hover title="Daftar jadwal" :disabled="isLoading">
								<i class="flaticon-list-2"></i> Jadwal
							</b-button>
							<b-button class="mr-1" variant="light-warning" size="sm" @click="modalAbsent(classroom.id)" v-b-tooltip.hover title="Laporan absensi" :disabled="isLoading">
								<i class="flaticon-interface-10"></i> Laporan
							</b-button>
							<b-button variant="light-danger" size="sm" @click="deleteClassroomSubject(classroom.id)" v-b-tooltip.hover title="Hapus kelas" :disabled="isLoading">
								<i class="flaticon2-trash"></i> Hapus
							</b-button>
						</td>
					</tr>
				</tbody>
			</table>
			<span class="badge badge-primary">Total {{ classroomSubject.length }} data</span>
		</b-modal>
		<b-modal id="modal-schedule" size="lg" title="Jadwal" @hide="id_show = null">
			<template v-slot:modal-header="{  }">
		    <b-button variant="primary" @click="addSchedule(id_show)">
					<i class="flaticon2-add-square"></i> Tambah jadwal
				</b-button>
		  </template>
			<ClassroomSchedule />
			<template v-slot:modal-footer="{ cancel }">
				<b-button size="sm" variant="secondary" @click="cancel()">
			    Tutup
			  </b-button>
			</template>
		</b-modal>
		<b-modal id="modal-schedule-add" title="Jadwal" @hide="$store.commit('classroom/CLEAR_SCHEDULE')" no-close-on-backdrop>
			<ClassroomScheduleAdd />
			<template v-slot:modal-footer="{ cancel }">
			  <b-button size="sm" variant="secondary" @click="cancel()">
			    Cancel
			  </b-button>
				<b-button size="sm" variant="primary" @click="submitSchedule" :disabled="isLoading">
			    {{ isLoading ? 'Processing...' : 'Simpan' }}
			  </b-button>
			</template>
		</b-modal>
		<b-modal id="modal-report-abcent" title="Laporan absensi" size="xl">
			<template v-slot:modal-header>
				<div class="input-icon">
					<select class="form-control" v-model="schedule_show_id">
						<option :value="schedule.id" v-for="schedule in schedules" :key="schedule.id">
							{{ schedule.day | dayIndex }} ({{ schedule.from_time.substring(0, 5) }} - {{ schedule.end_time.substring(0,5) }})
						</option>
					</select>
					<span>
						<i class="flaticon-calendar text-muted"></i>
					</span>
				</div>
				<div v-if="schedule_show_id != ''">
					<b-dropdown  variant="link" toggle-class="text-decoration-none" no-caret>
						<template v-slot:button-content>
							<b-button variant="light-primary" class="font-weight-bolder font-size-sm">
								<i class="flaticon-file-2"></i>
								Export/Cetak
							</b-button>
						</template>
						<b-dropdown-item @click="print">Cetak/Pdf</b-dropdown-item>
						<b-dropdown-item @click="download">Download excel</b-dropdown-item>
					</b-dropdown>
					<b-button v-b-modal.modal-1 variant="primary" v-b-tooltip.hover title="Fitler tanggal absensi">
						<i class="flaticon-calendar"></i> Filter tanggal
					</b-button>
				</div>
			</template>
			<ClassroomAbcentReport />
			<template v-slot:modal-footer="{ cancel }">
			  <b-button size="sm" variant="secondary" @click="cancel()">
			    Tutup
			  </b-button>
			</template>
		</b-modal>
		<b-modal id="modal-1" title="Filter tanggal" hide-footer>
			<div class="form-group">
				<label>Tanggal</label>
				<div class="input-group mb-3">
					<input type="date" class="form-control" v-model="date_report"  name="">
					<div class="input-group-append">
						<button class="btn btn-primary" type="button" @click="filterDate" :disabled="isLoading">
							{{ isLoading ? 'Processing...' : 'Filter' }}
						</button>
					</div>
				</div>
			</div>
		</b-modal>
		<b-modal id="modal-student" title="Siswa kelas" hide-footer size="xl">
			<ClassroomStudents />
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BButton, BDropdownItem, BDropdown } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import _ from 'lodash'

import AddClassroom from '@/components/classroom/teacher/AddClassroom'
import ClassroomSchedule from '@/components/classroom/teacher/ClassroomSchedule'
import ClassroomScheduleAdd from '@/components/classroom/teacher/ClassroomScheduleAdd'
import ClassroomAbcentReport from '@/components/classroom/teacher/ClassroomAbcentReport'
import ClassroomStudents from '@/components/classroom/teacher/ClassroomStudents'

export default {
	name: 'SubjectMe',
	components: {
		BButton, BDropdownItem, BDropdown,
		VueCtkDateTimePicker, VSelect, VuePerfectScrollbar,
		AddClassroom, ClassroomSchedule, ClassroomScheduleAdd, ClassroomAbcentReport, ClassroomStudents
	},
	data() {
		return {
			data: {
				subject_id: null,
				classroom_id: null,
			},
			classroomSubject: [],
			days: [
				{ id: 1, name: 'Senin' },
				{ id: 2, name: 'Selasa' },
				{ id: 3, name: 'Rabu' },
				{ id: 4, name: 'Kamis' },
				{ id: 5, name: 'Jumat' },
				{ id: 6, name: 'Sabtu' }
			],
			reasons: [
				"-",
				"Tanpa keterangan",
				"Sakit",
				"Izin",
				"Masalah"
			],
			id_show: null,
			schedule_show_id: '',
			date_report: null,
			uid: ''
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('classroom',['myclassrooms', 'classrooms', 'schedule', 'schedules', 'students']),
		...mapState('subject', ['subjects']),
		...mapState('user', ['authenticated']),
		...mapState('abcent', ['abcents']),
		filteredClassrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result;
		},
	},
	methods: {
		...mapActions('classroom', ['getDataClassromMine','getDataClassrooms', 'createNewClassroomSubject', 'deleteDataClassroomSubject', 'updateDataSchedule', 'createDataSchedule', 'getDataSchedules', 'getDataSchedule', 'deleteDataSchedule', 'getDataStudents', 'addUserToClassroom', 'deleteUserFromClassroom']),
		...mapActions('subject', ['getDataSubjects']),
		...mapActions('abcent', ['getAbcentToday', 'downloadExcel']),
		clearForm() {
			this.data = {
				subject_id: null,
				classroom_id: null
			}
		},
		async changeData() {
			try {
				await this.getDataClassromMine()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submit() {
			try {
				await this.createNewClassroomSubject(this.data)
				this.$bvModal.hide('modal-create')
				this.$bvToast.toast('Kelas berhasil disimpan', successToas())
				this.clearForm()
				this.changeData()
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submitSchedule() {
			try {
				if(typeof this.schedule.id != 'undefined') {
					await this.updateDataSchedule()
				} else {
					await this.createDataSchedule()
				}
				if(this.id_show != null) {
					this.getSchedules(this.id_show)
				}
				this.$bvModal.hide('modal-schedule-add')
				this.$bvToast.toast('Jadwal berhasil disimpan', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async getSchedules(id) {
			try {
				await this.getDataSchedules(id)
				this.id_show = id
				this.$bvModal.show('modal-schedule')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async getSchedule(id) {
			try {
				await this.getDataSchedule(id)
				this.$bvModal.show('modal-schedule-add')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		addSchedule(id) {
			this.schedule.classroom_subject_id = id
			this.$bvModal.show('modal-schedule-add')
		},
		async modalAbsent(id) {
			try {
				await this.getDataSchedules(id)
				this.id_show = id
				this.$bvModal.show('modal-report-abcent')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		print () {
      		this.$htmlToPaper('printMe');
    	},
    	async filterDate() {
    		try {
				if(this.classroom_id != '') {
					this.getAbcentToday({ 
						schedule_id: this.schedule_show_id,
						date: this.date_report
					})
					this.$bvModal.hide('modal-1')
				}
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
    	},
    	async download() {
			try {
				await this.downloadExcel({
					schedule_id: this.schedule_show_id,
					date: this.date_report
				})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async getStudents(id) {
			try {
				await this.getDataStudents(id)
				this.$bvModal.show('modal-student')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		manageClassroom(id) {
			this.classroomSubject = this.myclassrooms.filter(item => item.classroom.id == id);
			this.$bvModal.show('modal-manage');
		},
		async deleteClassroomSubject(id) {
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
						await this.deleteDataClassroomSubject(id)
						this.$bvToast.toast('Kelas berhasil dihapus', successToas())
						this.$bvModal.hide('modal-manage')
						this.changeData()
					} catch (error) {	
						this.$bvToast.toast(error.message, errorToas())
					}
      	}	
      })
		},
	},
	created() {
		this.changeData()
	},
	watch: {
		schedule_show_id(val) {
			this.getAbcentToday({
				schedule_id: val,
				date: this.date_report
			})
		}
	}
}
</script>
<style>
@media print {
    @page {
        size: landscape;
    }
}
	.table > tbody > tr > td {
     vertical-align: middle;
}
</style>