<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card card-custom shadow-none border">
					<div class="card-header flex-wrap border-0 pt-6 pb-0">
						<h3 class="card-title align-items-start flex-column">
							<span class="card-label font-weight-bolder text-dark">{{ datad.name }}</span>
							<span class="text-muted mt-1 font-weight-bold font-size-sm">{{ starter }}</span>
						</h3>
					</div>
					<div class="card-body">
						<table class="table table-bordered">
							<tr>
								<td width="">Tanggal</td>
								<td>{{ datad.date }}</td>
							</tr>
							<tr>
								<td>Mulai</td>
								<td>{{ datad.start_time }}</td>
							</tr>
							<tr>
								<td>Alokasi waktu</td>
								<td>{{ Math.floor(datad.duration / 60) }} Menit</td>
							</tr>
						</table>
						<div class="alert alert-custom alert-light-primary fade show mb-5"  v-if="disabled">
							<div class="alert-icon">
								<i class="flaticon-info"></i>
							</div>
							<div class="alert-text">Tomboh MULAI hanya akan muncul apabila waktu sekarang sudah melewati waktu mulai tes</div>
						</div>
						<b-button variant="primary" pills block @click="start" v-if="!disabled"  :disabled="isLoading">
							{{ isLoading ? 'Processing...' : 'MULAI' }}
						</b-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'
import { BButton } from 'bootstrap-vue'

export default {
	name: 'WaitingExam',
	components: {
		BButton
	},
	data() {
		return {
			disabled: true,
			time: '',
			starter: '',
			datad: {}
		}
	},
	computed: {
		...mapGetters(['isLoading']),
		...mapState('exam', ['active', 'schedules'])
	},
	methods: {
		...mapActions('exam', ['startDoExam']),
		async start() {
			try {
				await this.startDoExam()
				this.$router.replace({
					name: 'exam.while'
				})
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		startTime() {
            setInterval( () => {
                this.time = new Date()
            }, 1000 )
        },
		changeData() {
            if(typeof this.active.exam_schedule_id != 'undefined') {
                if(this.schedules.length != 'undefined') {
                    let index;
                    if(this.schedules.length == 1) {
                        index = 0;    
                    } else {
                        index = this.schedules.map(item => item.id).indexOf(this.active.exam_schedule_id)
                    }
                    if(index !== -1) {
                        this.datad = this.schedules[index]
                        const date = new Date(this.datad.date)
                        const ye = date.getFullYear()
                        const mo = date.getMonth()
                        const da = date.getDate()
                        const mulai = this.datad.start_time
                        const splicer = mulai.split(":")
                        const h = parseInt(splicer[0])
                        const i = parseInt(splicer[1])
                        const s = parseInt(splicer[2])
                        const rest = new Date(ye,mo,da,h,i,s)
                        this.starter = rest
                        this.startTime()
                    }
                }
            }
        }
	},
	created() {
		this.changeData()
	},
	watch: {
		active() {
			this.changeData()
		},
		schedules() {
			this.changeData()
		},
		time() {
            if(this.starter < this.time) {
                this.disabled = false
            }
        }
	}
}
</script>