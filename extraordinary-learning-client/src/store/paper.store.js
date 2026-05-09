import $axios from '@/core/services/api.service'

const state = () => ({
    papers: [],
    paper: {},
    progress: 0
})

const mutations = {
    ASSIGN_DATA_PAPERS(state, payload) {
        state.papers = payload
    },
    ASSIGN_DATA_PAPER(state, payload) {
        state.paper = payload
    },
    SET_UPLOAD_PROGRESS(state, payload) {
        state.progress = payload
    },
    CLEAR_DATA_PAPERS(state) {
        state.papers = []
    },
    CLEAR_DATA_PAPER(state) {
        state.paper = {}
    }
}

const actions = {
    getDataPapers({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('SET_LOADING', true, { root: true })
                let network = await $axios.get(`papers/${payload.id}/list?type=${payload.type}`)

                commit('ASSIGN_DATA_PAPERS', network.data.data)
                commit('SET_LOADING', false, { root: true })
                resolve(network.data)
            } catch (error) {
                commit('SET_LOADING', false, { root: true })
                if(typeof error.response != 'undefined') {
                    reject(error.response.data)
                }
                reject({ message: error })
            }
        })
    },
    
    getDataPaper({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('SET_LOADING', true, { root: true })
                let network = await $axios.get(`papers/${payload}`)

                commit('ASSIGN_DATA_PAPER', network.data.data)
                commit('SET_LOADING', false, { root: true })
                resolve(network.data)
            } catch (error) {
                commit('SET_LOADING', false, { root: true })
                if(typeof error.response != 'undefined') {
                    reject(error.response.data)
                }
                reject({ message: error })
            }
        })
    },

    createDataPaper({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('SET_LOADING', true, { root: true })
                let network = await $axios.post(`papers`, payload, {
                    headers: {
                        'content-type'  : 'multipart/form-data'
                    },
                    onUploadProgress: function( progressEvent ) {
                        commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
                    }.bind(this)
                })

                commit('SET_UPLOAD_PROGRESS', 0)
                commit('SET_LOADING', false, { root: true })
                resolve(network.data)
            } catch (error) {
                if (error.response && error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
                commit('SET_LOADING', false, { root: true })
                if(typeof error.response != 'undefined') {
                    reject(error.response.data)
                }
                reject({ message: error })
            }
        })
    },

    updateDataPaper({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('SET_LOADING', true, { root: true })
                let network = await $axios.post(`papers/${payload.id}/update`, payload.data, {
                    headers: {
                        'content-type'  : 'multipart/form-data'
                    },
                    onUploadProgress: function( progressEvent ) {
                        commit('SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
                    }.bind(this)
                })

                commit('SET_UPLOAD_PROGRESS', 0)
                resolve(network.data)
            } catch (error) {
                if (error.response && error.response.status == 422) {
                    commit('SET_ERRORS', error.response.data.errors, { root: true })
                }
                commit('SET_LOADING', false, { root: true })
                if(typeof error.response != 'undefined') {
                    reject(error.response.data)
                }
                reject({ message: error })
            }
        })
    },

    deleteDataPaper({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                commit('SET_LOADING', true, { root: true })
                let network = await $axios.delete(`papers/${payload}`)

                commit('SET_LOADING', false, { root: true })
                resolve(network.data)
            } catch (error) {
                if(typeof error.response != 'undefined') {
                    reject(error.response.data)
                }
                reject({ message: error })
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