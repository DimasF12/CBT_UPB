import $axios from '@/core/services/api.service'

const state = () => ({
	infos: [],
	public_infos: [],
	info: {},
	page: 1,
	public_page: 1
})

const mutations = {
	ASSIGN_INFOS(state, payload) {
		state.infos = payload
	},
	ASSIGN_PUBLIC_INFOS(state, payload) {
		state.public_infos = payload
	},
	ASSIGN_INFO(state ,payload) {
		state.info = payload
	},
	CLEAR_INFO(state, payload) {
		state.info = {}
	},
	SET_PAGE(state, payload) {
		state.page = payload
	},
	SET_PUBLIC_PAGE(state, payload) {
		st.public_page = payload
	}
}

const actions = {
	getDataInfos({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let perPage = payload.perPage
				let network = await $axios.get(`infos?page=${state.page}&perPage=${perPage}`)

				commit('ASSIGN_INFOS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataInfosPublic({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`infos/public?page=${state.public_page}`)

				commit('ASSIGN_PUBLIC_INFOS', network.data.data)
				commit('SET_LOADING', false, {root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataInfo({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`infos/${payload}`)

				commit('ASSIGN_INFO', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createDataInfo({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`infos`, state.info)

				commit('CLEAR_INFO')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataInfo({ commit, state}, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, {root: true })
				let network=  await $axios.put(`infos/${state.info.id}`, state.info)

				commit('CLEAR_INFO')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true})
				reject(error.response.data)
			}
		})
	},
	deleteDataInfo({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.delete(`infos/${payload}`)

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