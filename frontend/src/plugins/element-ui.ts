import Vue from 'vue';
import {
  Loading,
  Message,
  FormItem,
  Form,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Breadcrumb,
  BreadcrumbItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Card,
  Table,
  TableColumn,
} from 'element-ui';

Vue.use(Loading.directive);
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(Card).use(Table).use(TableColumn);

Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;