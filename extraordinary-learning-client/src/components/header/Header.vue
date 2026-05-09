<template>
	<!-- begin:: Header
 	  v-bind:class="headerClasses" -->
 	<div
 	  id="kt_header"
 	  ref="kt_header"
 	  class="header header-fixed"
 	>
 		<div class="container d-flex align-items-stretch justify-content-between">
 			<!--begin::Left-->
 			<LeftMenu />
 			<!--end::Left-->
 			<!--begin::right-->
 			<TopBar />
 			<!--end::right-->
 		</div>
	</div>
</template>
<script>
import LeftMenu from "@/components/header/LeftMenu"
import TopBar from '@/components/header/TopBar'

export default {
	name: 'Header',
	components: {
		LeftMenu,
		TopBar
	}
}
</script>
<style lang="css">
	@media (min-width: 992px){
		.header-fixed .header {
				position: fixed;
				top: 0;
				right: 0;
				left: 0;
				z-index: 97;
				height: 60px;
				transition: all 0.3s ease;
		}
		}
</style>