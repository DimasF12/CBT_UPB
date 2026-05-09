<template>
	<div class="topbar">
		<KTQuickUser></KTQuickUser>
	</div>
</template>

<script>
import KTQuickUser from "@/components/layout/extras/offcanvas/QuickUser"

export default {
	name: "KTTopbar",
	components: {
		KTQuickUser
	}
}
</script>