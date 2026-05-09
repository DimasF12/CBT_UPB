<template>
	<div class="aside aside-left d-flex flex-column flex-row-auto" id="kt_aside" ref="kt_aside">
		<div class="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
			<div
			    ref="kt_aside_menu"
			    id="kt_aside_menu"
			    class="aside-menu min-h-lg-800px"
			    data-menu-vertical="1"
			    data-menu-dropdown-timeout="500"
			>
			<VuePerfectScrollbar
		      class="aside-menu scroll"
		      style="max-height: 90vh; position: relative;"
		    >
		    	<KTMenu></KTMenu>
		 	</VuePerfectScrollbar>
			</div>
		</div>
		<!--end::Aside Menu-->
	</div>
</template>
<script>
import KTMenu from "@/components/aside/Menu"
import KTBrand from "@/components/brand/Brand"
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import KTLayoutAside from "@/assets/js/layout/base/aside.js";
import KTLayoutAsideMenu from "@/assets/js/layout/base/aside-menu.js";

export default {
	name: 'Aside',
	components: {
		KTMenu,
		KTBrand,
		VuePerfectScrollbar
	},
	mounted() {
		this.$nextTick(() => {
	      // Init Aside
	      KTLayoutAside.init(this.$refs["kt_aside"]);

	      // Init Aside Menu
	      KTLayoutAsideMenu.init(this.$refs["kt_aside_menu"]);
	    });
	}
}
</script>