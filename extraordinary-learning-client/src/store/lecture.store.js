import $axios from '@/core/services/api.service'

const state = () => ({
	lectures: {
		data: []
	},
	classroom_lectures: [],
	comments: [],
	lecture: {
		id: '',
		title: '',
		body: '',
		subject_id: '',
		isactive: false,
		created_at: ''
	},
	page: 1,
	classroom_lecture_page: 1
})

const mutations = {
	ASSIGN_DATA_LECTURES(state, payload) {
		state.lectures = payload
	},
	ASSIGN_DATA_COMMENTS(state, payload) {
		state.comments = payload
	},
	ASSIGN_DATA_LECTURES_CLASSROOM(state, payload) {
		state.classroom_lectures = payload
	},
	ASSIGN_FORM(state, payload) {
		state.lecture = {
			id: payload.id,
			title: payload.title,
			body: payload.body,
			subject_id: payload.subject_id,
			isactive: payload.isactive,
			addition: payload.addition,
			created_at: payload.created_at
		}
	},
	CLEAR_FORM_LECTURE(state, payload) {
		state.lecture = {
			id: '',
			title: '',
			body: '',
			subject_id: '',
			isactive: false
		}
	},
	SET_PAGE(state, payload) {
		state.page = payload
	},
	SET_CLASSROOM_LECTURE_PAGE(state, payload) {
		state.classroom_lecture_page = payload
	}
}

const actions = {
	getDataLectures({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		let perPage = typeof payload.perPage != 'undefined' ? payload.perPage : ''
		let search = typeof payload.search != 'undefined' ? payload.search : ''

		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`lectures?page=${state.page}&perPage=${perPage}&q=${search}`)

				commit('ASSIGN_DATA_LECTURES', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createNewLecture({ commit, state }) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let formData = new FormData()
				for(let key in state.lecture) {
					formData.append(key, state.lecture[key])
				}
				let network = await $axios.post(`lectures`, formData, {
					headers: {
						'content-type': 'multipart/form-data'
					}
				})

				commit('CLEAR_ERROR', true, { root: true })
				commit('CLEAR_FORM_LECTURE', true)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				if (error.response && error.response.status == 422) {
					commit('SET_ERRORS', error.response.data.errors, { root: true })
				}
				commit('SET_LOADING', false , { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataLecture({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`lectures/${payload}`)

				commit('ASSIGN_FORM', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteDataLecture({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.delete(`lectures/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataLecture({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.put(`lectures/${state.lecture.id}`, state.lecture)

				commit('CLEAR_ERROR', true, { root: true })
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
	getDataComments({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`lectures/${payload}/comment`)

				commit('ASSIGN_DATA_COMMENTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createNewComment({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`lectures/${payload.lecture_id}/comment`, payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataLectureClassroom({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`classrooms/${payload}/lecture?page=${state.classroom_lecture_page}`)

				commit('ASSIGN_DATA_LECTURES_CLASSROOM', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteShareLecture({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.delete(`lectures/sharee/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	shareeLectureToClassroom({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.post(`lectures/${payload.id}/sharee`, payload.data)

				commit('SET_LOADING', false, { root: true})
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}