import $axios from '@/core/services/api.service'

const state = () => ({
	tasks: {
		data: []
	},
	classroom_tasks: [],
	classroom_submit_tasks: [],
	classroom_results: [],
	page: 1,
	task: {
		title: '',
		body: '',
		type: '',
		isactive: true,
		deadline: ''
	},
	classroom_task_page: 1,
	upload_progress: 0
})

const mutations = {
	ASSIGN_DATA_TASKS(state, payload) {
		state.tasks = payload
	},
	ASSIGN_DATA_CLASSROOM_TASKS(state, payload) {
		state.classroom_tasks = payload
	},
	ASSIGN_DATA_TASK(state, payload) {
		state.task = {
			id: payload.id,
			title: payload.title,
			body: payload.body,
			type: payload.type,
			isactive: payload.isactive,
			deadline: payload.deadline,
			created_at: payload.created_at,
			lastsubmit: payload.lastsubmit,
			status: payload.status
		}
	},
	ASSIGN_DATA_CLASSROOM_SUBMIT_TASKS(state, payload) {
		state.classroom_submit_tasks = payload
	},
	ASSIGN_DATA_CLASSROOM_RESULTS(state, payload) {
		state.classroom_results = payload
	},
	CLEAR_DATA_TASK(state, payload) {
		state.task =  {
			title: '',
			body: '',
			type: '',
			isactive: true
		}
	},
	SET_PAGE(state, payload) {
		state.page = payload
	},
	SET_CLASSROOM_TASK_PAGE(state, payload) {
		state.classroom_task_page = payload
	},
	SET_UPLOAD_PROGRESS(state, payload) {
		state.upload_progress = payload
	}
}

const actions = {
	getDataTasks({ commit, state }, payload) {
		let perPage = typeof payload.perPage != 'undefined' ? payload.perPage : 10
		let search = typeof payload.search != 'undefined' ? payload.search : ''
		commit('SET_LOADING', true, { root: true })
		return new Promise(async (resolve, reject) => {
			try {
				let network = await $axios.get(`tasks?page=${state.page}&perPage=${perPage}&q=${search}`)

				commit('ASSIGN_DATA_TASKS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				resolve(error.response.data)
			}
		})
	},
	getDataTask({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`tasks/${payload}`)

				commit('ASSIGN_DATA_TASK', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataClassroomTasks({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`classrooms/${payload}/task?page=${state.classroom_task_page}`)

				commit('ASSIGN_DATA_CLASSROOM_TASKS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataClassroomTaskResults({ commit }, payload) {
		let classroom_id = payload.classroom_id ? payload.classroom_id : ''
		let task_id = payload.task_id ? payload.task_id : ''

		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`tasks/${task_id}/result?c=${classroom_id}`)

				commit('ASSIGN_DATA_CLASSROOM_RESULTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataUncheckedTask({ commit, state }, payload) {
		let task_id = payload.task_id
		let classroom_id = payload.classroom_id

		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.get(`tasks/${task_id}/check?c=${classroom_id}`)

				commit('ASSIGN_DATA_CLASSROOM_SUBMIT_TASKS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createNewTask({ commit, state}, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.post(`tasks`, state.task)

				commit('CLEAR_DATA_TASK')
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
	createNewTaskResult({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.post(`tasks/result`, payload)

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
	updateDataTask({ commit, state }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.put(`tasks/${state.task.id}`, state.task)

				commit('CLEAR_DATA_TASK')
				commit('SET_LOADING', false, {root: true })
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
	deleteDataTask({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.delete(`tasks/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteTaskSharee({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', false, { root: true })
				let network = await $axios.delete(`tasks/sharee/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteDataStudentTask({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.delete(`tasks/student/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	shareeTask({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.post(`tasks/${payload.id}/sharee`, payload.data)

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
	sendTask({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			let id = payload.id
			let data = payload.data
			try {
				let network
				if(payload.type == 'file') {
					network = await $axios.post(`tasks/${id}/collect`, data, {
						headers: {
				            'content-type': 'multipart/form-data'
				        },
				        onUploadProgress: function( progressEvent ) {
	                        commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
	                    }.bind(this)
					})

				} else {
					network = await $axios.post(`tasks/${id}/collect`, data)
				}

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
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}