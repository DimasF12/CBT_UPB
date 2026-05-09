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
								Kegiatan
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Manage kegiatan sekolah</span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-toolbar"> 
						<b-button variant="primary" v-b-modal.modal-event> 
							<i class="flaticon2-add-square"></i>
							Tambah kegiatan
						</b-button>
					</div>
				</div>
				<div class="card-body">
					<div class="card-responsive-md" v-if="typeof events.data != 'undefined'">
						<b-table 
                        show-empty
                        :fields="fields"
                        :items="events.data"
                        >
                        	<template v-slot:cell(no)="row">
                        		<span style="width: 40px;">
                        			<span class="font-weight-bolder" v-text="events.from+row.index"></span>
                        		</span>
                        	</template>
                        	<template v-slot:cell(event)="row">
                        		<span style="width: 250px;">
                        			<div class="d-flex flex-column">	
	                        			<router-link :to="{ name: 'event.view', params: { id: row.item.id }}" class="text-dark-75 text-hover-primary font-weight-bolder font-size-lg mb-0" v-text="row.item.title"></router-link>									
	                        			<span class="text-muted font-weight-bold" v-text="row.item.location"></span>
	                        		</div>
                        		</span>
                        	</template>
                        	<template v-slot:cell(actions)="row">
                        		<b-dropdown variant="link" toggle-class="text-decoration-none" no-caret  class="bg-hover-light-primary rounded-pill btn-icon" >
									<template v-slot:button-content>
									    <span class="flaticon-squares-4"></span>
									</template>
									<b-dropdown-item @click="getData(row.item.id)">Edit</b-dropdown-item>
									<b-dropdown-item @click="deleteData(row.item.id)">Hapus</b-dropdown-item>
								</b-dropdown>
                        	</template>
                    	</b-table>
                    	<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
					      <b-pagination
					        v-model="page"
					        :total-rows="events.total"
					        :per-page="events.per_page"
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
								<span class="badge badge-primary">Total {{ events.total }} data</span>
							</div>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="modal-event" title="Kegiatan"  @hide="$store.commit('event/CLEAR_EVENT')" no-close-on-backdrop size="lg">
			<div class="form-group">
				<label>Judul</label>
				<input type="text" class="form-control" v-model="event.title" :class="{ 'is-invalid' : errors.title }">
			</div>
			<div class="form-group">
				<label>Lokasi</label>
				<input type="text" class="form-control" v-model="event.location" :class="{ 'is-invalid' : errors.location }">
			</div>
			<div class="form-group">
				<label>Kontent</label>
				<ckeditor v-model="event.body" v-if="showEditor" :config="editorConfig" id="content" type="inline"></ckeditor>
			</div>
			<div class="form-group">
				<label>Tanggal</label>
				<VueCtkDateTimePicker v-model="event.date" only-date format='YYYY-MM-DD' formatted='DD-MM-YYYY' label="Tanggal pelaksanaan" id="date do"/>
			</div>
			<div class="form-group">
				<label>Waktu</label>
				<VueCtkDateTimePicker v-model="event.time" only-time format='HH:mm' formatted='HH:mm' label="Waktu pelaksanaan" id="time do"/>
			</div>
			<template v-slot:modal-footer="{ cancel }">
		      <b-button size="sm" variant="secondary" @click="cancel()" :disabled="isLoading">
		        Cancel
		      </b-button>
		      <b-button size="sm" variant="primary" @click="submit" :disabled="isLoading">
		        {{ isLoading ? 'Processing...' : 'Simpan' }}
		      </b-button>
		    </template>
		</b-modal>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BPagination, BDropdown, BDropdownItem } from 'bootstrap-vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import store from '@/store'

export default {
	name: 'EventData',
	components: {
		BButton, BPagination, BDropdownItem, BDropdown,
		VueCtkDateTimePicker
	},
	data() {
		return {
			perPage: 10,
			fields: [
				{ key: 'no', label: '#' },
				{ key: 'event', label: 'Kegiatan' },
				{ key: 'actions', label: 'Aksi' }
			],
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
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('event', ['event','events']),
		page: {
			get() {
				return this.$store.state.event.page
			},
			set(val) {
				this.$store.commit('event/SET_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('event', ['getDataEvents', 'createDataEvent', 'updateDataEvent', 'getDataEvent', 'deleteDataEvent']),
		async changeData() {
			try {
				await this.getDataEvents({ perPage: this.perPage })
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async submit() {
			try {
				if(typeof this.event.id != 'undefined') {
					await this.updateDataEvent()
				} else {
					await this.createDataEvent()
				}
				this.$bvModal.hide('modal-event')
				this.changeData()
				this.$bvToast.toast('Kegiatan berhasil disimpan', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async getData(id) {
			try {
				await this.getDataEvent(id)
				this.$bvModal.show('modal-event')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async deleteData(id) {
			this.$swal({
	            title: 'Informasi',
	            text: "Kegiatan akan dihapus",
	            icon: 'warning',
	            showCancelButton: true,
	            confirmButtonColor: '#3085d6',
	            cancelButtonColor: '#c3c3c3',
	            confirmButtonText: 'Lanjutkan!'
	        }).then(async (result) => {
	        	if(result.value) {
	        		try {
	        			await this.deleteDataEvent(id)
	        			this.changeData()
	        		} catch (error) {
	        			this.$bvToast.toast(error.message, errorToas())
	        		}
	        	}
	        })
		}
	},
	created() {
		this.showEditor = true
		this.changeData()
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
<style >
	div[contenteditable] {
    outline: 1px solid #616161;
}
</style>