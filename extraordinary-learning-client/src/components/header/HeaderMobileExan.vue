<template>
	<div
	    id="kt_header_mobile"
	    class="header-mobile align-items-center"
	>
		<a href="#"  v-if="typeof school.settings != 'undefined'">
			<img :src="`${baseURL}/storage/${school.settings.logo}`"  class="logo-sticky max-h-35px" v-if="typeof school.settings.logo != 'undefined'">
			<img alt="Logo" src="/img/logo.ico" class="logo-sticky max-h-35px" v-else />
		</a>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
	name: 'LeftMenu',
	computed: {
		...mapGetters(['baseURL']),
		...mapState('setting', ['school'])
	}
}
</script>