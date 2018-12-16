// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import axios from 'axios';

Vue.use(ElementUI);

Vue.prototype.$axios = axios;
axios.defaults.headers['content-Type'] = 'application/json;charset=utf-8';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  render: h => h(App)
});
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionStorage.getItem('easeHis')) {
    this.$router.push({path: 'login'});
  } else if (to.path !== '/internal') {
    next();
  } else {
    this.$router.push({path: 'home'});
  }
});
