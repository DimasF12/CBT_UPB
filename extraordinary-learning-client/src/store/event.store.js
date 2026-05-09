import $axios from '@/core/services/api.service'

const state = () => ({
	events: [],
	event: {},
	public_events: [],
	page: 1,
	public_page: 1
})

const mutations = {
	ASSIGN_EVENTS(state, payload) {
		state.events = payload
	},
	ASSIGN_EVENT(state, payload) {
		state.event = payload
	},
	ASSIGN_PUBLIC_EVENTS(state, payload) {
		state.public_events = payload
	},
	SET_PAGE(state, payload) {
		state.page = payload
	},
	SET_PUBLIC_PAGE(state, payload) {
		state.public_page = payload
	},
	CLEAR_EVENT(state, payload) {
		state.event = {}
	}
}

const actions = {
	getDataEvents({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let perPage = payload.perPage
				let network = await $axios.get(`events?page=${state.page}&perPage=${perPage}`)

				commit('ASSIGN_EVENTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {	
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataEvent({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`events/${payload}`)

				commit('ASSIGN_EVENT', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataEventPublic({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`events/public`)

				commit('ASSIGN_PUBLIC_EVENTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createDataEvent({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`events`, state.event)

				commit('CLEAR_EVENT')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataEvent({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network =  await $axios.put(`events/${state.event.id}`, state.event)

				commit('CLEAR_EVENT')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteDataEvent({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.delete(`events/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, {root: true })
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