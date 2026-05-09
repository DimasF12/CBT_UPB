import $axios from '@/core/services/api.service'

const state = () => ({
	checks: [],
	results: []
})

const mutations = {
	ASSIGN_CHECKS(state, payload) {
		state.checks = payload
	},
	ASSIGN_RESULTS(state, payload) {
		state.results = payload
	}
}

const actions = {
	getDataChecks({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.get(`exam_schedules/${payload}/check`)

				commit('ASSIGN_CHECKS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	storeDataCheck({ commit }, payload) {
		return new Promise(async(resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.post('exam_schedules/point', payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataResults({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				let classroom = typeof payload.classroom_id != 'undefined' ? payload.classroom_id : ''
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.get(`exam_schedules/${payload.exam_schedule_id}/result?q=${classroom}`)

				commit('ASSIGN_RESULTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
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