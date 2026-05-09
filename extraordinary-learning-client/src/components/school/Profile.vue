<template>
	<div class="card card-custom gutter-b shadow-none border">
		<div class="card-header  p-4 d-flex justify-content-between">
			<div class="d-flex align-items-center">
				<div class="symbol symbol-45 symbol-light-primary mr-5">
					<b-button variant="primary" class="btn-icon" v-b-toggle="'dent_1'">
			 			<i class="flaticon-app"></i>
					</b-button>
				</div>
				<div class="d-flex flex-column flex-grow-1">
					<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
						Data sekolah
					</span>
					<div class="d-flex">
						<div class="d-flex align-items-center pr-5">
							<span class="svg-icon svg-icon-md svg-icon-primary">
							</span>
							<span class="text-muted font-weight-bold">Data sekolah singkat</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<b-collapse :id="'dent_1'">
		<div class="card-body">
			<div class="d-flex justify-content-between flex-column h-100" v-if="typeof school.settings != 'undefined'">
				<div class="h-100">
					<div class="d-flex flex-column flex-center">
						<div class="bgi-no-repeat bgi-size-cover rounded min-h-180px w-100" style="background-image: url(/img/img-70.jpg)"></div>
						<span class="card-title font-weight-bolder pt-7 text-dark-75 font-size-h4 m-0 pb-1">{{ school.settings.name }}</span>
						<div class="font-weight-bold text-dark-50 font-size-sm pb-7 text-center">
							{{ school.settings.email }}<br>
							{{ school.settings.address }}
						</div>
					</div>
					<template v-if="authenticated.role == '0'">
						
					<div class="d-flex align-items-center mt-2">
                    	<div class="symbol symbol-40 symbol-light symbol-sm flex-shrink-0 mr-5">					
                    		<span class="symbol-label font-size-h4 font-weight-bold">
                    			<i class="flaticon2-list-1"></i>
                    		</span>
                    	</div>								
                    	<div class="d-flex flex-column flex-grow-1">
							<a href="#" class="text-dark-75 mb-1 font-size-lg font-weight-bolder">Kelas</a>
							<span class="text-muted font-weight-bold">Penuh kebahagiaan</span>
						</div>
						<span class="font-weight-bolder label label-xl label-light-success label-inline px-3 py-5 min-w-45px">{{ classrooms.total }}</span>						
                    </div>
					<div class="d-flex align-items-center mt-2">
                    	<div class="symbol symbol-40 symbol-light symbol-sm flex-shrink-0 mr-5">					
                    		<span class="symbol-label font-size-h4 font-weight-bold">
                    			<i class="flaticon-users-1"></i>
                    		</span>
                    	</div>								
                    	<div class="d-flex flex-column flex-grow-1">
							<a href="#" class="text-dark-75 mb-1 font-size-lg font-weight-bolder">Siswa</a>
							<span class="text-muted font-weight-bold">Cita cita hebat</span>
						</div>
						<span class="font-weight-bolder label label-xl label-light-danger label-inline px-3 py-5 min-w-45px">{{ students.total }}</span>						
                    </div>
                    <div
										 class="d-flex align-items-center mt-2">
                    	<div class="symbol symbol-40 symbol-light symbol-sm flex-shrink-0 mr-5">					
                    		<span class="symbol-label font-size-h4 font-weight-bold">
                    			<i class="flaticon2-checking"></i>
                    		</span>
                    	</div>								
                    	<div class="d-flex flex-column flex-grow-1">
							<a href="#" class="text-dark-75 mb-1 font-size-lg font-weight-bolder">Mata pelajaran</a>
							<span class="text-muted font-weight-bold">Minat dan bakat</span>
						</div>
						<span class="font-weight-bolder label label-xl label-light-primary label-inline px-3 py-5 min-w-45px">{{ subjects.total }}</span>						
                    </div>
										<div class="d-flex align-items-center mt-2">
                    	<div class="symbol symbol-40 symbol-light symbol-sm flex-shrink-0 mr-5">					
                    		<span class="symbol-label font-size-h4 font-weight-bold">
                    			<i class="flaticon-users-1"></i>
                    		</span>
                    	</div>								
                    	<div class="d-flex flex-column flex-grow-1">
							<a href="#" class="text-dark-75 mb-1 font-size-lg font-weight-bolder">Guru</a>
							<span class="text-muted font-weight-bold">Pahlawan terbaik</span>
						</div>
						<span class="font-weight-bolder label label-xl label-light-warning label-inline px-3 py-5 min-w-45px">{{ teachers.total }}</span>						
                    </div>
					</template>
				</div>
			</div>
		</div>
		</b-collapse>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { BButton, BCollapse } from 'bootstrap-vue'

export default {
	name: 'SchoolProfile',
	components: {
		BButton, BCollapse
	},
	computed: {
		...mapState('setting', ['school']),
		...mapState('classroom',['classrooms']),
		...mapState('subject',['subjects']),
		...mapState('user',['students','teachers']),
		...mapState('user',['authenticated']),
	},
	methods: {
		...mapActions('setting', ['getDataSettingSchool']),
		...mapActions('user', ['getDataStudents', 'getTeacherDataTable']),
		...mapActions('classroom', ['getDataClassrooms']),
		...mapActions('subject', ['getDataSubjects'])
	},
	created() {
		this.getDataSettingSchool()
		if(this.authenticated.role == '0') {
			
			this.getDataStudents({ perPage: 1 })
			this.getDataClassrooms({ perPage: 1})
			this.getDataSubjects({ perPage: 1})
			this.getTeacherDataTable({ perPage: 1 })
		}
	}
}	
</script>