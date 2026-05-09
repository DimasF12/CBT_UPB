<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 pt-4 pb-0">
						<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon2-crisp-icons text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Hasil ulangan
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Hasil ulangan  siswa</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="form-group">
							<router-link :to="{ name: 'exam.schedule' }" class="btn btn-light-primary">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
							<b-dropdown  variant="link" toggle-class="text-decoration-none" no-caret v-if="classroom_id != ''">
								<template v-slot:button-content>
									<b-button variant="primary" class="font-weight-bolder font-size-sm">
										<i class="flaticon-interface-11"></i>
										Export/Cetak
									</b-button>
								</template>
								<b-dropdown-item @click="print">Cetak/Pdf</b-dropdown-item>
								<b-dropdown-item>
									 <download-excel
	                                :data = "results"
	                                :fields="json_fields"
	                                :name="'Hasil Ulangan.xls'"
	                            >
	                                Download hasil ujian
	                            </download-excel>
								</b-dropdown-item>
							</b-dropdown>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="mb-10">
						<div class="row align-items-center">
							<div class="col-lg-9 col-xl-8">
								<div class="row align-items-center">
									<div class="col-md-5 my-2 my-md-0">
										<div class="input-group mb-3">
											<!-- <div class="input-icon"> -->
												<select class="form-control" v-model="classroom_id">
													<option :value="classroom.classroom.id" v-for="classroom in myclassrooms">{{ classroom.classroom.name }}</option>
												</select>
												<!-- <span> -->
													<!-- <i class="flaticon2-search-1 text-muted"></i> -->
												<!-- </span> -->
											<!-- </div> -->
											<div class="input-group-append">
										<button class="btn btn-primary" type="button" :disabled="isLoading"  @click="retreiveData">Tampilkan</button>
									</div>
										</div>
									</div>
									<!-- <button :disabled="isLoading"  @click="retreiveData" class="btn btn-light-primary px-6 font-weight-bold">Tampilkan</button> -->
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" id="printMe">
						<b-table 
						bordered
                        show-empty
                        :fields="fields"
                        :items="results"
                        >

                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
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
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { errorToas, successToas } from '@/core/entities/notif'
import { BDropdown, BDropdownItem, BButton } from 'bootstrap-vue'
import downloadExcel from 'vue-json-excel';


export default {
	name: 'PointResult',
	components: {
		BDropdownItem, BDropdown, BButton, downloadExcel
	},
	data() {
		return {
			classroom_id: '',
			fields: [
				{ key: 'student.uid', label: 'NIS' },
				{ key: 'student.name', label: 'Nama' },
				{ key: 'correct_mc', label: 'Pg benar' },
				{ key: 'null', label: 'Kosong' },
				{ key: 'point_esay', label: 'Point esay' },
				{ key: 'result', label: 'Hasil akhir' }
			],
			json_fields: {
			'NIS': 'student.uid',
			'NAMA PESERTA DIDIK': 'student.name',
			'PG BENAR' : 'correct_mc',
			'KOSONG': 'null',
			'POINT ESAY': 'point_esay',
			'NILAI': 'result'
		}
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('result', ['results']),
		...mapState('classroom', ['myclassrooms'])
	},
	methods: {
		...mapActions('result', ['getDataResults']),
		...mapActions('classroom', ['getDataClassromMine']),
		retreiveData() {
			this.getDataResults({
				classroom_id: this.classroom_id,
				exam_schedule_id: this.$route.params.id
			})
			.catch((error) => {

			})
		},
		print () {
      		this.$htmlToPaper('printMe');
    	}
	},	
	created() {
		this.getDataClassromMine()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	destroyed() {
		this.$store.state.result.results = []
	}
}
</script>
<style scoped>
@media print {
    @page {
        size: landscape;
    }
}
</style>