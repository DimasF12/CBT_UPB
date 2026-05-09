<template>
  <div>
    <div class="input-group mb-3">
			<div class="input-group-prepend">
		    <span class="input-group-text"><i class="flaticon-avatar"></i></span>
		  </div>
		  <input type="text" class="form-control" placeholder="Masukkan NIS" v-model="uid">
		  <div class="input-group-append">
		    <button class="btn btn-primary" type="button" @click="addToClassroom(authenticated.classroom.id)" :disabled="isLoading"><i class="flaticon-user-add"></i>Tambah</button>
		  </div>
		</div>
    <div class="table-responsive">
			<VuePerfectScrollbar
				class="aside-menu scroll liveclass_comment"
				style="max-height: 50vh; position: relative;"
			>
			<table class="table table-bordered table-stripped">
				<tbody>
				<tr  v-for="(student, index) in students" :key="student.id">
					<td>{{ index+1 }}</td>
					<td>{{ student.student.uid }}</td>
					<td>
						{{ student.student.name }}
					</td>
					<td width="110px">
						<b-button size="sm" variant="light-danger" @click="deleteFromClassroom(student.student.id, authenticated.classroom.id)" :disabled="isLoading">
							<i class="flaticon2-trash"></i> Hapus
						</b-button>
					</td>
				</tr>
				<tr v-if="students.length === 0">
					<td colspan="4">Tidak ada siswa dikelas ini</td>
				</tr>
				</tbody>
			</table>
			</VuePerfectScrollbar>
		</div>
		<span class="badge badge-primary">Total {{ students.length }} data</span>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { BButton } from 'bootstrap-vue'
import { successToas, errorToas } from '@/core/entities/notif'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'ClassroomStudent',
  components: {
    VuePerfectScrollbar, BButton
  },
  data() {
    return {
      uid: ''
    }
  },
  computed: {
    ...mapGetters(['isLoading']),
    ...mapState('user', ['authenticated']),
    ...mapState('classroom',['students']),
  },
  methods: {
    ...mapActions('classroom',['deleteUserFromClassroom','getDataStudents','addUserToClassroom']),
    async addToClassroom(id) {
			try {
				await this.addUserToClassroom({
					classroom_id: id,
					data: {
						uid: this.uid
					}
				})
				this.getDataStudents(id)
				this.$bvToast.toast('Siswa berhasil ditambahkan ke kelas', successToas())
			} catch (error) {
				this.$bvToast.toast(error.message, errorToas())
			}
		},
		async deleteFromClassroom(id, classroom_id) {
			this.$swal({
        title: 'Informasi',
        text: "Siswa akan dihapus dari kelas ini",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#c3c3c3',
        confirmButtonText: 'Lanjutkan!'
      }).then(async (result) => {
        if (result.value) {
					try {
						await this.deleteUserFromClassroom(id)

            let index = this.students.map(item => item.student.id).indexOf(id)
            if(index !== -1) {
              this.$store.state.classroom.students.splice(index, 1)
            }
						this.$bvToast.toast('Siswa berhasil dihapus dari kelas', successToas())
					} catch (error) {
						this.$bvToast.toast(error.message, errorToas())
					}
      	}
      })
		},
  }
}
</script>