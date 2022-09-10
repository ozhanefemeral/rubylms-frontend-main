import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from "axios";
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.config.productionTip = false
Vue.component('apexchart', VueApexCharts)

axios.get('/api/test/school')
  .then(res => res.data)
  .then(school => {
    console.log(school);
    store.commit('setSchool', school._id);
  })

const token = localStorage.getItem('token')
const teacherId = localStorage.getItem('teacherId')

if (!token || token.length == 0 || !teacherId || teacherId.length == 0) {
  router.push('Login');
} else {
  store.commit('setToken', token);
  store.commit('setTeacherId', teacherId);
  router.push('Home');
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
