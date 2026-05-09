import $axios from '@/core/services/api.service'

const state = () => ({
	authenticated: {},
	teachers: {},
	user: {},
	student: {},
	students: [],
	page: 1,
	student_page: 1
})

const mutations = {
	ASSING_USER_AUTH(state, payload) {
		state.authenticated = payload
	},
	ASSIGN_DATA_TABLE_TEACHER(state, payload) {
		state.teachers = payload
	},
	ASSIGN_DATA_STUDENTS(state, payload) {
		state.students = payload
	},
	ASSIGN_DATA_USER(state, payload) {
		state.user = {
			id: payload.id,
			name: payload.name,
			email: payload.email,
			isactive: payload.isactive,
			uid: payload.uid,
			details: payload.details == null ? {} : payload.details
		}
	},
	ASSIGN_DATA_STUDENT(state, payload) {
		state.student = {
			id: payload.id,
			name: payload.name,
			email: payload.email,
			isactive: payload.isactive,
			uid: payload.uid,
			details: payload.details == null ? {} : payload.details
		}
	},
	SET_PAGE(state, payload) {
		state.page = payload
	},
	SET_STUDENT_PAGE(state, payload) {
		state.student_page = payload
	},
	CLEAR_STUDENT(state, payload) {
		state.student = {}
	},
	CLEAR_USER(state) {
		state.user = {}
	},
	CLEAR_AUTH(state, payload) {
		state.authenticated = {}
	}
}

const actions = {
	getUserLogin({ commit }) {
		commit('SET_LOAD_PAGE', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`user-authenticated`)
				commit('ASSING_USER_AUTH', network.data.data)
				commit('SET_LOAD_PAGE', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOAD_PAGE', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createNewTeacher({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`users/teacher`, state.user)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				if (error.response && error.response.status == 422) {
					commit('SET_ERRORS', error.response.data.errors, { root: true })
				}
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createNewStudent({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`users/student`, state.student)
				commit('SET_LOADING', false, { root: true })
				commit('CLEAR_STUDENT')
				resolve(network.data)
			} catch (error) {
				if (error.response && error.response.status == 422) {
					commit('SET_ERRORS', error.response.data.errors, { root: true })
				}
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getTeacherDataTable({ commit, state }, payload) {
		let perPage = typeof payload.perPage != 'undefined' ? payload.perPage : ''
		let search = typeof payload.search != 'undefined' ? payload.search : ''
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`users/teacher?page=${state.page}&perPage=${perPage}&q=${search}`)
				commit('ASSIGN_DATA_TABLE_TEACHER', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataStudents({ commit, state }, payload) {
		let perPage = typeof payload.perPage != 'undefined' ? payload.perPage : ''
		let search = typeof payload.search != 'undefined' ? payload.search : ''
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`users/student?page=${state.student_page}&perPage=${perPage}&q=${search}`)
				commit('ASSIGN_DATA_STUDENTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getUser({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`users/${payload}`)

				commit('ASSIGN_DATA_USER', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getStudent({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`users/${payload}`)

				commit('ASSIGN_DATA_STUDENT', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteUser({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.delete(`users/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateUser({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async( resolve, reject) => {
			try {
				let network = await $axios.put(`users/${state.user.id}`, state.user)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateStudent({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async( resolve, reject) => {
			try {
				let network = await $axios.put(`users/${state.student.id}`, state.student)

				commit('CLEAR_STUDENT')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	importTeacher({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`users/teacher/import`, payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)

			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	importStudent({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`users/student/import`, payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)

			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataProfile({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`users/profile`, payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	}
}

export default  {
	namespaced: true,
	state,
	mutations,
	actions
}