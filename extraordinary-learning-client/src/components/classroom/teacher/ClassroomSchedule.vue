<template>
  <div class="table-responsive">
    <table class="table table-bordered mt-2" v-for="(days,index) in filteredSchedules" :key="index">
        <tr>
          <th colspan="4" class="bg-light-primary">{{ days[0].day | dayIndex }}</th>
        </tr>
        <tbody>
          <tr v-for="schedule in days" :key="schedule.id">
            <td class="font-bold">
              {{ schedule.from_time }} - 
              {{ schedule.end_time }}
            </td>
            <td width="50px">
              <b-dropdown  variant="link" toggle-class="text-decoration-none" 
                no-caret  
                class="bg-hover-light-primary rounded-pill btn-icon"
              >
								<template v-slot:button-content>
									<span class="flaticon-more text-secondary"></span>
								</template>
								<b-dropdown-item @click="getSchedule(schedule.id)">Edit</b-dropdown-item>
								<b-dropdown-item @click="deleteSchedule(schedule.id)">Hapus</b-dropdown-item>
							</b-dropdown>
            </td>
          </tr>
        </tbody>
    </table>
    <span class="text-muted" v-if="filteredSchedules.length === 0">Tidak ada data jadwal</span>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { BButton, BDropdownItem, BDropdown } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
  name: 'TeacherClassroomSchedule',
  components: {
    BButton, BDropdownItem, BDropdown
  },
  data(){
    return {
      
    }
  },
  computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('classroom',['schedule', 'schedules']),
		filteredSchedules() {
			let group = this.schedules.reduce((r, a) => {
				r[a.day] = [...r[a.day] || [], a];
			 	return r;
			}, {});
			return Object.values(group)
		}
  },
  filters: {
		dayIndex(i){
			let days= [
				{ id: 1, name: 'Senin' },
				{ id: 2, name: 'Selasa' },
				{ id: 3, name: 'Rabu' },
				{ id: 4, name: 'Kamis' },
				{ id: 5, name: 'Jumat' },
				{ id: 6, name: 'Sabtu' }
			]
			let index = days.map(item => item.id).indexOf(parseInt(i))
			if(index !== -1) {
				return days[index].name
			}
			return 'Day not found'
    },
  },
  methods: {
    ...mapActions('classroom', ['getDataSchedule', 'deleteDataSchedule']),
    async getSchedule(id) {
			try {
				await this.getDataSchedule(id)
				this.$bvModal.show('modal-schedule-add')
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
    },
    deleteSchedule(id) {
			this.$swal({
        title: 'Informasi',
        text: "Jadwal akan dihapus beserta dengan data yang terkait",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#c3c3c3',
        confirmButtonText: 'Lanjutkan!'
      }).then(async (result) => {
        if (result.value) {
					try {
						await this.deleteDataSchedule(id)
            this.$bvToast.toast('Jadwal berhasil dihapus', successToas())
            let index = this.schedules.map(item => item.id).indexOf(id)
            if(index !== -1) {
              this.$store.state.classroom.schedules.splice(index, 1)
            }
					} catch (error) {	
						this.$bvToast.toast(error.message, errorToas())
          }
        }
      })
		},
  },
  watch: {

  }
}
</script>