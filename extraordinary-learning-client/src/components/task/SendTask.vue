<template>
	<div>	
		<div class="card card-custom shadow-none border" v-if="!task.status">
			<div class="card-header  flex-wrap border-0 p-4">
				<h3 class="card-title align-items-start flex-column">
					<span class="card-label font-weight-bolder text-dark">Kumpulkan Tugas</span>
					<span class="text-dark mt-1 font-weight-bold font-size-sm">Batas {{ task.lastsubmit }}</span>
				</h3>
			</div>
			<div class="card-body p-4">
				<b-form-file multiple @change="onFileChange" v-if="task.type == '0' || task.type == '1'">
				   <template slot="file-name" slot-scope="{ names }">
				     <b-badge variant="success">{{ names[0] }}</b-badge>
				     <b-badge v-if="names.length > 1" variant="success" class="ml-1">
				       + {{ names.length - 1 }} More files
				     </b-badge>
				   </template>
				</b-form-file>
				<ckeditor v-model="content" v-if="task.type == '2' && showEditor" :config="editorConfig"></ckeditor>
				<b-progress v-if="upload_progress != 0" :value="upload_progress" :max="100" show-progress animated></b-progress>

				<button class="btn btn-primary mt-3 btn-block" :disabled="isLoading" @click="submit">{{ isLoading ? 'Processing...' : 'Kumpulkan' }}</button>
			</div>
		</div>
		<div v-else>
			<div class="alert bg-light-success">Anda telah mengumpulkan tugas ini</div>
		</div>
	</div>
</template>
<script>
import { BFormFile, BBadge, BProgress } from 'bootstrap-vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import store from '@/store'

export default {
	name: 'SendTask',
	components: {
		BFormFile,
		BBadge, BProgress
	},
	data() {
		return {
			files: [],
			content: '',
			showEditor: false,
			editorConfig: {
				embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
		        extraPlugins: 'embed',
		        allowedContent: true,
		        fileTools_requestHeaders: {
		        	'Accept': 'application/json',
		        	'Authorization' : 'Bearer '+store.state.token
		        }
		    },
		}
	},
	computed: {
		...mapGetters(['isLoading', 'baseURL']),
		...mapState('task',['task', 'upload_progress']),
	},
	methods: {
		...mapActions('task',['sendTask']),
		async submit() {
			try {
				let formData
				let type
				if(this.task.type == '0' || this.task.type == '1') {
					formData= new FormData()
					for( var i = 0; i < this.files.length; i++ ){
					  let file = this.files[i];

					  formData.append('file[]', file);
					}
					type = 'file'
				} else {
					formData = {
						content: {
							type: 'text',
							body: this.content
						}
					}
					type = 'form'
				}
				let data = {
					'id'	: this.$route.params.id,
					'type' : type,
					'data' : formData
				};
				await this.sendTask(data)
				this.$bvToast.toast('Tugas berhasil dikumpulkan', successToas())
				this.files = []
				this.$router.push({ name: 'task.student' })
			} catch (error) {
				if(error.message == 'Time to submit task has over') {
					this.$bvToast.toast('Waktu pengumpulan sudah berakhir', errorToas())
					return;
				}
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		onFileChange(e) {
            this.files = e.target.files
		},
	},
	created() {
		this.editorConfig.filebrowserUploadUrl = `${this.baseURL}/api/v1/file?`
		this.showEditor = true
	}
}
</script>