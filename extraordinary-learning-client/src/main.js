import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import Permissions from './core/mixins/permission.js'

import './core/plugins/bootstrap-vue'
import './core/plugins/inline-svg'
import './core/plugins/metronic'
import './core/plugins/ck-editor'
import './core/plugins/perfect-scrollbar'
import './core/plugins/youtube'
import './core/plugins/sweetalert.js'

import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

Vue.config.productionTip = false
Vue.mixin(Permissions)

import { mapActions, mapGetters } from 'vuex'
import { successToas, errorToas } from '@/core/entities/notif'

new Vue({
  router,
  store,
  render: h => h(App),
  computed: {
  	...mapGetters(['isAuth'])
  },
  methods: {
    ...mapActions('user', ['getUserLogin']),
    ...mapActions('setting', ['getDataSettingSchool']),
  	...mapActions(['getConfig'])
  },
  created() {
    this.getDataSettingSchool()
  	if (this.isAuth) {
      this.getUserLogin()
      .catch((error) => {
  			this.$bvToast.toast(error.message, errorToas())
      })
  	}
  }
}).$mount('#app')
