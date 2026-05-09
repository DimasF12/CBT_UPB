<template>
  <div>
    <div class="form-group">
			<label>Hari</label>
			<v-select label="name" :reduce="item => item.id" :options="days" v-model="schedule.day">
			</v-select>
			<div class="text-danger" v-if="errors.day">{{ errors.day[0] }}</div>
		</div>
    <div class="form-group">
			<label>Waktu mulai</label>
			<VueCtkDateTimePicker v-model="schedule.from_time" only-time format='HH:mm' formatted='HH:mm' label="Waktu mulai" id="wkt_mlai"/>
			<div class="text-danger" v-if="errors.from_time">{{ errors.from_time[0] }}</div>
		</div>
    <div class="form-group">
			<label>Waktu berakhir</label>
			<VueCtkDateTimePicker v-model="schedule.end_time" only-time format='HH:mm' formatted='HH:mm' label="Waktu berakhir" id="wkt_selesai"/>
			<div class="text-danger" v-if="errors.end_time">{{ errors.end_time[0] }}</div>
		</div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'

import VSelect from 'vue-select'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import 'vue-select/dist/vue-select.css';

export default {
  name: 'ClassroomScheduleAdd',
  components: {
    VSelect, VueCtkDateTimePicker
  },
  data() {
    return {
      days: [
				{ id: 1, name: 'Senin' },
				{ id: 2, name: 'Selasa' },
				{ id: 3, name: 'Rabu' },
				{ id: 4, name: 'Kamis' },
				{ id: 5, name: 'Jumat' },
				{ id: 6, name: 'Sabtu' }
			],
    }
  },
  computed: {
    ...mapState(['errors']),
    ...mapState('classroom',['schedule']),
  }
}
</script>