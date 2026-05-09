<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card mb-10">
				<div class="card-header p-4 d-flex justify-content-between">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon-interface-11 text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Kompetensi Inti & Kompetensi Dasar
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Daftar Kompetensi Inti & Kompetensi Dasar</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8">
          <table class="table table-borderless table-sm">
            <tr v-for="item in filteredSubjects" :key="item.id">
              <td>
								<div class="card">
									<div class="card-header p-0 d-flex justify-content-between">
										<div class="d-flex align-items-center">
											<b-button squared size="sm" class="mr-1" variant="light-primary" @click="manageStandart(item.subject.id)" :disabled="isLoading">
												<i class="flaticon-list-2"></i> Manage
											</b-button>
										</div>
									</div>
								</div>
								<div class="card">
									<div class="card-body p-4 rounded-0">
										<div class="d-flex align-items-center">
											<div class="d-flex flex-column font-weight-bold">
												<span class="text-dark mb-1 font-size-lg">{{ item.subject.name }}</span>
											</div>
										</div>
									</div>
									<a href="#" @click="manageStandart(item.subject.id)" class="stretched-link" :disabled="isLoading"></a>
								</div>
              </td>
            </tr>
          </table>
				</div>
				<div class="col-md-4">
          <div class="alert alert-custom alert-light-primary fade show mb-5" role="alert">
            <div class="alert-icon">
              <i class="flaticon-info"></i>
            </div>
            <div class="alert-text">
              <strong>Informasi</strong><br>
              Klik manage untuk menambah kompetensi dasar dan kompetensi inti baru 
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
		<b-modal id="modal-manage" size="xl" title="Manage" hide-footer>
			<template v-slot:modal-header>
				<div>
					<b-button variant="primary" class="mr-1" v-b-modal.modal-create>
						<i class="flaticon2-add-square"></i>
						Tambah Kompetensi Inti
					</b-button>
					<a :href="`${baseURL}/api/v1/download/excel/standart?u=${authenticated.id}&s=${standart.subject_id}&token=${authenticated.token_download}`" class="btn btn-success" v-if="standarts.length !== 0" download="">
						<i class="flaticon-download"></i>
						Download excel
					</a>
				</div>
			</template>
			<div class="row">
				<div class="col-md-12">
					<VuePerfectScrollbar
						style="max-height: 80vh; position: relative;"
					>
					<div class="table-responsive-md mt-3" v-if="typeof standarts != 'undefined'">
						<b-table :fields="fields"
							show-empty
							small
							:items="standarts">
							<template v-slot:cell(details)="row">
								<b-button size="sm" variant="primary" class="btn-icon" @click="row.toggleDetails">
									<small>
										<i :class="row.detailsShowing ? 'flaticon-circle' : 'flaticon-plus'" class="text-white"></i>
									</small>
								</b-button>
							</template>
							<template v-slot:row-details="row">
								<div class="row">
									<div class="col-md-5">
										<table class="table table-bordered table-sm">
											<tr>
												<th width="30px">{{ row.item.code }}</th>
												<td v-html="row.item.body" colspan="2">
												</td>
											</tr>
										</table>
									</div>
									<div class="col-md-7">
										<table class="table table-bordered table-sm">
											<tr v-for="(child, index) in row.item.children" :key="'standart_child_'+index">
												<th width="30px">{{ child.code }}</th>
												<td v-html="child.body"></td>
												<td width="30px">
													<b-dropdown  variant="link" toggle-class="text-decoration-none" 
														no-caret  
														class="bg-hover-light-primary rounded-pill btn-icon"
													>
														<template v-slot:button-content>
															<span class="flaticon-more text-secondary"></span>
														</template>
														<b-dropdown-item @click="getData(child.id)" >Edit</b-dropdown-item>
														<b-dropdown-item @click="deleteStandart(child.id)">Hapus</b-dropdown-item>
													</b-dropdown>
												</td>
											</tr>
										</table>
									</div>
								</div>
							</template>
							<template v-slot:cell(actions)="row">
								<div class="text-right">
									<b-button variant="light-success" class="mr-1"  v-b-tooltip.hover title="Tambah komptensi dasar"  size="sm" @click="addChildStandart(row.item.id,row.item.subject_id)">
										<small><i class="flaticon-add-circular-button"></i> Tambah</small>
									</b-button>
									<b-button variant="light-primary" class="mr-1"  size="sm" @click="getData(row.item.id)">
										<small><i class="flaticon2-contract"></i></small>
									</b-button>
									<b-button variant="light-danger" class="mr-1"  size="sm" @click="deleteStandart(row.item.id)">
										<small><i class="flaticon2-trash"></i></small>
									</b-button>
								</div>
							</template>
						</b-table>
					</div>
					</VuePerfectScrollbar>
				</div>
			</div>
		</b-modal>
		<b-modal id="modal-create" title="KI/KD" @hide="$store.commit('standart/CLEAR_DATA_STANDART')">
			<div class="form-group">
				<label>Tipe</label>
				<div class="radio-inline">
					<label class="radio radio-rounded ">
						<input type="radio" value="P"  v-model="standart.type"/>
						<span></span>
						Pengetahuan
					</label>
					<label class="radio radio-rounded">
						<input type="radio" value="K" v-model="standart.type"/>
						<span></span>
						Keterampilan
					</label>
				</div>
			</div>
			<div class="form-group">
				<label>Nomor</label>
				<input type="text" class="form-control" v-model="standart.code"/>
			</div>
			<div class="form-group">
				<label>Body</label>
				<ckeditor v-model="standart.body" v-if="showEditor" :config="editorConfig" type="inline"></ckeditor>
			</div>
			<template v-slot:modal-footer="{ cancel }">
		    <b-button variant="secondary" size="sm" @click="cancel()" :disabled="isLoading">
		    	Cancel
		    </b-button>
				<b-button variant="primary" size="sm" @click="submit" :disabled="isLoading">
		    	{{ isLoading ? 'Processing...' : 'Simpan' }}
		    </b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BCollapse, BPagination,BDropdownItem, BDropdown } from 'bootstrap-vue'
