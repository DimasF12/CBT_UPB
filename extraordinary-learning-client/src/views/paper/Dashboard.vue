<template>
    <div class="d-flex flex-column-fluid">
        <div class="container">
            <div class="card mb-10">
                <div class="card-header p-4 d-flex justify-content-between">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-45 symbol-light-primary mr-5">
                            <span class="symbol-label">
                                <i class="flaticon2-crisp-icons text-primary"></i>
                            </span>
                        </div>
                        <div class="d-flex flex-column flex-grow-1">
                            <span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
                                Perangkat pengajaran
                            </span>
                            <div class="d-flex">
                                <div class="d-flex align-items-center pr-5">
                                    <span class="svg-icon svg-icon-md svg-icon-primary">
                                    </span>
                                    <span class="text-muted font-weight-bold">Daftar perangkat pengajaran</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <table class="table table-borderless table-sm">
                        <tr v-for="item in filteredClassrooms" :key="item.id">
                            <td>
                                <div class="card">
                                    <div class="card-header p-0 d-flex justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <b-button squared class="mr-1" variant="light-primary" size="sm" @click="manageClassroom(item.classroom.id)" v-b-tooltip.hover.d50 title="Silabus" :disabled="isLoading">
                                                <i class="flaticon-list-2"></i> Manage
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card">
                                    <div class="card-body p-4 rounded-0">
                                        <div class="d-flex align-items-center">
                                            <div class="d-flex flex-column font-weight-bold">
                                                <span class="text-dark mb-1 font-size-lg">{{ item.classroom.name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="#" @click="manageClassroom(item.classroom.id)" class="stretched-link"></a>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredClassrooms.length === 0">
                            <td class="text-muted">Tidak ada data kelas, silakan tambah terlebih daulu</td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-4">
                    <div class="alert alert-custom alert-light-primary fade show mb-5" role="alert">
                        <div class="alert-icon">
                            <i class="flaticon-info"></i>
                        </div>
                        <div class="alert-text">
                            <strong>Informasi</strong><br>
                            Klik silabus atau RPP untuk melihat dan menambahkan data baru 
                        </div>
                        <div class="alert-close">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">
                                    <i class="ki ki-close"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal id="modal-manage" title="Manage" size="xl" @hide="classroomSubject = []" hide-footer>
            <table class="table table-bordered">
                <tbody>
                    <tr v-for="(classroom, index) in classroomSubject" :key="index">
                        <td width="40px">{{ index + 1}}</td>
                        <td>{{ classroom.subject.name }}</td>
                        <td>
                            <b-button squared class="mr-1" variant="light-primary" size="sm" @click="showSyllabus(classroom.id)" v-b-tooltip.hover.d50 title="Silabus" :disabled="isLoading">
                                <i class="flaticon-list-2"></i> Silabus
                            </b-button>
                            <b-button squared class="mr-1" variant="light-info" size="sm" @click="showLessonPlan(classroom.id)" v-b-tooltip.hover.d50 title="RPP" :disabled="isLoading">
                                <i class="flaticon-list-2"></i> RPP
                            </b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </b-modal>
        <b-modal id="modal-syllabus" title="Silabus" size="lg" @hide="$store.commit('paper/CLEAR_DATA_PAPERS')" hide-footer>
            <Syllabus :id="show_id"/>
        </b-modal>
        <b-modal id="modal-lp" title="Rencana pelaksanaan pembelajaran" size="lg" @hide="$store.commit('paper/CLEAR_DATA_PAPERS')" hide-footer>
            <LessonPlan :id="show_id" />
        </b-modal>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { BButton } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'
import Syllabus from './Syllabus'
import LessonPlan from './LessonPlan'

export default {
    name: 'DashboardPaper',
    components: {
        BButton,
        Syllabus, LessonPlan
    },
    data() {
        return {
            show_id: null,
            classroomSubject: []
        }
    },
    computed: {
        ...mapGetters(['isLoading']),
        ...mapState('classroom', ['myclassrooms']),
        filteredClassrooms() {
			const result = []
			const map = new Map()
			for (const item of this.myclassrooms) {
				if(!map.has(item.classroom.id)) {
					map.set(item.classroom.id, true);
					result.push(item)
				}
			}
			return result;
		},
    },
    methods: {
        ...mapActions('classroom', ['getDataClassromMine']),
        ...mapActions('paper', ['getDataPapers']),
        showSyllabus(id) {
            this.getDataPapers({ id: id, type: 'syllabus'})
            .then((res) => {
                this.show_id = id
                this.$bvModal.show('modal-syllabus')
            })
            .catch((error) => {
                this.$bvToast.toast(error.message, errorToas())
            })
        },
        showLessonPlan(id) {   
            this.getDataPapers({ id: id, type: 'lesson_plan'})
            .then((res) => {
                this.show_id = id
                this.$bvModal.show('modal-lp')
            })
            .catch((error) => {
                this.$bvToast.toast(error.message, errorToas())
            })
        },
        manageClassroom(id) {
            this.classroomSubject = this.myclassrooms.filter(item => item.classroom.id == id)
            this.$bvModal.show('modal-manage')
        }
    },
    created() {
        this.getDataClassromMine()
        .catch((error) => {
            this.$bvToast.toast(error.message, errorToas())
        })
    }
}
</script>
<style>
	.table > tbody > tr > td {
     vertical-align: middle;
}
</style>