<template>
  <div class="d-flex flex-column-fluid">
		<div class="container">
			<div class="card card-custom shadow-none border">
				<div class="card-header flex-wrap border-0 p-4">
					<div class="d-flex align-items-center">
						<div class="symbol symbol-45 symbol-light-primary mr-5">
							<span class="symbol-label">
								<i class="flaticon-folder text-primary"></i>
							</span>
						</div>
						<div class="d-flex flex-column flex-grow-1">
							<span class="text-dark-75 mb-1 font-size-lg font-weight-bolder">
								Rekapitulasi data
							</span>
							<div class="d-flex">
								<div class="d-flex align-items-center pr-5">
									<span class="svg-icon svg-icon-md svg-icon-primary">
									</span>
									<span class="text-muted font-weight-bold">Rekapitulasi data data</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
      <div class="row mt-2">
        <div class="col-md-8">
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action" :disabled="isLoading" @click.prevent="recapAbcent">Rekapitulasi Absensi</a>
            <a href="#" class="list-group-item list-group-item-action" :disabled="isLoading" @click.prevent="recapResultExam">Rekapitulasi Hasil Ulangan</a>
            <a href="#" class="list-group-item list-group-item-action" :disabled="isLoading" @click.prevent="recapResultTask">Rekapitulasi Hasil Tugas</a>
          </div>
        </div>
        <div class="col-md-4">
          <div class="alert alert-custom alert-light-primary fade show mb-5" role="alert">
            <div class="alert-icon">
              <i class="flaticon-info"></i>
            </div>
            <div class="alert-text">
              <strong>Informasi</strong><br>
              Rekapitulasi data adalah pengumpulan data data dari bulan bulan sebelumnya
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
    <b-modal id="modal-recap-abcent" title="Rekapitulasi absensi" hide-footer>
      <RecapAbcent />
    </b-modal>
    <b-modal id="modal-recap-result-exam" title="Rekapitulasi hasil ulangan" hide-footer>
      <RecapResultExam />
    </b-modal>
    <b-modal id="modal-recap-result-task" title="Rekapitulasi hasil tugas" hide-footer>
      <RecapResultTask />
    </b-modal>
  </div>
</template>
<script>
import RecapAbcent from './RecapAbcent'
import RecapResultExam from './RecapResultExam'
import RecapResultTask from './RecapResultTask'
import { mapGetters, mapState, mapActions } from 'vuex'
import { BButton } from 'bootstrap-vue'

export default {
  name: 'RecapDashboard',
  components: {
    RecapAbcent, BButton, RecapResultExam, RecapResultTask
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  methods: {
    recapAbcent() {
      this.$bvModal.show('modal-recap-abcent');
    },
    recapResultExam() {
      this.$bvModal.show('modal-recap-result-exam');
    },
    recapResultTask() {
      this.$bvModal.show('modal-recap-result-task');
    }
  }
}
</script>