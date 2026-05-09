<template>
	<div class="row">
		<div class="col-md-8">	
			<div class="card card-custom shadow-none border">
				<div class="card-body">
					<div class="form-group">
						<label>Body</label>
						<ckeditor v-model="lecture.body" v-if="showEditor" :config="editorConfig" type="inline"></ckeditor>
						<span class="text-danger" v-if="errors.body">{{ errors.body[0] }}</span>
					</div>
					<div class="form-group" v-if="$route.name == 'lecture.add'">
						<label>File pdf (tambahan)</label>
						<div class="input-group">
						  <div class="custom-file">
						    <input type="file" class="custom-file-input" @change="onFileChange">
						    <label class="custom-file-label" for="inputGroupFile04">{{ label == '' ? 'Pilih file pdf' : label }}</label>
						  </div>
						</div>
					</div>
				</div>
			</div> 
		</div>
		<div class="col-md-4">
			<div class="card card-custom shadow-none border">
				<div class="card-body">
					<div class="form-group" v-if="typeof subjects.data != 'undefined'">
						<label>Pelajaran</label>
						<select class="form-control" v-model="lecture.subject_id" :class="{ 'is-invalid' : errors.subject_id }">
							<option v-for="classroom in filteredSubjects" :value="classroom.subject.id">{{ classroom.subject.name }}</option>
						</select>
						<div class="invalid-feedback" v-if="errors.subject_id">{{ errors.subject_id[0] }}</div>
					</div>
					<div class="form-group">
						<label>Judul</label>
						<input type="text" class="form-control" v-model="lecture.title" :class="{ 'is-invalid' : errors.title }"> 
						<div class="invalid-feedback" v-if="errors.title">{{ errors.title[0] }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BFormCheckbox } from 'bootstrap-vue'
import store from '@/store'

export default {
	name: 'FormLecture',
	components: {
		BFormCheckbox
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
		    label: ''
		}
	},
	computed: {
		...mapGetters(['baseURL']),
		...mapState(['errors']),
		...mapState('subject',['subjects']),
		...mapState('lecture', {
			lecture: state => state.lecture
		}),
		...mapState('classroom', ['myclassrooms']),
		filteredSubjects() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.subject.id)) {
					map.set(item.subject.id, true);
					result.push(item)
				}
			}
			return result;
		},
	},
	methods: {
		...mapActions('subject',['getDataSubjects']),
		...mapActions('classroom', ['getDataClassromMine']),
		onFileChange(e) {
			this.lecture.file = e.target.files[0]
			this.label = e.target.files[0].name
		}
	},
	async created() {
		this.getDataClassromMine()
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})

		try {
			await this.getDataSubjects({ perPage: 100})
			this.editorConfig.filebrowserUploadUrl = `${this.baseURL}/api/v1/file?`
			this.showEditor = true
		} catch (error) {
			this.$bvToast.toast(error.message, errorToas())
		}
	}
}
</script>
<style >
	div[contenteditable] {
    outline:1px solid #E4E6EF
}
</style>