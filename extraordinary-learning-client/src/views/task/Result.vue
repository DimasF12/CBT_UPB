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
							Hasil nilai tugas
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Hasil nilai tugas siswa</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar">
						<div class="">
							<router-link :to="{ name: 'task.index' }" class="btn btn-light-primary mr-2">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
							<a class="btn btn-success" :href="`${baseURL}/api/v1/download/excel/result/task?t=${$route.params.id}&c=${classroom_id}&token=${authenticated.token_download}`" target="_blank" download v-if="classroom_id != '' && classroom_id != null"><i class="flaticon-download"></i> Download excel</a>
						</div>
					</div>
				</div>
				<div class="card-body">
					<div class="mb-10">
						<div class="row align-items-center">
							<div class="col-lg-9 col-xl-8">
								<div class="row align-items-center">
									<div class="col-md-5 my-2 my-md-0">
										
											<v-select label="name" :reduce="item => item.id" :options="classrooms" v-model="classroom_id">

											</v-select>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="table-responsive-md" id="printMe" v-if="classroom_id !=  '' && classroom_id != null && classroom_results.length !== 0">
						<b-table 
						small
                        id="table-transition-example" 
                        :fields="fields"
                        :items="classroom_results"
                        >
                        	<template v-slot:cell(name)="row">
                        		<span>
                        			{{ row.item.student.name }}
                        		</span>
                        	</template>
                        	<template v-slot:cell(result)="row">
                        		<span>
                        			{{ row.item.result.point }}
                        		</span>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
                    		<div class="d-flex align-items-center py-3">
													<span class="badge badge-primary mr-1">Total {{ classroom_results.length }} data</span>
								<div class="d-flex align-items-center" v-if="isLoading">
									<div class="mr-2 text-muted">Loading...</div>
									<div class="spinner spinner-primary mr-10"></div>
								</div>
							</div>
                    	</div>
                	</div>
					<p class="text-muted" v-if="classroom_id != '' && classroom_id != null && classroom_results.length == 0">Tidak ada nilai tugas untuk saat ini, silakan koreksi terlebih daulu untuk melihat nilai</p>
				<p class="text-muted" v-if="classroom_id == '' || classroom_id == null"><i class="flaticon2-information"></i> Pilih kelas yang ingin ditampilkan</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { errorToas, successToas } from '@/core/entities/notif'
import { BDropdown, BDropdownItem, BButton } from 'bootstrap-vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
	name: 'TaskResult',
	components: {
		BDropdownItem, BDropdown, BButton, VSelect
	},
	data: () => ({
		classroom_id: '',
		fields: [
			{ key: 'student.uid', label: 'NIS' },
			{ key: 'name', label:'Nama' },
			{ key: 'result', label: 'Nilai' }
		],
	}),
	computed: {
		...mapState('user',['authenticated']),
		...mapGetters(['isLoading','baseURL']),
		...mapState('task', ['classroom_results']),
		...mapState('classroom', ['myclassrooms']),
		classrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result.map(item => ({
				id: item.classroom.id,
				name: item.classroom.name
		}));
		}
	},
	methods: {
		...mapActions('task', ['getDataClassroomTaskResults']),
		...mapActions('classroom', ['getDataClassromMine']),
		getData() {
			this.getDataClassroomTaskResults({ 
				task_id: this.$route.params.id,
				classroom_id: this.classroom_id
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
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
			if(val != '' && val != null) {
				this.getData()
			}
		}
	}
}
</script>