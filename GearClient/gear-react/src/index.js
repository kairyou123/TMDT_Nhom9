import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginCallback from './Component/LoginCallback.js';
import Home from './Component/Client/home.js';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import AdminIndex from './Component/Admin/adminIndex.js';
import User from './Component/Admin/user.js';
import UserEdit from './Component/Admin/userEdit.js';
import PrivateRoute from './PrivateRoute.js';
import MemberPrivateRoute from './MemberPrivateRoute';
import UserAdd from './Component/Admin/userAdd.js';
import Catalog from './Component/Admin/Catalog/catalog.js';
import CatalogEdit from './Component/Admin/Catalog/catalogEdit.js';
import CatalogAdd from './Component/Admin/Catalog/catalogAdd.js';
import Manufactuer from './Component/Admin/Manufacturer/manufactuer.js';
import ManufactuerEdit from './Component/Admin/Manufacturer/manufactuerEdit.js';
import ManufactuerAdd from './Component/Admin/Manufacturer/manufactuerAdd.js';
import Product from './Component/Admin/Product/product.js';
import ProductEdit from './Component/Admin/Product/productEdit.js';
import ProductAdd from './Component/Admin/Product/productAdd.js';
import Order from './Component/Admin/Order/order.js';
import OrderEdit from './Component/Admin/Order/orderEdit.js';
import Header from './Component/header.js';
import Footer from './Component/footer';
import Category from './Component/Client/category';
import Detail from './Component/Client/detail';
import Cart from './Component/Client/cart';
import Checkout from './Component/Client/checkout';
import ProflieOrders from './Component/Client/profileOrders';
import SignUp from './Component/Client/signUp';
import Search from './Component/Client/search';
import LogIn from './Component/logIn';

const history = createBrowserHistory();

const Root = () => (
  <Router history={history}>
      <Switch>
      <Route path="/redirect" component={LoginCallback} />
      
      <PrivateRoute path='/admin/' component={({ match }) =>
          <AdminIndex>
              <Route exact path="/admin/user" component={User} />
              <Route path="/admin/user/add" component={UserAdd} />
              <Route exact path="/admin/user/:id/edit" component={UserEdit} />
              <Route exact path="/admin/catalog" component={Catalog} />
              <Route path="/admin/catalog/add" component={CatalogAdd} />
              <Route exact path="/admin/catalog/:id/edit" component={CatalogEdit} />
              <Route exact path="/admin/manufactuer" component={Manufactuer} />
              <Route path="/admin/manufactuer/add" component={ManufactuerAdd} />
              <Route exact path="/admin/manufactuer/:id/edit" component={ManufactuerEdit} />
              <Route exact path="/admin/product" component={Product} />
              <Route path="/admin/product/add" component={ProductAdd} />
              <Route exact path="/admin/product/:slug/edit" component={ProductEdit} />
              <Route exact path="/admin/order" component={Order} />
              <Route exact path="/admin/order/:id/edit" component={OrderEdit} />

          </AdminIndex>
      } />

      {/* <MemberPrivateRoute path='/user' component={({ match }) =>
      <div>
        <Header />
        
        <Footer />
      </div>
      } /> */}  

      <Route path='/' component={({ match }) =>
      <div>
        <Header />
        <Route path="/log-in" component={LogIn}/>
        <Route path="/product-category/:id" component={Category} />
        <Route path="/product-detail/:slug" component={Detail} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/search/:search" component={Search} />
        <Route exact path="/" component={Home} />
        <MemberPrivateRoute  path="/profile/:page" component={ProflieOrders} />
        <MemberPrivateRoute  path="/check-out" component={Checkout} />
        <MemberPrivateRoute  path="/cart" component={Cart} />
        <Footer />
      </div>
      } />

      </Switch>
  </Router>
);

ReactDOM.render(
  <Root />,
  document.getElementById('content')
);





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
