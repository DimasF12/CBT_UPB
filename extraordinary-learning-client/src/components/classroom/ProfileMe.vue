<template>
	<div class="card card-custom gutter-b shadow-none border">
		<div class="card-body p-4">
			<div class="d-flex align-items-center">
				<div class="symbol symbol-40 symbol-light-success mr-5">
					<span class="symbol-label">
						<img src="/img/007-boy-2.svg" class="h-75 align-self-end" alt="" />
					</span>
				</div>
				<span class="text-dark font-weight-bold font-size-lg">
					{{ authenticated.name }}<br>
					<small>Selamat datang di kelas</small>
				</span>
			</div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  computed: {
		...mapGetters(['isLoading']),
		...mapState('user', ['authenticated'])
	},
}
</script>