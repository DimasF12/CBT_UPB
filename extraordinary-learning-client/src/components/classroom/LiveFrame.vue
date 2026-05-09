<template>
	<div id="zmmtg-root" ></div>
</template>
<script>
import { ZoomMtg } from '@zoomus/websdk';
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
	name: 'LiveFrame',
	data() {
		return {
			src: "",
	     	meetConfig: {},
	      	signature: {}
		}
	},
	computed: {
		...mapGetters(['baseURL']),
		...mapState('classroom',['classlive']),
		...mapState('user',['authenticated']),
	},
	created() {
	},
	mounted() {
		console.log("checkSystemRequirements");
		console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

		// CDN version default
		ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.7.9/lib', '/av'); 

		ZoomMtg.preLoadWasm();

		ZoomMtg.prepareJssdk();

		this.meetConfig = {
			apiKey: process.env.VUE_APP_ZOOM_KEY,
		    apiSecret: process.env.VUE_APP_ZOOM_SECRET,
		    meetingNumber: this.classlive.settings.id_meet,
		    userName: this.authenticated.name,
		    passWord: this.classlive.settings.passWord,
			leaveUrl: `${this.baseURL}/master/classroom/${this.classlive.classroom_id}/dashboard`,
     		role: 0
		}

		this.signature = ZoomMtg.generateSignature({
			meetingNumber: this.meetConfig.meetingNumber,
			apiKey: this.meetConfig.apiKey,
			apiSecret: this.meetConfig.apiSecret,
			role: this.meetConfig.role,
		});

		ZoomMtg.init({
      		leaveUrl: `${this.baseURL}/master/classroom/${this.classlive.classroom_id}/dashboard`,
      		// isSupportAV: true,
      		success: () => {
        		ZoomMtg.join({
          			meetingNumber: this.meetConfig.meetingNumber,
          			userName: this.meetConfig.userName,
          			signature: this.signature,
          			apiKey: this.meetConfig.apiKey,
          			userEmail: this.authenticated.email,
          			passWord: this.meetConfig.passWord,
          			success: function(res) {
			            // eslint-disable-next-line
			            console.log("join meeting success");
          			},
          			error: function(res) {
          				console.log('eeee')
			            // eslint-disable-next-line
			            console.log(res);
          			}
        		});
      		},
      		error: function(res) {
      			console.log('eeeeree')
		        // eslint-disable-next-line
		        console.log(res);
      		}
    	});

	},
	destroyed() {
		ZoomMtg.leaveMeeting({})
		document.getElementById("zmmtg-root").remove();
	}
}
</script>
<style>
	#zmmtg-root {
	    max-width: 90%;
	    /*he ight: 90%;*/
	    /*position: fixed;*/
	  /*  top: 0;
	    left: 0;
	    background-color: black;*/
	    position: relative;
	    z-index: 1;

	}
	.suspension-window {
	   transform: translate(-444px, 10px) !important;
	}
	#zmmtg-root, .meeting-client, .meeting-client-inner {
	  width: 1000px;
	  height: 500px;
	  position: relative;
	}

	#wc-footer {
	  bottom: auto !important;
	  width: 1000px !important;
	}

	#dialog-join {
	  width: 1000px !important;
	}

	#sv-active-video, .active-main, #sv-active-speaker-view, .main-layout {
	  height: 500px !important;
	  width: 1000px !important;
	}

	.suspension-window {
	  transform: translate(-444px, 10px) !important;
	}

	#dialog-invite {
	  display: none;
	}
	html {
  overflow: scroll;
}
</style>