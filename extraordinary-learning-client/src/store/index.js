import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import auth from './auth.store'
import user from './user.store'
import lecture from './lecture.store'
import subject from './subject.store'
import classroom from './classroom.store'
import channel from './channel.store'
import abcent from './abcent.store'
import task from './task.store'
import setting from './setting.store'
import question from './question.store'
import exam_schedule from './exam_schedule.store'
import exam from './exam.store'
import info from './info.store'
import event from './event.store'
import result from './result.store'
import standart from './standart.store'
import paper from './paper.store'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        errors: [],
        isLoading: false,
        loadPage: false,
        token: localStorage.getItem('token'),
        baseURL: process.env.VUE_APP_URL
    },
    getters: {
        isAuth: state => {
  		    return state.token != "null" && state.token != null
        },
        isLoading: state => {
  		    return state.isLoading
        },
        baseURL: state => {
  		    return state.baseURL
        },
        loadPage: state => {
            return state.loadPage
        }
    },
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload
        },
        SET_ERRORS(state, payload) {
            state.errors = payload
        },
        CLEAR_ERROR(state, payload) {
            state.errors = []
        },
        SET_LOADING(state, payload) {
            state.isLoading = payload
        },
        SET_BASEURL(state, payload) {
            // state.baseURL = payload
        },
        SET_LOAD_PAGE(state, payload) {
            state.loadPage = payload
        }
    },
    actions: {
        getConfig({ commit }) {
            return new Promise(async (resolve, reject) => {
                try {
                    // let network = await axios.get(`/static/config.json`, {
                    //     headers: {
                    //         'Accept' : 'application/json'
                    //     }
                    // })
                    // commit('SET_BASEURL', network.data.URL)
                    resolve('oke')
                } catch (error) {
                    reject('error')
                }
            })
        }
    },
    modules: {
        auth,
        user,
        lecture,
        subject,
        classroom,
        channel,
        abcent,
        task,
        setting,
        question,
        exam_schedule,
        exam,
        info,
        event,
        result,
        standart,
        paper
    }
})
