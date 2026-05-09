import $axios from '@/core/services/api.service'

const state = () => ({
	question_bank: {
		subject_id: null,
		code: null,
		mc_option_count: 4,
		mc_count: 0,
		esay_count: 0,
		percentage: {
			mc: 100,
			esay: 0,
			correct: null
		}
	},
	question_banks: [],
	question: {
		type: 1,
		options: [],
		correct: null
	},
	setting: {
		opsi_max: 5,
	},
	questions: [],
	questions_page: 1,
	question_banks_page: 1,
	options: []
})

const mutations = {
	ASSIGN_QUESTION_BANKS(state, payload) {
		state.question_banks = payload
	},
	ASSIGN_QUESTION_BANK(state, payload) {
		state.question_bank = payload
	},
	ASSIGN_QUESTION(state, payload) {
		state.question = {
			id: payload.id,
			question_bank_id: payload.question_bank_id,
			question: payload.question,
			type: payload.type,
			options: (payload.options.length != 'undefined' ? payload.options.map(item => item.body) : []),
			correct: (payload.options.length != 'undefined' ? payload.options.map(item => item.correct).indexOf(1) : null)
		}
	},
	REMOVE_QUESTION_OPTION(state, payload) {
		const newdata = [...state.question.options]
		newdata.splice(payload,1)
		state.question.options = []
		state.question.options.push(...newdata)
	},
	ASSIGN_QUESTIONS(state, payload) {
		state.questions = payload
	},
	SET_QUESTION_BANKS_PAGE(state, payload) {
		state.question_banks_page = payload
	},
	SET_QUESTIONS_PAGE(state, payload) {
		state.questions_page = payload
	},
	CLEAR_QUESTION(state) {
		state.question = {
			type: 1,
			options: [],
			opsi_max: 5,
			correct: null
		}
	},
	CLEAR_QUESTION_BANK(state) {
		state.question_bank = {
			subject_id: null,
			code: null,
			mc_option_count: 4,
			mc_count: 0,
			esay_count: 0,
			standart: '',
			percentage: {
				mc: 100,
				esay: 0
			}
		}
	}
}

const actions = {
	getDataQuestionBanks({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				let perPage = payload.perPage
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`question_banks?page${state.question_banks_page}&perPage=${perPage}`)
				
				commit('ASSIGN_QUESTION_BANKS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createDataQuestionBank({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`question_banks`, state.question_bank)

				commit('CLEAR_QUESTION_BANK')
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
	duplicateDataQuestionBank({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`question_banks/${payload}/duplicate`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	importDataQuestionBank({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`question_banks/${payload.id}/import`, payload.data, {
					headers: {
			            'content-type': 'multipart/form-data'
			        }
				})

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
	getDataQuestionBank({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`question_banks/${payload}`)

				commit('ASSIGN_QUESTION_BANK', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataQuestionBank({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.put(`question_banks/${state.question_bank.id}`, state.question_bank)

				commit('CLEAR_QUESTION_BANK')
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	deleteDataQuestionBank({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.delete(`question_banks/${payload}`)

				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	getDataQuestions({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				let perPage = payload.perPage
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`question_banks/${payload.id}/question?page=${state.questions_page}&perPage=${perPage}`)

				commit('ASSIGN_QUESTIONS', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	createDataQuestion({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.post(`question_banks/question`, state.question)

				commit('CLEAR_QUESTION')
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
	getDataQuestion({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.get(`question_banks/question/${payload}`)

				commit('ASSIGN_QUESTION', network.data.data)
				commit('SET_LOADING', false, { root: true })
				resolve(network.data)
			} catch (error) {
				commit('SET_LOADING', false, { root: true })
				reject(error.response.data)
			}
		})
	},
	updateDataQuestion({ commit, state }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.put(`question_banks/question/${state.question.id}`, state.question)

				commit('CLEAR_QUESTION')
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
	deleteDataQuestion({ commit }, payload) {
		return new Promise(async (resolve, reject) => {
			try {
				commit('SET_LOADING', true, { root: true })
				let network = await $axios.delete(`question_banks/question/${payload}`)

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