import Vue from 'vue';
import App from './App.vue';
import router from './router';
// element-ui配置
import './plugins/element-ui';
// axios配置
import './plugins/axios';
// 初始化样式
import 'normalize.css';
// 自定义样式
import './assets/scss/styles.scss';

// 阿里巴巴图标
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont.js';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
