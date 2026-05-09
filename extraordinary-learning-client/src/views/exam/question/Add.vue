<template>
	<div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom">
				<div class="card-header flex-wrap border-0 pt-6 pb-0">
					<h3 class="card-title align-items-start flex-column">
						<span class="card-label font-weight-bolder text-dark">Tambah soal</span>
						<span class="text-muted mt-1 font-weight-bold font-size-sm">Tambah soal dengan perhatian & cinta</span>
					</h3>
					<div class="card-toolbar">
						<div class="dropdown dropdown-inline">
							<router-link :to="{ name: 'exam.bank.questions', params: { id: $route.params.id} }" class="btn btn-light-primary mr-2">
								<i class="flaticon2-left-arrow-1"></i>Kembali
							</router-link>
							<button class="btn btn-primary" :disabled="isLoading" @click="submit">
								<i class="flaticon-doc"></i>{{ isLoading ? 'Processing...' : 'Simpan' }}
							</button>
						</div>
					</div>
				</div>
			</div>
			<form-question />
		</div>
	</div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import FormQuestion from './FormQuestion'

export default {
	name: 'AddQuestion',
	components: {
		FormQuestion
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('question',['question','setting'])
	},
	methods: {
		...mapActions('question', ['createDataQuestion']),
		initOption() {
			for(let i = 0; i < this.setting.opsi_max; i++) {
				let option = ''
				this.$store.state.question.question.options.push(option)
			}
		},
		async submit() {
			try {
				if (this.question.correct === null && this.question.type == 1) {
			        this.$swal({
			          title: 'Kunci jawaban kosong',
			          text: "Pilih jawaban yang benar",
			          icon: 'error',
			        })
			        return
			    }
				await this.createDataQuestion()
				this.initOption()
				this.$bvToast.toast('Soal berhasil disimpan', successToas())
				this.$store.state.question.question.question_bank_id = this.$route.params.id
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		}
	},
	created() {
		this.$store.commit('question/CLEAR_QUESTION')
		this.$store.state.question.question.question_bank_id = this.$route.params.id
		this.initOption()
	}
}
</script>