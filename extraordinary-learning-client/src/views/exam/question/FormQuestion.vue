<template>
	<div class="row">
		<div class="col-md-12">
			<div class="">
				<div class="">
					<div class="form-group">
						<ckeditor v-model="question.question" v-if="showEditor" :config="editorConfig" type="inline"></ckeditor>
						<span class="text-danger" v-if="errors.question">{{ errors.question[0] }}</span>
					</div>
				</div>
			</div>
			<div class="" v-if="question.type == '1'">
				<div class="">
					<div class="form-group">
						<transition name="fade">
						<table class="table table-borderless" v-if="show_list">
							<tr v-for="(option, index) in question.options" :key="index">
								<td width="20px">
									<label class="radio radio-lg radio-success">
										<input type="radio" checked="checked" :value="index" v-model="question.correct">
										<span class="text-uppercase" ><span v-if="index !== question.correct">{{ index | charIndex }}</span></span>
									</label>
								</td>
								<td>
									<ckeditor v-model="question.options[index]" v-if="showEditor" :config="editorConfig" type="inline"></ckeditor>
								</td>
								<td width="20px">
									<button class="btn btn-light-danger btn-icon btn-sm" @click="removeOption(index)" v-if="![0,1].includes(index)">
										<i class="flaticon-cancel"></i>
									</button>
								</td>
							</tr>
						</table>
						</transition>
						<div class="d-flex">
							<button class="btn btn-light-success btn-sm" @click="addOption"><i class="flaticon2-add"></i> Tambah opsi</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import store from '@/store'
import { BFormRadio } from 'bootstrap-vue'

export default {
	name: 'FormQuestion',
	components: {
		BFormRadio
	},
	data: () => ({
		showEditor: false,
		show_list: true,
		opsi_max: 5,
		editorConfig: {
			allowedContent: true,
			fileTools_requestHeaders: {
		        'Accept': 'application/json',
		        'Authorization' : 'Bearer '+store.state.token
		    },
		    height: 200,
		    extraPlugins : 'justify,sourcedialog',
		    FloatingPanelsZIndex : 100001
		}
	}),
	filters: {
		charIndex(i){
			return String.fromCharCode(97+i)
		}
	},
	computed: {
		...mapGetters(['baseURL']),
		...mapState(['errors']),
		...mapState('question',['question','options','setting'])
	},
	methods: {
		change() {

		},
		async removeOption(index) {
			if(index !== -1) {
				this.show_list = false
				await this.$store.commit('question/REMOVE_QUESTION_OPTION', index)
				this.show_list = true
			}
		},
		addOption() {
			let option = ''
			this.$store.state.question.question.options.push(option)
		}
	},
	created() {
		this.editorConfig.filebrowserUploadUrl = `${this.baseURL}/api/v1/file?`
		this.showEditor = true
	},
	watch: {
		opsi_max(val) {
			this.$store.state.question.question.options = []
			for(let i = 0; i < val; i++) {
				let option = ''
				this.$store.state.question.question.options.push(option)
			}
			this.$store.state.question.setting.opsi_max = val
		}
	}
}
</script>
<style >
	div[contenteditable] {
    outline:1px solid #E4E6EF
}
</style>