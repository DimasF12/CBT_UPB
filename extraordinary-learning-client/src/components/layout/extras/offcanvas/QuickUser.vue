<template>
	<div class="topbar-item">
		<div
      		class="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
      		id="kt_quick_user_toggle"
    	>
    		<span class="svg-icon svg-icon-xl">
		      <!--begin::Svg Icon | path:svg/icons/General/User.svg-->
		      <inline-svg class="svg-icon" src="/media/svg/icons/General/User.svg" />
		      <!--end::Svg Icon-->
		    </span>
    	</div>
    	<div
	      id="kt_quick_user"
	      ref="kt_quick_user"
	      class="offcanvas offcanvas-right p-10"
	    >
	    	<div
		    	class="offcanvas-header d-flex align-items-center justify-content-between pb-5"
		    >
		    	<h3 class="font-weight-bold m-0">
		    		Hei there !
		    	</h3>
		    	<a
		          href="#"
		          class="btn btn-xs btn-icon btn-light btn-hover-primary"
		          id="kt_quick_user_close"
		        >
		          <i class="flaticon2-cross text-muted"></i>
		        </a>

			</div>
			<div class="offcanvas-content pr-5 mr-n5 scroll ps ps--active-y" style="height: 529px; overflow: hidden;">
				<!--begin::Header-->
				<div class="d-flex align-items-center mt-5 mb-2">
					<div class="symbol symbol-40 mr-5">
						<div class="symbol-label" style="background-image:url('/media/users/default.jpg')"></div>
						<i class="symbol-badge bg-success"></i>
					</div>
					<div class="d-flex flex-column">
						<a href="#" class="font-weight-bold font-size-h5 text-dark-75">{{ authenticated.name }}</a>
						<!-- <div class="text-muted mt-1">
							<span v-if="authenticated.role == '0'">Administrator</span>
							<span v-if="authenticated.role == '1'">Guru</span>
							<span v-if="authenticated.role == '2'">Siswa</span>
						</div> -->
						<div class="navi">
							<a href="#" class="navi-item">
								<span class="navi-link p-0 pb-2">
									<span class="navi-text text-muted">{{ authenticated.email }}</span>
								</span>
							</a>
						</div>
					</div>

				</div>
							<a href="#" class="btn btn-sm btn-primary font-weight-bolder py-2 px-5" @click="logout" :disabled="isLoading">{{ isLoading ? 'Processing...': 'Sign Out' }}</a>
				<div class="separator separator-dashed mt-8 mb-5"></div>
				<div class="navi navi-spacer-x-0 p-0">
					<!--begin::Item-->
					<a href="#" v-b-modal.modal-profile class="navi-item">
						<div class="navi-link">
							<div class="symbol symbol-40 bg-light mr-3">
								<div class="symbol-label">
									<i class="flaticon-user"></i>
								</div>
							</div>
							<div class="navi-text">
								<div class="font-weight-bold">My Profile</div>
								<div class="text-muted">Ubah profile & password<span class="label label-light-danger label-inline font-weight-bold">update</span></div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<b-modal id="modal-profile" title="My profile">
			<div class="form-group">
				<label>Nama</label>
				<input type="text" class="form-control" v-model="authenticated.name">
			</div>
			<div class="form-group">
				<label>Password</label>
				<input type="password" class="form-control" name="" v-model="password">
				<small class="text-muted">Kosongkan bila tidak ingin diubah</small>
			</div>
			<div class="form-group">
				<label>Re-Password</label>
				<input type="password" class="form-control" name="" v-model="repassword" :class="{ 'is-invalid' : not_same }">
			</div>
			<template v-slot:modal-footer="{ cancel }">
				<b-button variant="secondary" @click="cancel()" :disabled="isLoading">
			    	Cancel
			    </b-button>
			    <b-button variant="primary" @click="submit" :disabled="isLoading" v-if="!not_same">
			    	{{ isLoading ? 'Processing...' : 'Simpan' }}
			    </b-button>
			</template>
		</b-modal>
	</div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import { BButton } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'KTQuickUser',
	components: {
		BButton
	},
	data() {
		return {
			not_same: false,
			password: '',
			repassword: ''
		}
	},
	mounted() {
    	KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  	},
  	computed: {
  		...mapGetters(['isLoading']),
  		...mapState('user',['authenticated'])
  	},
  	methods: {
  		...mapActions('auth',['loggedOut']),
  		...mapActions('user', ['updateDataProfile']),
  		async logout() {
  			await this.loggedOut()
  			localStorage.removeItem('token')
            this.$store.state.token = localStorage.getItem('token')
            this.$store.commit('user/CLEAR_AUTH')
            this.$router.push('/login')
  		},
  		submit() {
  			this.updateDataProfile({
  				name: this.authenticated.name,
  				password: this.password
  			})
  			.then((res) => {
  				this.$bvModal.hide('modal-profile')
  				this.$bvToast.toast('Profile berhasil diupdate', successToas())
  			})
  			.catch((error) => {
  				this.$bvToast.toast(error.message, errorToas())
  			})
  		}
  	},
  	watch: {
  		repassword(val) {
  			if(val != this.password) {
  				this.not_same = true
  			} else {
  				this.not_same = false
  			}
  		},
  		password(val) {
  			if(val != this.repassword) {
  				this.not_same = true
  			} else {
  				this.not_same = false
  			}
  		}
  	}
}
</script>