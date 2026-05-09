<template>
	<div class="card card-custom gutter-b border shadow-none">
		<div class="card-header  p-4 d-flex justify-content-between">
			<div class="d-flex align-items-center">
				<div class="symbol symbol-45 symbol-light-primary mr-5">
					<b-button variant="primary" class="btn-icon" v-b-toggle="'profile_kelas'">
			 			<i class="flaticon-app"></i>
					</b-button>
				</div>
				<div class="d-flex flex-column flex-grow-1">
					<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
						Data kelas
					</span>
					<div class="d-flex">
						<div class="d-flex align-items-center pr-5">
							<span class="svg-icon svg-icon-md svg-icon-primary">
							</span>
							<span class="text-muted font-weight-bold">Data kelas ini</span>
						</div>
					</div>
				</div>
			</div>
		</div>
			<b-collapse :id="'profile_kelas'">
		<div class="card-body ribbon ribbon-clip ribbon-left">
			<div class="ribbon-target" style="top: 12px;">
				<span class="ribbon-inner bg-danger"></span>Lobi kelas
		  	</div>
			<div class="d-flex justify-content-between flex-column h-100">
				<div class="h-100">
					<div class="d-flex flex-column flex-center">
						<div class="bgi-no-repeat bgi-size-cover rounded min-h-180px w-100" style="background-image: url(/img/img-72.jpg)"></div>
						<span class="card-title font-weight-bolder text-dark-75 pt-7  font-size-h4 m-0 pb-1">{{ classroom.name }}</span>
						<div class="font-weight-bold text-dark-50 font-size-sm">{{ classroom.grade }}, {{ classroom.group }}</div>
					</div>
					<div class="pt-1" v-if="schedules.length !== 0">
						<hr>
						<div class="d-flex flex-center" v-if="authenticated.role == '1'">
							<router-link :to="{ name: 'master.classroom.live.add', params: { id: $route.params.id }}" class="btn btn-primary font-weight-bolder font-size-sm py-3 px-14" v-b-tooltip.hover title="Mulai kelas anda sekarang">
								Mulai Kelas
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card-footer pt-4 pb-4 text-center">
			<button class="btn btn-light-primary btn-sm mr-1" v-b-tooltip.hover title="Lihat daftar siswa kelas ini" @click="showStudent" :disabled="isLoading" v-if="authenticated.role == '1' || authenticated.role == '0'">
				<i class="flaticon-users" ></i>
				{{ 'Murid kelas' }}
			</button>
			<button class="btn btn-light-info btn-sm" v-b-tooltip.hover title="Lihat daftar mata pelajaran kelas ini"  @click="showSubject" :disabled="isLoading">
				<i class="flaticon-clipboard"></i>
				{{ 'Mata pelajaran' }}
			</button>
		</div>
			</b-collapse>
		<b-modal id="modal-student" title="Siswa kelas" hide-footer size="lg">
			<div class="table-responsive">
				<VuePerfectScrollbar
					class="aside-menu scroll liveclass_comment"
					style="max-height: 50vh; position: relative;"
				>
				<table class="table table-bordered table-stripped">
					<tr  v-for="(student, index) in students" :key="index">
						<td>{{ index+1 }}</td>
						<td>{{ student.student.uid }}</td>
						<td>
							{{ student.student.name }}<br>
							{{ student.student.email }}
						</td>
					</tr>
					<tr v-if="students.length === 0">
						<td colspan="4">Tidak ada siswa dikelas ini</td>
					</tr>
				</table>
				</VuePerfectScrollbar>
			</div>
		</b-modal>
		<b-modal id="modal-subject" title="Mata pelajaran kelas" hide-footer>
			<div class="table-responsive">
				<VuePerfectScrollbar
					class="aside-menu scroll liveclass_comment"
					style="max-height: 50vh; position: relative;"
				>
				<table class="table table-bordered">
					<tr  v-for="(subject, index) in classroom_subjects" :key="index">
						<td>{{ index+1 }}</td>
						<td>{{ subject.subject.name }}</td>
					</tr>
					<tr v-if="classroom_subjects.length === 0"> 
						<td>Tidak ada mata pelajaran dikelas ini</td>
					</tr>
				</table>
				</VuePerfectScrollbar>
			</div>
		</b-modal>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { BButton, BCollapse } from 'bootstrap-vue'

export default {
	name: 'ClassroomProfile',
	components: {
		VuePerfectScrollbar, BButton, BCollapse
	},
	data() {
		return {
			key: null
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated']),
		...mapState('classroom', ['classroom','schedules', 'students']),
		...mapState('subject', ['classroom_subjects'])
	},
	methods: {
		...mapActions('classroom', ['getDataClassroom', 'getDataStudents']),
		...mapActions('subject',['getDataClassroomSubjects']),
		showSubject() {
			this.getDataClassroomSubjects(this.key)
			.then((res) => {
				this.$bvModal.show('modal-subject')
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		},
		showStudent() {
			this.getDataStudents(this.key) 
			.then((res) => {
				this.$bvModal.show('modal-student')
			})
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	},
	created() {
		if(this.authenticated.role == '2') {
			if(typeof this.authenticated.classroom == 'undefined') {
				this.$router.push({ name: 'master.classroom.join' })
				return
			}
			this.key = this.authenticated.classroom.id
		} else {
			this.key = this.$route.params.id
		}

		this.getDataClassroom(this.key)
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	}
}
</script>