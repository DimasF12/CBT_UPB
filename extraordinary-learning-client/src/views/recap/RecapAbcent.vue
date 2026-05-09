<template>
    <div>
        <div class="form-group">
            <label>Kelas</label>
			<v-select label="name" :reduce="item => item.id" :options="classrooms" v-model="classroom_id">
			</v-select>
        </div>
        <div class="form-group">
            <label>Jadwal</label>
            <v-select label="id" :reduce="item => item.id" :options="schedules" v-model="schedule_id" multiple>
                <template v-slot:option="option">
                    {{ option.day | dayIndex }} ({{ option.from_time.substring(0, 5) }} - {{ option.end_time.substring(0,5) }})
                </template>
                <template v-slot:selected-option="option">
                    {{ option.day | dayIndex }} ({{ option.from_time.substring(0, 5) }} - {{ option.end_time.substring(0,5) }})
                </template>
			</v-select>
        </div>
        <div class="form-group">
            <label>Dari</label>
            <input type="date" class="form-control" v-model="from">
        </div>
        <div class="form-group">
            <label>Sampai</label>
            <input type="date" class="form-control" v-model="end">
        </div>
        <div class="form-group" v-if="classroom != '' && from != '' && end != '' && schedule_id != ''">
            <a traget="_blank" :disabled="isLoading" :href="`${baseURL}/api/v1/download/excel/recap/abcent?c=${classroom}&f=${from}&e=${end}&s=${schedule_id.toString()}&token=${authenticated.token_download}`" class="btn btn-block btn-primary" download="">Download</a>
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
    name: 'RecapAbcentModal',
    components: {
        VSelect, BButton
    },
    data() {
        return {
            classroom_id: '',
            classroom: '',
            schedule_id: '',
            from: '',
            end: ''
        }
    },
    computed: {
        ...mapGetters(['isLoading','baseURL']),
        ...mapState('classroom', ['myclassrooms', 'schedules']),
        ...mapState('user', ['authenticated']),
        classrooms() {
			return this.myclassrooms.map(item => ({
                id: item.id,
                classroom_id: item.classroom.id,
				name: item.subject.name + '-'+item.classroom.name
			}));
		},
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
        ...mapActions('classroom', ['getDataClassromMine', 'getDataSchedules']),
        ...mapActions('abcent',['recapAbcent']),
        recapData() {
            this.recapAbcent({
                c: this.classroom_id,
                f: this.from,
                e: this.end,
                s: this.schedule_id
            })
            .catch((error) => {
                this.$bvToast.toast(error.message, errorToas())
            })
        }
    },
    created() {
        this.getDataClassromMine()
        .catch((error) => {
            this.$bvToast.toast(error.message, errorToas())
        })
    },
    watch : {
        classroom_id(val) {
            let index = this.classrooms.map(item => item.id).indexOf(val);
            if(index !== -1) {
                let data = this.classrooms[index]
                this.classroom = data.classroom_id
                this.getDataSchedules(val)
                .catch((error) => {
                    this.$bvToast.toast(error.message, errorToas())
                })
            }
        }
    }
}
</script>