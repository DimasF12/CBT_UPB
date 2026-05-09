<template>
	<div class="container">
		<div class="card">
			<div class="card-body">
				<div class="form-group">
					<label>Room ID</label>
					<input type="text" class="form-control" v-model="room_id">
				</div>
				<div class="form-group">
					<button class="btn btn-primary mr-1" :disabled="disable" @click="openRoom">Open Room</button>
					<button class="btn btn-success" :disabled="disable" @click="joinRoom">Join Room</button>
				</div>
				<div id="videos-container"></div>
			</div>
		</div>
	</div>
</template>
<script>
import RTCMultiConnection from '@/assets/js/RTCMultiConnection.js'
import { getHTMLMediaElement, getAudioElement } from '@/assets/js/getHTMLMediaElement.js'
var connection = new RTCMultiConnection();

export default {
	data() {
		return {
			room_id: '',
			disable: false
		}
	},
	methods: {
		openRoom() {
			this.disable = true;
			connection.open(this.room_id, () => {

			})
		},
		joinRoom() {
			this.disable = true;
			connection.sdpConstraints.mandatory = {
				OfferToReceiveAudio: false,
				OfferToReceiveVideo: true
			}
			connection.join(this.room_id)
		}
	},
	mounted() {
		connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
		connection.socketMessageEvent = 'screen-sharing-demo';

		connection.session = {
			screen: true,
			oneway: true
		}

		connection.sdpConstraints.mandatory = {
			OfferToReceiveVideo: false,
			OfferToReceiveAudio: false
		}

		connection.iceServer = [{

		}]
		
		connection.iceServers = [
			{
				urls: [ 
					"stun:ws-turn8.xirsys.com" 
				]
			}, 
			{   username: "Z3Q6LObCuS1wdYbAJMLTSl_TAR_vjIAAcTf28xmWKecAjPHsCkR6fymK-NMAQe6yAAAAAF9I8wZzaGVsbHJlYW4=",   credential: "c234e310-e926-11ea-a0d4-0242ac140004",   
				urls: [       
					"turn:ws-turn8.xirsys.com:80?transport=udp",       
					"turn:ws-turn8.xirsys.com:3478?transport=udp",       
					"turn:ws-turn8.xirsys.com:80?transport=tcp",       
					"turn:ws-turn8.xirsys.com:3478?transport=tcp",       
					"turns:ws-turn8.xirsys.com:443?transport=tcp",       
					"turns:ws-turn8.xirsys.com:5349?transport=tcp"   
				]
			}
		]

		connection.videosContainer = document.getElementById('videos-container')
		connection.onStream = (event) => {
			var existing = document.getElementById(event.stremid);
			if(existing && existing.parentNode) {
				existing.parentNode.removeChild(existing)
			}

			event.mediaElement.removeAttribute('src')
			event.mediaElement.removeAttribute('srcObject')
			event.mediaElement.muted = true
			event.mediaElement.volume = 0

			var video = document.createElement('video')

			try {
				video.setAttributeNode(document.createAttribute('autoplay'))
				video.setAttributeNode(document.createAttribute('playsinline'))
			} catch (e) {
				video.setAttribute('autoplay', true)
				video.setAttribute('playsinline', true)
			}

			if (event.type === 'local') {
				video.volume = 0;
				try {
					video.setAttributeNode(document.createAttribute('muted'))
				} catch (e) {
					video.setAttribute('muted', true)
				}
			}
			video.srcObject = event.stream;

			var width = innerWidth - 80
			var mediaElement = getHTMLMediaElement(video, {
				title: event.userid,
				button: ['full-screen'],
				width: width,
				showOnMouseEnter: false
			})

			connection.videosContainer.appendChild(mediaElement)

			setTimeout(() => {
				mediaElement.media.play()
			}, 5000)

			mediaElement.id = event.stremid
		}

		connection.onstreamended = function(event) {
		    var mediaElement = document.getElementById(event.streamid);
		    if (mediaElement) {
		        mediaElement.parentNode.removeChild(mediaElement);

		        if(event.userid === connection.sessionid && !connection.isInitiator) {
		          alert('Broadcast is ended. We will reload this page to clear the cache.');
		          location.reload();
		        }
		    }
		};

		connection.onMediaError = function(e) {
			console.log(e.message)
		}
	}
}
</script>