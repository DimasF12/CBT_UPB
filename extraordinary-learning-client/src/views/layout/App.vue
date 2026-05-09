<template>
	<div>
		<loading :active.sync="loadPage" 
	    :is-full-page="true" :loader="'bars'" :color="'#3699FF'"></loading>
		<div class="d-flex flex-column flex-root" v-if="typeof authenticated.id != 'undefined'">
			<!-- begin:: Header Mobile -->
		    <KTHeaderMobile></KTHeaderMobile>
		    <!-- end:: Header Mobile -->

		    <!-- begin::Body -->
		    <div class="d-flex flex-row flex-column-fluid page" id="kt_body_content">

		    	<!-- begin:: Aside -->
		    	<KTAside></KTAside>
		    	<!-- end:: Aside -->

		    	<div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
		    		<!-- begin:: Header -->
			        <KTHeader></KTHeader>
			        <!-- end:: Header -->

			    	<div class="content d-flex flex-column flex-column-fluid" id="kt_content">
			    		<router-view />
			    	</div>

			    	<KTFooter></KTFooter>
			    </div>
		    </div>
		</div>
	</div>
</template>
<script>
import KTAside from '@/components/aside/Aside'
import KTHeader from '@/components/header/Header'
import KTFooter from '@/components/footer/Footer'
import KTHeaderMobile from '@/components/header/HeaderMobile'
import { mapGetters, mapState } from 'vuex'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'Master',
	components: {
		KTHeader,
		KTAside,
		KTFooter,
		KTHeaderMobile,
		Loading
	},
	data() {
		return {
			channel: ''
		}
	},
	computed: {
		...mapState(['token']),
		...mapGetters(['loadPage']),
		...mapState('user', ['authenticated']),
		...mapState('channel',['center', 'socket', 'setUserToChannel'])
	},
	async created() {
		try {
			if(process.env.VUE_APP_IS_CENTERED == true) {
				this.center.open();
				this.channel = process.env.VUE_APP_KEY
				if(typeof this.authenticated.name != 'undefined') {
					this.center.emit('getin', {
						user: this.authenticated,
						channel: this.channel
					});
				}
			}
			
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	},
	watch: {
		authenticated() {
			if(process.env.VUE_APP_IS_CENTERED == true) {
				this.center.emit('getin', {
					user: this.authenticated,
					channel: this.channel
				});
			}
		}
	},
	destroyed() {
		if(process.env.VUE_APP_IS_CENTERED == true) {
			this.center.emit('exit', { channel: this.channel })
        	this.center.close()
		}
    },
}
</script>
<style lang="css">
	.fade-enter-active, .fade-leave-active {
  		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  		opacity: 0;
	}
</style>