import store from '@/store'

export default {
	name: 'StandartData',
	components: {
		BButton, BCollapse, BPagination,BDropdownItem, BDropdown, VuePerfectScrollbar
	},
	data() {
		return {
			perPage: 10,
			editorConfig: {
				allowedContent: true,
				fileTools_requestHeaders: {
			    'Accept': 'application/json',
			    'Authorization' : 'Bearer '+store.state.token
			  },
			  height: 200,
			  extraPlugins : 'justify,sourcedialog',
				FloatingPanelsZIndex : 100001,
				toolbar: [
					{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
				]
			},
			showEditor : true,
			fields: [
				{ key: 'details', label: '', thStyle: { display: 'none'} },
				{ key: 'actions', thStyle: { display: 'none'}}
			]
		}
	},
	computed: {
		...mapGetters(['isLoading','baseURL']),
		...mapState('classroom', ['myclassrooms']),
		...mapState('user', ['authenticated']),
		...mapState('standart',['standart','standarts']),
    filteredSubjects() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.subject.id)) {
					map.set(item.subject.id, true);
					result.push(item)
				}
			}
			return result;
		},
	},
	methods: {
		...mapActions('standart', ['getDataStandart','getDataStandarts','createDataStandart','updateDataStandart','deleteDataStandart']),
		...mapActions('classroom', ['getDataClassromMine']),
		async fetchingNewData(id) {
			try {
				await this.getDataStandarts({
					subject: id,
					perPage: this.perPage
				})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas());
			}
		},
		async submit() {
			try {
				if (typeof this.$store.state.standart.standart.id != 'undefined') {
					await this.updateDataStandart()
				} else {
					await this.createDataStandart()
				}
				this.fetchingNewData(this.standart.subject_id)
				this.$bvToast.toast('KI/KD berhasil disimpan', successToas())
				this.$bvModal.hide('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas());
			}
		},
		manageStandart(id) {
			this.fetchingNewData(id)
			this.$bvModal.show('modal-manage')
			this.$store.state.standart.standart.subject_id = id
		},
		addChildStandart(id,subject_id) {
			this.$store.state.standart.standart.standart_id = id
			this.$store.state.standart.standart.subject_id = subject_id
			this.$bvModal.show('modal-create')
		},
		async getData(id) {
			try {
				await this.getDataStandart(id)
				this.$bvModal.show('modal-create')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		deleteStandart(id) {
			this.$swal({
	      title: 'Informasi',
	      text: "KI/KD akan dihapus beserta dengan data yang terkait",
	      icon: 'warning',
	      showCancelButton: true,
	      confirmButtonColor: '#3085d6',
	      cancelButtonColor: '#c3c3c3',
	      confirmButtonText: 'Lanjutkan!'
	    }).then(async (result) => {
	      if (result.value) {
	      	try {
						await this.deleteDataStandart(id)
						let index = this.$store.state.standart.standarts.map(item => item.id).indexOf(id)
						if(index !== -1) {
							this.$store.state.standart.standarts.splice(index, 1)
						}
	      	} catch (error) {
	      		this.$bvToast.toast(error.message, errorToas())
	      	}
	      }
			})
		}
	},
	created() {
		this.getDataClassromMine()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
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