<template>
	<div class="row">
		<div class="col-md-8">	
			<div class="card card-custom shadow-none border">
				<div class="card-body">
					<div class="form-group">
						<label>Body</label>
						<ckeditor v-model="task.body" v-if="showEditor" :config="editorConfig" type="inline"></ckeditor>
						<span class="text-danger" v-if="errors.body">{{ errors.body[0] }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-4">
			<div class="card card-custom shadow-none border">
				<div class="card-body">
					<div class="form-group">
						<label>Judul</label>
						<input type="text" class="form-control" v-model="task.title"  :class="{ 'is-invalid' : errors.title }">
						<div class="invalid-feedback" v-if="errors.title">{{ errors.title[0] }}</div>
					</div>
					<div class="form-group">
						<label>Jenis tugas</label>
						<select class="form-control" v-model="task.type"  :class="{ 'is-invalid' : errors.type }">
							<option value="0">Gambar upload</option>
							<option value="1">File upload</option>
							<option value="2">Esay</option>
						</select>
						<div class="invalid-feedback" v-if="errors.type">{{ errors.type[0] }}</div>
					</div>
					<div class="form-group">
						<label>Deadline</label>
						<VueCtkDateTimePicker v-model="task.deadline" format='YYYY-MM-DD HH:mm' formatted="YYYY-MM-DD HH:mm"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { BFormCheckbox } from 'bootstrap-vue'
import store from '@/store'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

export default {
	name: 'FormTask',
	components: {
		BFormCheckbox, VueCtkDateTimePicker
	},
	data() {
		return {
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
		...mapGetters(['baseURL']),
		...mapState('task',['task']),
		...mapState(['errors']),
	},
	created() {
		this.editorConfig.filebrowserUploadUrl = `${this.baseURL}/api/v1/file?`
		this.showEditor = true
	}
}
</script>
<style >
	div[contenteditable] {
    outline: 1px solid #E4E6EF
}
</style>