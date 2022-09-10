import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    school: "",
    token: "",
    teacherId: ""
  },
  mutations: {
    setSchool(state, value) {
      state.school = value;
    },
    setTeacherId(state, value) {
      localStorage.teacherId = value;
      state.teacherId = value;
    },
    setToken(state, value) {
      localStorage.token = value;
      state.token = value;
      axios.defaults.headers['Authorization'] = `Bearer ${value}`;
    }
  },
  actions: {
  },
  modules: {
  }
})
