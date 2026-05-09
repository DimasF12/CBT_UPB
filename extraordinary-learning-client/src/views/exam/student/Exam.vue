<template>
	<div>
		<loading :active.sync="loadPage" 
        :is-full-page="true" :loader="'bars'" :color="'#187DE4'"></loading>

        <div class="container">
        	<div class="card card-custom shadow-none border">
                <div class="card-header flex-wrap p-4">
                    <div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-primary mr-5">
							<span class="symbol-label">
								{{ questionIndex + 1 }}
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Nomor
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Kerjakan soal dengan jujur</span>
								</div>
							</div>
						</div>
					</div>
                    <div class="card-toolbar">
                        <div class="">
                             <div class="btn-group">
                              <button type="button" class="btn btn-outline-primary btn-soal"><i class="flaticon2-hourglass-1"></i> {{ prettyTime }}</button>
                              <b-button variant="primary" v-b-modal.nomorSoal :disabled="!listening" class=""><i class="flaticon-apps"></i> Daftar Soal</b-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0 p-4" v-if="typeof filleds[questionIndex] != 'undefined'">
                    <table class="table table-borderless">
                        <tr>
                            <td colspan="2" :style="'font-size:'+range+'px !important'" 
                                v-html="filleds[questionIndex].question.question"></td>
                        </tr>
                        <tr v-for="(option,index) in filleds[questionIndex].question.options" :key="index">
                            <td width="50px" :style="'font-size:'+range+'px !important'">
                                <!-- <b-form-radio size="lg" v-model="selected" name="jwb" :value="option.id"  @change="selectOption(index)">
                                    <span class="text-uppercase">{{ index | charIndex }}</span>.
                                </b-form-radio> -->
                                <label class="radio radio-lg radio-primary">
									<input type="radio" :value="option.id" v-model="selected"  @change="selectOption(index)">
									<span class="text-uppercase" ><span v-if="option.id !== selected">{{ index | charIndex }}</span></span>
								</label>
                            </td>
                            <td :style="'font-size:'+range+'px !important'" v-html="option.body"></td>
                        </tr>
                        <tr v-if="filleds[questionIndex].question.type == 2">
                            <td height="auto">
                                <ckeditor v-model="filleds[questionIndex].esay" :config="editorConfig"
                                 @input="changeAnwerEsay" >
                                </ckeditor>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="card-footer p-4" v-if="filleds[questionIndex]">
                    <div class="d-flex justify-content-between ">
                        <b-button variant="primary" class="sebelum" size="md"
                        @click="prev()" v-if="questionIndex != 0" :disabled="isLoading">
                            <span class="flaticon2-back"></span>
                            <!-- Sebelumnya -->
                        </b-button>
                         <button id="soal-ragu" class="btn btn-warning" :disabled="isLoading">
                            <b-form-checkbox size="lg" :value="1" v-model="filleds[questionIndex].doubt" :disabled="isLoading" @change="sendDoubt()">
                                Ragu ragu
                            </b-form-checkbox>
                        </button>
                         <b-button variant="primary" class="sesudah" size="md" :disabled="isLoading" @click="next()" v-if="questionIndex+1 != filleds.length">
                            <!-- Selanjutnya  -->
                            <span class="flaticon2-next"></span>
                        </b-button>
                        <b-button variant="success" class="sesudah" size="md" @click="$bvModal.show('modal-selesai')" v-if="questionIndex+1 == filleds.length && checkDoubt() == false" :disabled="isLoading">
                            <!-- SELESAI UJIAN -->
                            <i class="flaticon2-check-mark"></i> 
                        </b-button>
                        <b-button variant="danger" class="sesudah" size="md" :disabled="isLoading" v-b-modal.modal-1 v-if="questionIndex+1 == filleds.length && checkDoubt() == true">
                            <!-- SELESAI UJIAN -->
                            <i class="flaticon2-check-mark"></i> 
                        </b-button>
                    </div>

                </div>
            </div>
        </div>
         <b-modal id="modal-selesai" class="shadow" @hide="isKonfirm = false">
            <template v-slot:modal-header="{ close }">
              <h5>Konfirmasi</h5>
            </template>

            <template v-slot:default="{ hide }">
              <b-form-checkbox size="lg" v-model="isKonfirm">Saya sudah selesai mengerjakan</b-form-checkbox>
            </template>

            <template v-slot:modal-footer="{ cancel }">
                  <b-button variant="success" @click="finish()" :disabled="!isKonfirm">
                    Selesai
                  </b-button>
                  <b-button variant="secondary" @click="cancel()">
                    Batal
                  </b-button>
            </template>
         </b-modal>
          <b-modal id="modal-1" class="shadow">
            <template v-slot:modal-header="{ close }">
              <h5>Ragu ragu</h5>
            </template>
            <p>Masih ada jawaban ragu ragu</p>
            <template v-slot:modal-footer="{ cancel }">
                  <b-button size="sm" variant="secondary" @click="cancel()">
                    Tutup
                  </b-button>
            </template>
         </b-modal>
         <b-modal id="nomorSoal" title="Nomor Soal" size="lg" class="shadow">
            <template v-slot:modal-footer="{ cancel }">
              <b-button variant="secondary" @click="cancel()">
                Tutup
              </b-button>
            </template>
            <template v-slot:default="{ hide }">
                <ul class="nomor-soal" id="nomor-soal">
                    <li v-for="(fiel,index) in filleds" :key="index">
                        <a href="#" :class="{
                        'isi' : (fiel.answer != 0 || fiel.esay != ''),
                        'ragu' : (fiel.doubt == 1),
                        'active' : (index == questionIndex)}" @click.prevent="toLand(index)" :disabled="isLoading">
                            {{ index+1 }} 
                            <span></span>
                        </a>
                    </li>
                </ul>
            </template>
        </b-modal>
	</div>
