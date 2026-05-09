<template>
	<div
	    id="kt_header_mobile"
	    class="header-mobile align-items-center"
	>
		<a href="#"  v-if="typeof school.settings != 'undefined'">
			<img :src="`${baseURL}/storage/${school.settings.logo}`"  class="logo-sticky max-h-35px" v-if="typeof school.settings.logo != 'undefined'">
			<img alt="Logo" src="/img/logo.ico" class="logo-sticky max-h-35px" v-else />
		</a>

	    <div class="d-flex align-items-center">
	    	<button
		        class="btn p-0 burger-icon burger-icon-left"
		        id="kt_aside_tablet_and_mobile_toggle"
		        ref="kt_aside_tablet_and_mobile_toggle"
		    >
		    	<span></span>
			</button>
			<button
		        class="btn btn-hover-text-primary p-0 ml-2"
		        id="kt_header_mobile_topbar_toggle"
		        ref="kt_header_mobile_topbar_toggle"
		    >
		        <span class="svg-icon svg-icon-xl">
		          <!--begin::Svg Icon | path:svg/icons/General/User.svg-->
		          <inline-svg class="svg-icon" src="/media/svg/icons/General/User.svg" />
		          <!--end::Svg Icon-->
		        </span>
		    </button>
	    </div>
	</div>
</template>
<script>
import KTLayoutHeaderTopbar from "@/assets/js/layout/base/header-topbar.js";
import { mapState, mapGetters } from 'vuex'

export default {
	name: 'HeaderMobile',
	mounted() {
	    // Init Header Topbar For Mobile Mode
	    KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
	},
	computed: {
		...mapGetters(['baseURL']),
		...mapState('setting', ['school'])
	}
}
</script>