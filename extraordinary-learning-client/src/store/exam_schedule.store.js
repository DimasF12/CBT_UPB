import $axios from '@/core/services/api.service'

const state = () => ({
	schedule: {
		setting: {
			random_question: 0,
			random_option: 0
		}
	},
	schedules: [],
	schedules_page: 1
})

const mutations = {
	ASSIGN_SCHEDULES(state, payload) {
		state.schedules = payload
	},
	ASSIGN_SCHEDULE(state, payload) {
		state.schedule = {
			id: payload.id,
			question_bank_id: payload.question_bank_id,
			classrooms: payload.classrooms,
			name: payload.name,
			date: payload.date,
			start_time: payload.start_time,
			duration: payload.duration/60,
			type: payload.type,
			setting: payload.setting
		}
	},
	SET_SCHEDULES_PAGE(state, payload) {
		state.schedules_page = payload
	},
	CLEAR_SCHEDULE(state) {
		state.schedule = {
			setting: {
				random_question: 0,
				random_option: 0
			}
		}
	}
}

const actions = {
	getDataExamSchedules({ commit, state }, payload) {
		return new Promise(async(resolve, reject) => {
			try {
				let perPage = payload.perPage
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`exam_schedules?page=${state.schedules_page}`)

				commit('ASSIGN_SCHEDULES', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataExamSchedule({ commit }, payload) {
		return new Promise(async(resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`exam_schedules/${payload}`)

				commit('ASSIGN_SCHEDULE', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createExamSchedule({ commit, state }) {
		return new Promise(async(resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`exam_schedules`, state.schedule)

				commit('CLEAR_SCHEDULE')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch(error) {
				if (error.response && error.response.status == 422) {
					commit('SET_ERRORS', error.response.data.errors, { root: true })
				}
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateExamSchedule({ commit, state }) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.put(`exam_schedules/${state.schedule.id}`, state.schedule)

				commit('CLEAR_SCHEDULE')
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
	deleteExamSchedule({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.delete(`exam_schedules/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	setExamScheduleStatus({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`exam_schedules/${payload.id}/status`, payload)

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