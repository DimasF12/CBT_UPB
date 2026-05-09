<template>
	<div class="row">
		<div class="col-md-8">
			<div class="card card-custom shadow-none border">
				<div class="card-body">
					<div class="form-group">
						<label>Body</label>
						<ckeditor v-model="classlive.body" v-if="showEditor" :config="editorConfig"  type="inline"></ckeditor>			
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-4">
			<div class="card card-custom shadow-none">
				<div class="card-body">
					<div class="form-group">
						<label>Media</label>
						<select class="form-control" v-model="classlive.settings.type">
							<option value="youtube">Youtube</option>
							<option value="jitsi">Jitsi Meet</option>
							<option value="any">Materi saja</option>
						</select>
					</div>
					<div class="form-group" v-if="classlive.settings.type == 'jitsi'">
						<label>Jitsi ID</label>
						<input type="text" readonly="" class="form-control" v-model="id_random">
					</div>
					<div class="form-group" v-if="classlive.settings.type == 'youtube'">
						<label>Link youtube</label>
						<input type="text" class="form-control" v-model="classlive.settings.link">
					</div>
					<div class="form-group" v-if="classlive.settings.type == 'zoom'">
						<label>ID Meeting</label>
						<input type="text" class="form-control" v-model="classlive.settings.id_meet" name="">
					</div>
					<div class="form-group" v-if="classlive.settings.type == 'zoom'">
						<label>Meet Password</label>
						<input type="text" class="form-control" v-model="classlive.settings.password">
					</div>
					<div class="form-group">
						<label>Pelajaran</label>
						<v-select label="subject_name" :reduce="item => item.schedule_id" :options="schedules" v-model="classlive.schedule_id">
						</v-select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import store from '@/store'
import { uuid } from 'vue-uuid'; 
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import { successToas, errorToas } from '@/core/entities/notif'

export default {
	name: 'FormClassroomLive',
	components:  {
		VSelect
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
		    data: {
		    	body: '',
		    	subject_id: ''
		    },
		    id_random: uuid.v1(),
		}
	},
	computed: {
		...mapState('subject',['subjects']),
		...mapState('classroom',['classlive', 'schedules'])
	},
	methods: {
		...mapActions('subject',['getDataSubjects']),
		...mapActions('classroom', ['getDataSchedulesToday', 'getDataSchedulesClassroomToday'])
	},
	async created() {
		try {
			this.$store.state.classroom.classlive.settings.id_meet = this.id_random
			await this.getDataSchedulesClassroomToday(this.$route.params.id)
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
    outline: 1px solid #E4E6EF
}
</style>