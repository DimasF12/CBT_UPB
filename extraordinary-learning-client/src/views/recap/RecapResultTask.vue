<template>
  <div>
    <div class="form-group">
      <label>Kelas</label>
      <v-select label="name" :reduce="item => item.id" :options="classrooms" v-model="classroom_id">
			</v-select>
    </div>
    <div class="form-group">
      <label>Tugas</label>
      <v-select label="title" :reduce="item => item.id" :options="tasks.data" v-model="task_ids" multiple>
			</v-select>
    </div>
    <div class="form-group" v-if="classroom_id != '' && task_ids != ''">
      <a traget="_blank" :disabled="isLoading" :href="`${baseURL}/api/v1/download/excel/recap/result/tasks?c=${classroom_id}&t=${task_ids.toString()}&token=${authenticated.token_download}`" class="btn btn-block btn-primary" download="">Download</a>
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
      task_ids: []
    }
  },
  computed: {
    ...mapGetters(['isLoading','baseURL']),
    ...mapState('classroom', ['myclassrooms']),
    ...mapState('task', ['tasks']),
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
    ...mapActions('task', ['getDataTasks'])
  },
  created() {
    this.getDataTasks({ perPage: 100 })
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