</template>
<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { mapActions, mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton, BFormInput, BFormRadio, BFormCheckbox } from 'bootstrap-vue'

export default {
	name: 'StudentExam',
	components: {
		Loading, BButton, BFormInput, BFormRadio, BFormCheckbox
	},
	data() {
		return {
			questionIndex: '',
            selected: '',
            patt: 17,
            sidebar: false,
            doubt: '',
            time: 0,
            isKonfirm : false,
            interval: '',
            audio: '',
            direction: '',
            listening: true,
            hasdirec: [],
            range: 16,
            editorConfig: {
                allowedContent: true,
                removeButtons: 'PasteText,PasteFromWord,Paste,Image,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Source,Styles,About'
            }
		}
	},
	filters: {
		charIndex(i) {
			return String.fromCharCode(97 + i)
		}
	},
	computed: {
		...mapGetters(['isLoading', 'loadPage']),
		...mapState('exam', ['active', 'answers']),
        prettyTime() {
            let sec_num = parseInt(this.time, 10)
            let hours   = Math.floor(sec_num / 3600)
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
            let seconds = sec_num - (hours * 3600) - (minutes * 60)
            return hours+':'+minutes+':'+seconds 
        },
        filleds() {
            return this.answers.data
        },
        detail() {
            return this.answers.detail
        },
	},
	methods: {
		...mapActions('exam' ,['getDataExamAnswers', 'storeDataExamAnswer', 'storeDataExamDoubt', 'finishingExam']),
		start () {
            this.timer = setInterval( () => {
                if (this.time > 0) {
                     this.time--
                } else {

                }
            }, 1000 )
        },
        async finish () {
        	try {
                await this.finishingExam()

                this.$router.push({ name: 'exam.finish' })
                clearInterval(this.interval); 
            } catch (error) {
                this.$bvToast.toast(error.message, errorToas())
            }
        },
		selectOption(index) {
            const fill = this.filleds[this.questionIndex]

            this.storeDataExamAnswer({ 
                answer_id : this.filleds[this.questionIndex].id,
                answer : this.filleds[this.questionIndex].question.options[index].id,
                index : this.questionIndex
            })
            .catch((error) => {
                this.$bvToast.toast('Terjadi kesalahan, saat memilih opsi', errorToas())
            })
        },
        inputAnswerEsay(val) {
            const fill = this.filleds[this.questionIndex]

            this.storeDataExamAnswer({ 
                answer_id : this.filleds[this.questionIndex].id,
                index : this.questionIndex,
                esay: fill.esay
            })
            .catch((error) => {
                this.$bvToast.toast(error.message, errorToas())
            })
        },
        changeAnwerEsay: _.debounce(function (value) {
          this.inputAnswerEsay(value)
        }, 500),
        prev() {
            if (this.filleds.length > 0) this.questionIndex--
        },
        next() {
            if (this.questionIndex < this.filleds.length) this.questionIndex++
        },
        toggle() {
            this.sidebar = !this.sidebar;
        },
        toLand(index) {
            this.questionIndex = index
        },
        sendDoubt(val) {
        	const fill = this.filleds[this.questionIndex]
            let ragu = fill.doubt == false || fill.doubt == '0' ? 1 : 0;

            this.storeDataExamDoubt({ 
                doubt: ragu,
                answer_id : this.filleds[this.questionIndex].id,
                index : this.questionIndex
            })
            .catch((error) => {
                this.$bvToast.toast('Terjadi kesalahan saat menyimpan ragu ragu', errorToas())
            })
        },
        checkDoubt() {
        	let ragger = 0
            this.filleds
            .filter(function(element) {
                if (element.doubt == "1") {
                   ragger++
                }
            })

            if (ragger > 0) {
                return true
            }
            return false
        }
	},
	created() {
		this.getDataExamAnswers()
		.then((res) => {
			this.start()
		})
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
		})
	},
	watch: {
		questionIndex() {
			this.selected = this.filleds[this.questionIndex].answer
			this.doubt = this.filleds[this.questionIndex].doubt
		},
		filleds() {
			this.questionIndex = 0
		},
		detail(val) {
			this.time = val.remaining
			this.interval = setInterval( () => {
                if (this.time < 0) {
                    this.finish()
                }
            }, 3000 )
		}
	}
}
</script>