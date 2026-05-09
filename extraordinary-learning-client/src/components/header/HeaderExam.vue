<template>
	<!-- begin:: Header
 	  v-bind:class="headerClasses" -->
 	<div
 	  id="kt_header"
 	  ref="kt_header"
 	  class="header header-fixed"
 	>
 		<div class="container d-flex align-items-stretch justify-content-between">
 			<div class="d-none d-lg-flex align-items-center mr-3">
 				<a href="#"  v-if="typeof school.settings != 'undefined'">
					<img :src="`${baseURL}/storage/${school.settings.logo}`"  class="logo-sticky max-h-35px" v-if="typeof school.settings.logo != 'undefined'">
					<img alt="Logo" src="/img/logo.ico" class="logo-sticky max-h-35px" v-else />
				</a>
 			</div>
 		</div>
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