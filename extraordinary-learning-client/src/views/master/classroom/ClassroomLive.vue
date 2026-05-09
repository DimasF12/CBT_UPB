<template>
	<div>
		<div :class="bg ? 'container-fluid' : ''" v-if="typeof classlive.settings != 'undefined' && classlive.settings.type == 'jitsi'">	
			<div class="card shadow-none border" :class="bg ? 'bg-dark' : ''" v-if="typeof classlive.settings != 'undefined'">
				<div class="text-center" :class="bg ? 'card-body' : ''">
					<vue-jitsi-meet
						ref="jitsiRef"
					   	domain="meet.jit.si"
						:options="jitsiOptions"
					></vue-jitsi-meet>
				</div>
			</div>
		</div>
		<div class="d-flex flex-column-fluid">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-8">	
						<div class="card card-custom shadow-none border">
							<div class="card-header flex-wrap pb-0 pt-12 ribbon ribbon-clip ribbon-left">
								<div class="ribbon-target" style="top: 12px;">
							<span class="ribbon-inner bg-success"></span>Online
							</div>
									<h3 class="card-title align-items-start flex-column">
									<span class="card-label font-weight-bolder text-dark">Kelas langsung</span>
									<span class="text-muted mt-1 font-weight-bold font-size-sm">{{ classlive.created_at }}</span>
								</h3>
								<div class="card-toolbar" v-if="authenticated.role == '0' || authenticated.role == '1'">
									<div class="form-group">
										<button class="btn btn-primary mr-2" @click="modalAbcent" :disabled="isLoading" v-b-tooltip.hover title="Lihat absensi hari ini">
											 Lihat absen
										</button>
										<button class="btn btn-light-primary" @click="closeClass" v-b-tooltip.hover title="Tutup kelas pada hari ini" :disabled="isLoading">
											Tutup Kelas
										</button>
									</div>
								</div>
							</div>
							<div class="card-body " v-html="classlive.body">
								
							</div>
						</div>
						<div class="card card-custom shadow-none border">
							<div class="card-body p-4">
								<StudentComment />
							</div>
						</div>
					</div>
					<div class="col-md-4">
						<div class="card-body" v-if="typeof classlive.settings != 'undefined' && classlive.settings.type == 'youtube'">
							<youtube :video-id="videoId" ref="youtube" @playing="playing"></youtube>
						</div>
							<div class="alert alert-custom alert-light-primary fade show mb-5">
									<div class="alert-icon">
										<i class="flaticon-businesswoman"></i>
									</div>
									<div class="alert-text">Jangan ragu berkomentar, bila ada yang ingin ditanyakan atau terlintas dipikiranmu</div>
									<div class="alert-close">
										<button type="button" class="close" data-dismiss="alert" aria-label="Close">
											<span aria-hidden="true">
												<i class="ki ki-close"></i>
											</span>
										</button>
									</div>
								</div>
						<StudentAttend/>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-abcent" title="Absen hari ini" size="xl" hide-footer>
			<VuePerfectScrollbar
				style="max-height: 70vh; position: relative;"
			>
			<b-table 
                show-empty
                :fields="fields"
                :items="filteredAbcent"
            >
            	<template v-slot:cell(no)="row">
                    <span style="width: 40px;">
                    	<span class="font-weight-bolder" v-text="row.index+1"></span>
                    </span>
                </template>
                <template v-slot:cell(isattend)="row">
                    <span class="badge" :class="row.item.isabcent ? 'badge-success' : 'badge-danger'">{{ row.item.isabcent ? 'Hadir' : 'Tidak hadir' }}</span>
                </template>
                <template v-slot:cell(type)="row">
                	{{ row.item.reason | textReason }}
                </template>
								<template v-slot:cell(actions)="row">
                    <b-button variant="secondary" class="btn-icon" size="sm" @click="getAbcent(row.item.id)" v-if="authenticated.role == '1'" :disabled="isLoading">
											<i class="flaticon-edit"></i>
										</b-button>
								</template>
            </b-table>
			</VuePerfectScrollbar>
			<span class="badge badge-primary">Total {{ filteredAbcent.length }} data</span>
		</b-modal>
		<b-modal id="modal-edit-absent" title="Edit keterangan siswa"  no-close-on-backdrop hide-header-close  no-close-on-esc>
				<div class="form-group">
					<label>Status</label>
						<select class="form-control" v-model="edit_absent.isabcent">
   						<option :value="0">Tidak hadir</option>
   						<option :value="1">Hadir</option>
   					</select>
				</div>
				<div class="form-group">
   					<label>Keterangan</label>
   					<select class="form-control" v-model="edit_absent.reason">
   						<option value="0">-</option>
   						<option value="1">Alpha</option>
   						<option value="2">Sakit</option>
   						<option value="3">Izin</option>
   						<option value="4">Masalah</option>
   					</select>
   				</div>
   				<div class="form-group">
   					<label>Tambahan</label>
   					<textarea class="form-control" placeholder="Beri sedikit penjelasan tentang keterangan yang diberikan" v-model="edit_absent.desc">
   						
   					</textarea>
   				</div>
   				<template v-slot:modal-footer="{ cancel }">
			      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
			        Cancel
			      </b-button>
			      <b-button size="sm" variant="primary" :disabled="isLoading" @click="updateAbsent">
			        {{ isLoading ? 'Processing...' : 'Simpan' }}
			      </b-button>
			    </template>
		</b-modal>
		<b-modal id="modal-close-room" size="lg" @hide="wizard_index = 0" title="Penutupan kelas hari ini">
			<div v-if="wizard_index == 0">
					<div class="alert alert-custom alert-light-primary fade show mb-5">
									<div class="alert-icon">
										<i class="flaticon-notes"></i>
									</div>
									<div class="alert-text">Buat <strong>catatan</strong> tentang pembelajaran kali ini <br> bila tidak ada kosongkan saja</div>
									<div class="alert-close">
										<button type="button" class="close" data-dismiss="alert" aria-label="Close">
											<span aria-hidden="true">
												<i class="ki ki-close"></i>
											</span>
										</button>
									</div>
								</div>
				<div class="form-group">
					<label>Catatan</label>
					<ckeditor v-model="data.note" v-if="showEditor" :config="editorConfig"  type="inline"></ckeditor>	
				</div>
			</div>
			<div v-if="wizard_index == 1">
				<table class="table table-border">
					<tr>
						<td>Jumlah Siswa</td>
						<td>{{ students.length }}</td>
					</tr>
					<tr>
						<td>Peserta Hadir</td>
						<td>{{ this.filteredAbcent.filter(item => item.isAbcent == 1 ).length }}</td>
					</tr>
					<tr>
						<td>Peserta Tidak Hadir</td>
						<td>{{ this.filteredAbcent.filter(item => item.isAbcent == 0 ).length }}</td>
					</tr>
				</table>
			</div>
			<div v-if="wizard_index == 2">
					<div class="alert alert-custom alert-light-primary fade show mb-5">
									<div class="alert-icon">
										<i class="flaticon-profile-1"></i>
									</div>
									<div class="alert-text">Terimakasih untuk pelajaran hari ini</div>
									<div class="alert-close">
										<button type="button" class="close" data-dismiss="alert" aria-label="Close">
											<span aria-hidden="true">
												<i class="ki ki-close"></i>
											</span>
										</button>
									</div>
								</div>
			</div>
			<template v-slot:modal-footer="{ cancel }">
				<b-button variant="secondary" :disabled="isLoading" @click="wizard_index -= 1" v-if="wizard_index !== 0">
					Sebelumnya
				</b-button>
				<b-button variant="primary" :disabled="isLoading" @click="wizard_index += 1" v-if="wizard_index !== 2">
					Selanjutnya
				</b-button>
				<b-button variant="success" :disabled="isLoading" @click="finishedClass" v-if="wizard_index === 2">
					Tutup kelas
				</b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import StudentAttend from '@/components/classroom/StudentAttend'
