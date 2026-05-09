<template>
	<div>
		<div class="card card-custom bg-light-warning gutter-b shadow-none border-warning" v-if="authenticated.role =='1'">
			<!--begin::Header-->
			<div class="card-header pt-3 border-0">
				<h3 class="card-title align-items-start flex-column">
					<span class="card-label font-weight-bolder text-warning">Siswa</span>
					<span class="text-muted mt-1 font-weight-bold font-size-sm">
						<span class="badge badge-warning" v-b-tooltip.hover title="Siswa yang belum diberikan keterangan">{{ no_attends.length }} Siswa belum ada keterangan</span>
					</span>
				</h3>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body pt-2">
				<!--begin::Item-->
				<VuePerfectScrollbar
					style="max-height: 40vh; position: relative;"
				>
				<div class="d-flex align-items-center mb-8 mt-2" v-for=" student in no_attends" :key="student.id">
					<!--begin::Symbol-->
					<div class="symbol symbol-40 symbol-light mr-5">
						<div class="symbol-label text-warning">
							{{ student.student.name.charAt(0) }}
						</div>
						<i class="symbol-badge bg-danger"></i>
					</div>
					<!--end::Symbol-->
					<!--begin::Text-->
					<div class="d-flex flex-column font-weight-bold">
						<a href="#" v-b-tooltip.hover title="Beri keterangan" @click="desert(student.student_id)" class="text-dark text-hover-warning mb-1 font-size-lg">{{ student.student.name }}</a>
						<span class="text-muted">{{ student.student.email }}</span>
					</div>
					<!--end::Text-->
				</div>
				<!--end::Item-->
				</VuePerfectScrollbar>
			</div>
			<!--end::Body-->
		</div>

		<div class="card card-custom bg-light-success gutter-b shadow-none border-success"  v-if="authenticated.role == '0' || authenticated.role =='1'">
			<!--begin::Header-->
			<div class="card-header border-0 pt-3">
				<h3 class="card-title align-items-start flex-column">
					<span class="card-label font-weight-bolder text-success">Siswa & Guru</span>
					<span class="text-muted mt-1 font-weight-bold font-size-sm">
						<span class="badge badge-success" v-b-tooltip.hover title="Admin siswa guru yang saat ini sedang berada disini">{{ users.length }} User sedang di channel</span>
					</span>
				</h3>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body pt-2">
				<VuePerfectScrollbar
					style="max-height: 40vh; position: relative;"
				>
				<!--begin::Item-->
				<div class="d-flex align-items-center mb-8 mt-2" v-for="user in users" :key="user.id">
					<!--begin::Symbol-->
					<div class="symbol symbol-40 symbol-light mr-5">
						<div class="symbol-label text-success">
							{{ user.name.charAt(0) }}
						</div>
						<i class="symbol-badge bg-success"></i>
					</div>
					<!--end::Symbol-->
					<!--begin::Text-->
					<div class="d-flex flex-column font-weight-bold">
						<span class="text-dark mb-1 font-size-lg">{{ user.name }}</span>
						<span class="text-muted">{{ user.email }}</span>
					</div>
					<!--end::Text-->
				</div>
				<!--end::Item-->
				</VuePerfectScrollbar>
			</div>
			<!--end::Body-->
			<b-modal id="modal-desc" title="Keterangan siswa" no-close-on-backdrop hide-header-close  no-close-on-esc>
					<div class="form-group">
					<label>Status</label>
						<select class="form-control" v-model="data.isabcent">
   						<option :value="0">Tidak hadir</option>
   						<option :value="1">Hadir</option>
   					</select>
				</div>
   				<div class="form-group">
   					<label>Keterangan</label>
   					<select class="form-control" v-model="data.reason">
   						<option value="0">-</option>
   						<option value="1">Alpha</option>
   						<option value="2">Sakit</option>
   						<option value="3">Izin</option>
   						<option value="4">Masalah</option>
   					</select>
   				</div>
   				<div class="form-group">
   					<label>Tambahan</label>
   					<textarea class="form-control" placeholder="Beri sedikit penjelasan tentang keterangan yang diberikan" v-model="data.desc">
   						
   					</textarea>
   				</div>
   				<template v-slot:modal-footer="{ cancel }">
			      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
			        Cancel
			      </b-button>
			      <b-button size="sm" variant="primary" :disabled="isLoading" @click="submit">
			        {{ isLoading ? 'Processing...' : 'Simpan' }}
			      </b-button>
			    </template>
  			</b-modal>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { BButton } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
	name: 'OnlineStudent',
	components: {
		BButton, VuePerfectScrollbar
	},
	data() {
		return {
			channel:'',
			no_attends: [],
			data: {
				isabcent: 0,
				details: {
					type: '',
					desc: ''
				}
			},
			id_set: '',
			users: []
		}
	},
	computed: {
		...mapState(['token']),
		...mapGetters(['isLoading']),
		...mapState('user',['authenticated']),
		...mapState('channel',['socket']),
		...mapState('classroom',['students']),
		...mapState('abcent',['abcents']),
		...mapState('classroom',['classlive']),
	},
	methods: {
		...mapActions('channel', ['getUserOnChannel', 'setUserToChannel']),
		...mapActions('abcent', ['storeAbcentToday','getAbcentToday']),
		clearForm() {
			this.id_set = ''
			this.data = {
				isabcent: 0,
				details: {
					type: '',
					desc: ''
				}
			}
		},
		desert(id) {
			this.id_set = id
			this.$bvModal.show('modal-desc')
		},
		async submit() {
			try {
				await this.storeAbcentToday({
					user_id: this.id_set,
					schedule_id: this.classlive.schedule_id,
					isabcent: this.data.isabcent,
					reason: this.data.reason,
					desc: this.data.desc,
					details: this.data.details
				})
				this.$bvModal.hide('modal-desc')
				this.clearForm()
				this.getAbcentToday({
					schedule_id: this.classlive.schedule_id
				})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	async created() {
		try {
			this.channel = 'classlive_'+this.$route.params.id
			if(typeof this.classlive.schedule_id != 'undefined') {
				this.getAbcentToday({
					schedule_id: this.classlive.schedule_id
				})
			}
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	watch: {
		abcents() {
			let abcents = this.abcents.map(item => item.user_id)
			let sude = this.students.map(item => item.student_id)
			this.no_attends = this.students.filter(value => !abcents.includes(value.student_id))
		}
	},
	mounted() {
		this.socket.open();
		this.socket.emit('getin', {
			user: this.authenticated,
			channel: this.channel
		});

		if(this.authenticated.role != '2') {
			this.socket.emit('monitor', { channel: this.channel })
			this.socket.on('monit', (users) => {
				this.users = users
			})

			this.socket.on('is_online', (user) => {
				let index = this.users.map(item => item.id).indexOf(user.id);
				if(index == -1) {
					this.users.push(user)
				}
				let studentIndex = this.no_attends.map(item => item.student_id).indexOf(user.id);
				if(studentIndex != -1) {
					this.no_attends.splice(studentIndex, 1)
				}
			}),
			this.socket.on('is_offline', (user) => {
				let removeIndex = this.users.map(item => item.id).indexOf(user.id);
				if(removeIndex != -1) {
					this.users.splice(removeIndex,1)
				}
			})
		}
		this.socket.on('close_classroom', () => {
			if(this.$router.name == 'master.classroom.live') {
				this.$router.push({ name: 'master.classroom.dashboard', params: { id: this.classlive.classroom_id}})
			}
		})
	},
	destroyed() {
        this.socket.emit('exit', { channel: this.channel })
        this.socket.close()
    },
}
</script>