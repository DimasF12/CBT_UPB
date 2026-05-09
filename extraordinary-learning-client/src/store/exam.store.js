import $axios from '@/core/services/api2.service'

const state = () => ({
	schedules: [],
	uncomplete: {},
	active: {},
	answers: {
		data: [],
		detail: {}
	}
})

const mutations = {
	ASSIGN_SCHEDULES(state, payload) {
		state.schedules = payload
	},
	ASSIGN_UNCOMPLETE(state, payload) {
		state.uncomplete = payload
	},
	ASSIGN_ACTIVE(state, payload) {
		state.active = payload
	},
	ASSIGN_ANSWERS(state, payload) {
		state.answers = {
			data: payload.data,
			detail: payload.detail
		}
	},
	SLICE_DATA_RESP(state, payload) {
		state.answers.data[payload.index].answer = payload.data.answer
	},
	SLICE_DATA_DOUBT(state, payload) {
		state.answers.data[payload.index].doubt = payload.data.doubt
	}
}

const actions = {
	getDataExamSchedule({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get('exam_schedules')

				commit('ASSIGN_SCHEDULES', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataExamUncomplete({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get('exam_schedules/uncomplete')

				commit('ASSIGN_UNCOMPLETE', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataExamActive({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get('exam_schedules/active')

				commit('ASSIGN_ACTIVE', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createDataExam({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post('exam_schedules/exam', payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	startDoExam({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post('exam_schedules/start')

				commit('SET_LOADING', false, { root: true})
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataExamAnswers({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOAD_PAGE', true, { root: true })
				let network = await $axios.get('exam')

				commit('ASSIGN_ANSWERS', network.data)
				commit('SET_LOAD_PAGE', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOAD_PAGE', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	storeDataExamAnswer({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post('exam', payload)

				commit('SLICE_DATA_RESP', network.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}	
		})
	},
	storeDataExamDoubt({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post('exam/doubt', payload)

				commit('SLICE_DATA_DOUBT', network.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				console.log(error)
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	finishingExam({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOAD_PAGE', true, { root: true })
				let network = await $axios.get('exam/finish')

				commit('SET_LOAD_PAGE', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOAD_PAGE', false, { root: true })
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