import StudentComment from '@/components/classroom/StudentComment'
import { successToas, errorToas } from '@/core/entities/notif'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { JitsiMeet } from '@mycure/vue-jitsi-meet';
import { BDropdown, BDropdownItem, BButton } from 'bootstrap-vue'
import store from '@/store'

export default {
	name: 'ClassroomLive',
	data() {
		return {
			videoId: '',
			fields: [
				{ key: 'no', label: '#' },
				{ key: 'user.uid', label: 'NIS' },
				{ key: 'user.name', label: 'Nama' },
				{ key: 'isattend', label: 'Status' },
				{ key: 'type', label: 'Keterangan'},
				{ key: 'desc', label: 'Tambahan' },
				{ key: 'actions', label: 'Aksi' }
			],
			width: '',
			height: '',
			bg: true,
			reasons: [
				"-",
				"Tanpa keterangan",
				"Sakit",
				"Izin",
				"Masalah"
			],
			edit_absent: {},
			wizard_index: 0,
			showEditor: false,
			editorConfig: {
				embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
				extraPlugins: 'embed',
				allowedContent: true,
				fileTools_requestHeaders: {
					'Accept': 'application/json',
					'Authorization' : 'Bearer '+store.state.token
				}
			},
			data: {
				note: ''
			}	
		}
	},
	components: {
		StudentAttend,
		StudentComment,
		VuePerfectScrollbar,
		VueJitsiMeet: JitsiMeet,
		BDropdownItem, BDropdown, BButton
	},
	filters: {
		textReason(i) {
			let reasons = [
				"-",
				"Tanpa keterangan",
				"Sakit",
				"Izin",
				"Masalah"
			]
			return reasons[parseInt(i)];
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('user',['authenticated']),
		...mapState('classroom',['classlive', 'students']),
		...mapState('abcent',['abcents']),
		...mapState('channel',['socket']),
		filteredAbcent() {
			return this.abcents.filter(item => item.user.role == '2')
		},
		player() {

    	},
    	jitsiOptions () {
    		return {
      			width: this.width,
    			height: window.innerHeight-300,
        		roomName: this.classlive.settings.id_meet,
        		noSSL: false,
        		userInfo: {
          		email: this.authenticated.email,
          		displayName: this.authenticated.name,
        	},
        	configOverwrite: {
          		enableNoisyMicDetection: false,
       	 		prejoinPageEnabled: false,
       	 		fileRecordingsEnabled: false,
				liveStreamingEnabled: false,
        	},
        	interfaceConfigOverwrite: {
          		SHOW_JITSI_WATERMARK: false,
          		SHOW_WATERMARK_FOR_GUESTS: false,
          		SHOW_CHROME_EXTENSION_BANNER: false
        	},
        	onload: this.onIFrameLoad
      	};
    },
	},
	methods: {
		...mapActions('classroom',['storeLiveClassroom', 'getDataliveClassroom', 'getDataStudents', 'stopLiveClassroom']),
		...mapActions('abcent',['getAbcentToday','storeAbcentToday', 'updateDataAbcent']),
		playVideo() {
      		this.player.playVideo()
    	},
    	playing() {

    	},
    	closeClass() {
      	try {
				 this.$bvModal.show('modal-close-room')
				 this.showEditor = true
      	} catch (error) {
      			this.$bvToast.toast(error.message, errorToas())
      	}
    	},
    	onIFrameLoad () {
				
			},
			getAbcent(id) {
				let index = this.abcents.map(item => item.id).indexOf(id)
				if(index !== -1) {
					this.edit_absent = this.abcents[index]
					this.$bvModal.show('modal-edit-absent')
				}
			},
			updateAbsent() {
				this.updateDataAbcent(this.edit_absent)
				.then((res) => {
					this.$bvToast.toast('Data absent berhasil diubah', successToas())
					this.$bvModal.hide('modal-edit-absent')
				})
				.catch((error) => {
					this.$bvToast.toast(error.message, errorToas())
				})
			},
			modalAbcent() {
				this.getAbcentToday({
					schedule_id: this.classlive.schedule_id
				})
				.then((res) => {
					this.$bvModal.show('modal-abcent')
				})
				.catch((err) => {
					this.$bvToast.toast(error.message, errorToas())
				})
			},
			async finishedClass() {
				try {
					await this.stopLiveClassroom({
						id: this.$route.params.id,
						note: this.data.note
					})
					this.socket.emit('close_classroom')
				} catch (error) {
					this.$bvToast.toast(error.message, errorToas())
				}
			}
	},
	async created() {
		try {
			this.channel = 'classlive_'+this.$route.params.id
			if(window.innerWidth >= 1200) {
				this.width = 1130
			} else if(window.innerWidth >= 992) {
				this.width = 900
			} else if(window.innerWidth >= 768) {
				this.width = 690
			} else {
				this.width = window.innerWidth-20
				this.bg = false
			}
			await this.getDataliveClassroom(this.$route.params.id)
			if(this.classlive.settings.type == 'youtube') {
				this.videoId = this.$youtube.getIdFromUrl(this.classlive.settings.link)
			}
		} catch (error) {
			if(error.code === 403) {
				this.$router.push({ name: 'dashboard' })
			}
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	mounted() {
		this.socket.open();
		this.socket.emit('getin', {
			user: this.authenticated,
			channel: this.channel
		});
		this.socket.on('close_classroom', () => {
			this.$router.push({ name: 'master.classroom.dashboard', params: { id: this.classlive.classroom_id }})
		})
	},
	watch: {
		async classlive() {
			try {
				if(this.authenticated.role == '1') {
					await this.getDataStudents(this.classlive.classroom_id)
				}
				await this.getAbcentToday({
					schedule_id: this.classlive.schedule_id
				})

				let index = this.abcents.map(function(item) { 
					return item.id; 
				}).indexOf(this.authenticated.id);

				if(index == '' || index == -1) {
					await this.storeAbcentToday({
						isabcent: true,
						schedule_id: this.classlive.schedule_id,
						reason: '0'
					})
				}
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	destroyed() {
		this.socket.close()
	}
}
</script>
<style>
	.table > tbody > tr > td {
     vertical-align: middle;
}
	div[contenteditable] {
    outline: 1px solid #E4E6EF
}
</style>