<template>
	<!--begin::Main-->
		<div class="d-flex flex-column flex-root">
			<!--begin::Login-->
			<div class="login login-6 login-signin-on login-signin-on d-flex flex-row-fluid  bgi-size-cover bgi-position-top bgi-no-repeat" style="background-image: url('/img/bg/bg-3.jpg');">
				<div class="d-flex flex-column flex-lg-row flex-row-fluid text-center" style="background-image: url(assets/media/bg/bg-3.jpg);">
					<!--begin:Aside-->
					<div class="d-flex w-100 flex-center p-15" v-if="typeof school.settings != 'undefined'">
						<div class="login-wrapper">
							<!--begin:Aside Content-->
							<div class="text-dark-75">
								<a href="#">
									<img :src="`${baseURL}/storage/${school.settings.logo}`"  class="max-h-75px" v-if="typeof school.settings.logo != 'undefined'">
									<img src="/img/logo.ico" class="max-h-75px" alt="" v-else />
								</a>
								<h3 class="mb-8 mt-22 font-weight-bold">{{ school.settings.name }}</h3>
								<p class="mb-15 text-muted font-weight-bold">{{ school.settings.email }}</p>
							</div>
							<!--end:Aside Content-->
						</div>
					</div>
					<!--end:Aside-->
					<!--begin:Divider-->
					<div class="login-divider">
						<div></div>
					</div>
					<!--end:Divider-->
					<!--begin:Content-->
					<div class="d-flex w-100 flex-center p-15 position-relative overflow-hidden">
						<div class="login-wrapper">
							<!--begin:Sign In Form-->
							<div class="login-signin">
								<div class="text-center mb-10 mb-lg-20">
									<h2 class="font-weight-bold">Sign In</h2>
									<p class="text-muted font-weight-bold">Masukan email dan password anda</p>
								</div>
								<div class="alert alert-custom alert-light-primary fade show mb-5" role="alert" v-if="errors.invalid">
									<div class="alert-icon">
										<i class="flaticon-warning"></i>
									</div>
									<div class="alert-text">{{ errors.invalid }}</div>
									<div class="alert-close">
										<button type="button" class="close" data-dismiss="alert" aria-label="Close">
											<span aria-hidden="true">
												<i class="ki ki-close"></i>
											</span>
										</button>
									</div>
								</div>

								<form class="form text-left" @submit.prevent="postLogin">
									<div class="form-group py-2 m-0">
										<input class="form-control h-auto border-0 px-0 placeholder-dark-75" type="text" placeholder="Email" autocomplete="off" :class="{ 'is-invalid' : errors.email }" v-model="data.email" />
										<div class="invalid-feedback" v-if="errors.email">{{ errors.email[0] }}</div>
									</div>
									<div class="form-group py-2 border-top m-0">
										<input class="form-control h-auto border-0 px-0 placeholder-dark-75" type="Password" placeholder="Password" :class="{ 'is-invalid' : errors.password }" v-model="data.password" />
										<div class="invalid-feedback" v-if="errors.password">{{ errors.password[0] }} </div>
									</div>
									<div class="text-center mt-15">
										<button id="kt_login_signin_submit" class="btn btn-primary shadow-sm py-4 px-9 font-weight-bold" :disabled="isLoading" @click="postLogin">{{ isLoading ? 'Processing...' : 'Sign In' }}</button>
									</div>
								</form>
							</div>
							<!--end:Sign In Form-->
						</div>
					</div>
					<!--end:Content-->
				</div>
			</div>
		</div>
			<!--end::Login-->
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	data() {
		return {
			data: {
				email: '',
				password: ''
			}
		}
	},
	computed: {
		...mapGetters(['isAuth', 'isLoading', 'baseURL']),
		...mapState(['errors']),
		...mapState('setting',['school'])
	},
	methods: {
		...mapActions('auth', ['submit']),
		...mapActions('user', ['getUserLogin']),
		async postLogin() {
			try {
				await this.submit(this.data)
				if (this.isAuth) {
					this.getUserLogin()
					this.$router.push({ name: 'home' })
				}
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	async created() {
		if(this.isAuth) {
			this.$router.push({ name: 'home' })
		}
	}
}
</script>