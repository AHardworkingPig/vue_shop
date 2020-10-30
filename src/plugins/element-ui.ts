import { Button, Form, Input, FormItem, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';

Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);

Vue.prototype.$message = Message;
