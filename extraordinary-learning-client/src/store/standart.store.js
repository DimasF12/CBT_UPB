import $axios from '@/core/services/api.service'

const state = () => ({
	standarts: [],
	standart: {},
	standart_page: 1
})

const mutations = {
	ASSIGN_DATA_STANDARTS(state, payload) {
		state.standarts = payload
	},
	ASSIGN_DATA_STANDART(state, payload) {
		state.standart = payload
	},
	CLEAR_DATA_STANDART(state) {
		state.standart.type = ''
		state.standart.code = ''
		state.standart.body = ''
	},
	SET_SANDART_PAGE(state, payload) {
		state.standart_page = payload
	}
}

const actions = {
	getDataStandarts({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				let perPage = typeof payload.perPage != 'undefined' ? payload.perPage : ''
				let subject = typeof payload.subject != 'undefined' ? payload.subject : ''
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.get(`standarts?s=${subject}&page=${state.standart_page}&perPage=${perPage}`)

				commit('ASSIGN_DATA_STANDARTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},

	getDataStandart({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.get(`standarts/${payload}`)

				commit('ASSIGN_DATA_STANDART', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},

	createDataStandart({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })

				let network = await $axios.post(`standarts`, state.standart)

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

	updateDataStandart({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_ERRORS', true, { root: true })

				let network = await $axios.put(`standarts/${state.standart.id}`, state.standart)

				commit('SET_ERRORS', false, { root: true })
				resolve(network.data)
			} catch (error) {
				if (error.response && error.response.status == 422) {
					commit('SET_ERRORS', error.response.data.errors, { root: true })
				}
				commit('SET_ERRORS', false, { root: true })
				reject(error.response.data)
			}
		})
	},

	deleteDataStandart({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_ERRORS', true, { root: true })

				let network = await $axios.delete(`standarts/${payload}`)

				commit('SET_ERRORS', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_ERRORS', false, { root: true })
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