import axios from 'axios';
import Vue from 'vue';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 拦截器
axios.interceptors.request.use((value) => {
    value.headers.Authorization = window.sessionStorage.getItem('token');
    return value;
});

Vue.prototype.$http = axios;
