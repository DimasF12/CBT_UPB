<template>
  <div>
    <div class="table-responsive-md"  id="printMe">
			<table class="table table-bordered">
				<thead>
					<tr>
						<td width="50px">No</td>
						<td>Nama</td>
						<td>Kehadiran</td>
						<td>Status</td>
						<td>Keterangan</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(abcent,index) in abcents" :key="index">
						<td>{{ index+1 }}</td>
						<td>{{ abcent.user.name }}</td>
						<td>{{ abcent.isabcent == 1 ? 'Hadir' : 'Tidak hadir' }}</td>
						<td>{{ abcent.reason | textReason }}</td>
						<td>{{ abcent.desc }}</td>
					</tr>
					<tr v-if="abcents.length == 0">
						<td colspan="5">
							Tidak ada data ditanggal ini
						</td>
					</tr>
				</tbody>
			</table>
			<div class="d-flex align-items-center py-3">
				<div class="d-flex align-items-center" v-if="isLoading">
					<div class="mr-2 text-muted">Loading...</div>
					<div class="spinner spinner-primary mr-10"></div>
				</div>
			</div>
		</div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  name: 'ClassroomAbcentReport',
  computed: {
    ...mapGetters(['isLoading']),
    ...mapState('abcent', ['abcents']),
  },
  data() {
    return {

    }
  },
  filters: {
		textReason(i) {
			let reasons = [
				"-",
				"Tanpa keterangan",
				"Sakit",
				"Izin",
				"Masalah"
			];
			return reasons[parseInt(i)];
		}
	},
  methods: {

  }
}
</script>