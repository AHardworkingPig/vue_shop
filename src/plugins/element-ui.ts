import {
    Button, Form, Input, FormItem, Message, Container,
    Header, Aside, Main, Submenu, Menu, MenuItem,
    Breadcrumb, BreadcrumbItem, Card, Col, Row,
    Table, TableColumn, Switch, Tooltip, Pagination,
    Dialog, MessageBox,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';

Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Submenu);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);


Vue.prototype.$confirm = MessageBox;
Vue.prototype.$message = Message;
