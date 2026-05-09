import $axios from '@/core/services/api.service'
import $axiosexcel from '@/core/services/api_excel.service'
const state = () => ({
	abcents: []
})

const mutations = {
	ASSIGN_DATA_ABCENTS(state, payload) {
		state.abcents = payload
	}
}

const actions = {
	storeAbcentToday({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let network = await $axios.post('abcents', payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getAbcentToday({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise(async(resolve, reject) => {
			try {
				let date = typeof payload.date != 'undefined' && payload.date != null ? payload.date : ''
				let network = await $axios.get(`abcents/schedule/${payload.schedule_id}?date=${date}`)

				commit('ASSIGN_DATA_ABCENTS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	downloadExcel({ state, commit}, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise((resolve, reject) => {
			let date = typeof payload.date != 'undefined' && payload.date != null  ? payload.date : ''
			
			$axiosexcel.get(`abcents/schedule/${payload.schedule_id}/export?date=${date}`)
			.then((response) => {
				const type = response.headers['content-type']
			    const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' })
			    const link = document.createElement('a')
			    link.href = window.URL.createObjectURL(blob)
			    link.download = 'Report absensi hari ini.xlsx'
			    link.click()

				commit('SET_LOADING', false, { root: true })
				resolve(response.data)
			})
			.catch((error) => {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			})
		})
	},
	updateDataAbcent({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.put(`abcents/${payload.id}`, payload)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error){
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	recapAbcent({ commit }, payload) {
		commit('SET_LOADING', true, { root: true })
		return new Promise((resolve, reject) => {
			let date = typeof payload.date != 'undefined' && payload.date != null  ? payload.date : ''
			
			$axiosexcel.get(`report/recap-abcent?c=${payload.c}&f=${payload.f}&e=${payload.e}&s=${payload.s}`)
			.then((response) => {
				const type = response.headers['content-type']
			    const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' })
			    const link = document.createElement('a')
			    link.href = window.URL.createObjectURL(blob)
			    link.download = 'rekapitulasi_absensi.xlsx'
			    link.click()

				commit('SET_LOADING', false, { root: true })
				resolve(response.data)
			})
			.catch((error) => {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			})
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}