<template>
  <div>
    <div class="form-group">
      <label>Kelas</label>
      <v-select label="name" :reduce="item => item.id" :options="classrooms" v-model="classroom_id">
			</v-select>
    </div>
    <div class="form-group">
      <label>Ulangan</label>
      <v-select label="name" :reduce="item => item.id" :options="schedules.data" v-model="schedule_ids" multiple>
			</v-select>
    </div>
    <div class="form-group" v-if="classroom_id != '' && schedule_ids != ''">
      <a traget="_blank" :disabled="isLoading" :href="`${baseURL}/api/v1/download/excel/recap/result/exams?c=${classroom_id}&e=${schedule_ids.toString()}&token=${authenticated.token_download}`" class="btn btn-block btn-primary" download="">Download</a>
    </div>
  </div>
</template>
<script>
import { successToas, errorToas } from '@/core/entities/notif'
import { mapGetters, mapState, mapActions } from 'vuex'
import { BButton } from 'bootstrap-vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
  naem: 'RecapResultExam',
  components: {
    VSelect, BButton
  },
  data() {
    return {
      classroom_id: '',
      schedule_ids: []
    }
  },
  computed: {
    ...mapGetters(['isLoading','baseURL']),
    ...mapState('classroom', ['myclassrooms', 'schedules']),
    ...mapState('exam_schedule', ['schedules']),
    ...mapState('user', ['authenticated']),
    classrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result.map(item => ({
				id: item.classroom.id,
				name: item.classroom.name
			}));
    },
  },
  methods: {
    ...mapActions('classroom', ['getDataClassromMine']),
    ...mapActions('exam_schedule', ['getDataExamSchedules'])
  },
  created() {
    this.getDataExamSchedules({ perPage: 100 })
		.catch((error) => {
			this.$bvToast.toast(error.message, errorToas())
    })
    this.getDataClassromMine()
    .catch((error) => {
      this.$bvToast.toast(error.message, errorToas())
    })
  }
}
</script>