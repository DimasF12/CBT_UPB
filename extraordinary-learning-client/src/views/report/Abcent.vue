<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Report absensi</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Laporan absensi hari ini</span>
					</h3>
					<div class="card-toolbar" v-if="classroom_id != ''">
						<div>
							<b-dropdown  variant="link" toggle-class="text-decoration-none" no-caret>
								<template v-slot:button-content>
									<b-button variant="light-primary" class="font-weight-bolder font-size-sm">
										<span class="svg-icon svg-icon">
								          <inline-svg
								            class="svg-icon"
								            src="/media/svg/icons/Design/Flatten.svg"
								          />
								        </span>
										Export/Cetak
									</b-button>
								</template>
								<b-dropdown-item @click="print">Cetak/Pdf</b-dropdown-item>
								<b-dropdown-item @click="download">Download excel</b-dropdown-item>
							</b-dropdown>
							<b-button v-b-modal.modal-1 variant="primary">Filter tanggal
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
											<select class="form-control form-control-solid" v-model="classroom_id">
												<option :value="classroom.id" v-for="classroom in myclassrooms">{{ classroom.classroom.name }} - {{ classroom.subject.name }}</option>
											</select>
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md"  id="printMe">
						<table class="table table-bordered">
							<thead>
								<tr>
									<td width="50px">No</td>
									<td>Nama</td>
									<td>Kehadiran</td>
									<td>Status</td>
									<td>Keterangan</td>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(abcent,index) in abcents">
									<td>{{ index+1 }}</td>
									<td>{{ abcent.user.name }}</td>
									<td>{{ abcent.isabcent == 1 ? 'Hadir' : 'Tidak hadir' }}</td>
									<td>{{ abcent.details != null && typeof abcent.details.type != 'undefined' ? abcent.details.type : '-' }}</td>
									<td>{{ abcent.desc }}</td>
								</tr>
							</tbody>
						</table>
						<div class="d-flex align-items-center py-3">
							<div class="d-flex align-items-center" v-if="isLoading">
								<div class="mr-2 text-muted">Loading...</div>
								<div class="spinner spinner-primary mr-10"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-1" title="Filter tanggal" hide-footer>
			<div class="form-group">
				<label>Tanggal</label>
				<input type="date" class="form-control form-control-lg form-control-solid" v-model="date"  name="">
			</div>
			<div class="form-group">
				<b-button @click="filterDate" variant="primary" :disabled="isLoading">
					{{ isLoading ? 'Processing...' : 'Filter' }}
				</b-button>
			</div>
		</b-modal>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BButton, BDropdown, BDropdownItem } from 'bootstrap-vue'
import { errorToas, successToas } from '@/core/entities/notif'

export default {
	name: 'AbcentReport',
	components: {
		BButton, BDropdown, BDropdownItem
	},
	data() {
		return {
			classroom_id: '',
			search: '',
			data: null,
			date: ''
		}
	},
	computed: {
		...mapGetters(['isLoading','baseURL']),
		...mapState('classroom', ['myclassrooms']),
		...mapState('abcent', ['abcents'])
	},
	methods: {
		...mapActions('classroom', ['getDataClassromMine']),
		...mapActions('abcent', ['getAbcentToday', 'downloadExcel']),
		async download() {
			try {
				await this.downloadExcel({
					classroom_id: this.data.classroom_id,
					subject_id: this.data.subject_id
				})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async filterDate() {
			try {
				if(this.classroom_id != '') {
					let data = this.myclassrooms.map(item => item.id).indexOf(this.classroom_id)
					if(data != -1) {
						this.data = this.myclassrooms[data]
						this.getAbcentToday({ 
							subject_id: this.data.subject_id, 
							classroom_id: this.data.classroom_id,
							date: this.date
						})
					}
				}
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		print () {
      		this.$htmlToPaper('printMe');
    	},
	},
	created() {
		this.getDataClassromMine()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		classroom_id(val) {
			if(val != '') {
				let data = this.myclassrooms.map(item => item.id).indexOf(val)
				if(data != -1) {
					this.data = this.myclassrooms[data]
					this.getAbcentToday({ subject_id: this.data.subject_id, classroom_id: this.data.classroom_id})
				}
			}
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
</style>