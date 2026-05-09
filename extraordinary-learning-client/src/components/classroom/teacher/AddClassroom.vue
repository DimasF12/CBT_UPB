<template>
  <div>
    <div class="form-group">
			<label>Kelas</label>
			<v-select label="name" :reduce="item => item.id" :options="classrooms.data" v-model="classroom_subject.classroom_id" :filterable="false" @search="onSearchClassroom">
				<template slot="no-options">
			   	Cari kelas..
			  </template>
			</v-select>
		</div>
    <div class="form-group">
			<label>Matpel</label>
			<v-select label="name" :reduce="item => item.id" :options="subjects.data" v-model="classroom_subject.subject_id" :filterable="false" @search="onSearchSubject">
				<template slot="no-options">
			   	Cari mata pelajaran..
			  </template>
			</v-select>
		</div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import VSelect from 'vue-select'
import _ from 'lodash'

import 'vue-select/dist/vue-select.css';

export default {
  name: 'TeacherAddClassroom',
  components: {
    VSelect,
  },
  computed: {
		...mapGetters(['isLoading']),
		...mapState(['errors']),
		...mapState('classroom',['classrooms', 'classroom_subject']),
    ...mapState('subject', ['subjects']),
  },
  methods: {
    ...mapActions('classroom', ['getDataClassrooms']),
		...mapActions('subject', ['getDataSubjects']),
    onSearchSubject(search, loading) {
	    loading(true);
	    this.searchSubject(loading, search, this);
	  },
	  searchSubject: _.debounce((loading, search, vm) => {
	  	vm.getDataSubjects({ perPage: 10, search: escape(search) })
	  	.then((res) => {
	  		loading(false)
	  	})
	  }, 350),
	  onSearchClassroom(search, loading) {
	    loading(true);
	    this.searchClassroom(loading, search, this);
	  },
	  searchClassroom: _.debounce((loading, search, vm) => {
	  	vm.getDataClassrooms({ perPage: 10, search: escape(search) })
	  	.then((res) => {
	  		loading(false)
	  	})
		}, 350),
  }
}
</script>