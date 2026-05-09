<template>
	<div>
		<div v-if="typeof public_infos.data != 'undefined' && public_infos.data.length > 0">
			<div class="card card-custom gutter-b shadow-none border" v-for="info in public_infos.data" :key="info.id">
				<div class="card-body p-4">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light mr-5">
							<span class="symbol-label">
								<img src="/img/007-boy-2.svg" class="h-75 align-self-end" alt="" />
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								{{ info.title }}
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary pr-1">
									</span>
									<span class="text-muted font-weight-bold">{{ info.created_at }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="pt-3" v-html="info.body">
					</div>
				</div>
			</div>
			<div class="d-flex justify-content-between align-items-center flex-wrap mt-5">
			  <b-pagination
			    v-model="page"
			    :total-rows="public_infos.total"
			    :per-page="public_infos.per_page"
			    :disabled="isLoading"
			  ></b-pagination>
			</div>
		</div>
		<div v-else>
			<div class="">
				<div class="">
					<p class="text-muted">Tidak ada informasi yang dibagikan</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BPagination, BDropdown, BDropdownItem } from 'bootstrap-vue'

export default {
	naem: 'SchoolInfo',
	components: {
		BButton, BPagination, BDropdownItem, BDropdown
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('info', ['public_infos']),
		page: {
			get() {
				return this.$store.state.info.public_page
			},
			set(val) {
				this.$store.commit('info/SET_PUBLIC_PAGE', val)
			}
		}
	},
	methods: {
		...mapActions('info', ['getDataInfosPublic'])
	},
	created() {
		this.getDataInfosPublic()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		page() {
			this.getDataInfosPublic()
			.catch((error) => {
				this.$bvToast.toast(error.message, errorToas())
			})
		}
	}
}
</script>