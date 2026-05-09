<template>
    <div>
        <b-button variant="primary" v-b-modal.modal-create><i class="flaticon2-add-square"></i> Tambah silabus</b-button>
        <table class="table mt-2">
            <tr v-for="paper in papers" :key="paper.id">
                <td>{{ paper.name  == null ? '-' : paper.name }}</td>
                <td>{{ paper.note }}</td>
                <td>
                    <a :href="`${baseURL}/storage/${paper.file_location}`" download="" target="_blank" v-b-tooltip.hover.d50  :title="paper.body">{{ paper.file_location }}</a>
                </td>
                <td>
                    <b-button size="sm" variant="light-danger" @click="remove(paper.id)" :disabled="isLoading"><i class="flaticon2-trash"></i> Hapus</b-button>
                </td>
            </tr>
            <tr v-if="papers.length === 0">
                <td colspan="2">Tidak ada data silabus saat ini</td>
            </tr>
        </table>

        <b-modal id="modal-create" title="Tambah silabus" @hide="$store.commit('paper/CLEAR_DATA_PAPER')">
            <div class="form-group">
                <label>Nama</label>
                <input type="text" class="form-control" v-model="paper.name" :class="{ 'is-invalid' : errors.name }">
                <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
            </div>
            <div class="form-group">
                <label>Catatan</label>
                <input type="text" class="form-control" v-model="paper.body" :class="{ 'is-invalid' : errors.body }">
                <div class="invalid-feedback" v-if="errors.body">{{ errors.body[0] }}</div>
            </div>
            <b-form-file @change="onFileChange">
				<template slot="file-name" slot-scope="{ names }">
				    <b-badge variant="success">{{ names[0] }}</b-badge>
				    <b-badge v-if="names.length > 1" variant="success" class="ml-1">
				    + {{ names.length - 1 }} More files
				    </b-badge>
				</template>
			</b-form-file>
            <small class="text-danger" v-if="errors.file">{{ errors.file[0] }}</small>
            <b-progress :value="progress" :max="100" show-progress animated class="mt-2" v-show="progress !== 0"></b-progress>
            <template v-slot:modal-footer="{ cancel }">
                <b-button variant="secondary" @click="cancel()" :disabled="isLoading">
                    Cancel
                </b-button>
                <b-button variant="primary" @click="submit" :disabled="isLoading">
                    {{ isLoading ? 'Processing...' : 'Simpan' }}
                </b-button>
            </template>
        </b-modal>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { BButton, BFormFile, BBadge, BProgress } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'

export default {
    name: 'Syllabus',
    components: {
        BButton, BFormFile, BBadge, BProgress
    },
    props: ['id'],
    data() {
        return {
            file: null
        }
    },
    computed: {
        ...mapGetters(['isLoading','baseURL']),
        ...mapState(['errors']),
        ...mapState('paper', ['papers', 'progress', 'paper'])
    },
    methods: {
        ...mapActions('paper', ['createDataPaper', 'getDataPapers', 'deleteDataPaper']),
        onFileChange(e) {
            this.file = e.target.files[0]
        },
        submit() {
            let formData = new FormData()
            formData.append('file', this.file)
            formData.append('classroom_subject_id', this.id)
            formData.append('type','syllabus')

            for (var key in this.paper) {
                formData.append(key, this.paper[key]);
            }

            this.createDataPaper(formData)
            .then((res) => {
                this.getDataPapers({ id: this.id, type: 'syllabus'})
                this.$bvToast.toast('Silabus berhasil disimpan', successToas())
                this.$bvModal.hide('modal-create')
            })
            .catch((error) => {
                this.$store.state.paper.progress = 0
                this.$bvToast.toast(error.message, errorToas())
            })
        },
        remove(id) {
            this.$swal({
                title: 'Informasi',
                text: "Silabus ini akan dihapus beserta dengan data yang terkait",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#c3c3c3',
                confirmButtonText: 'Lanjutkan!'
            }).then(async (result) => {
            	if (result.value) {
                    try {
                        await this.deleteDataPaper(id)
                        this.$bvToast.toast('Silabus berhasil dihapus', successToas())
                        this.getDataPapers({ id: this.id, type: 'syllabus'})
                    } catch (error) {
                        this.$bvToast.toast(error.message, errorToas())
                    }
                }
            })
        }
    }
}
</script>