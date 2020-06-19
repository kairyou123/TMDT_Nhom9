import React from 'react';
import {Link} from 'react-router-dom';
import Oidc from 'oidc-client';
import axios from 'axios';
import checkAdmin from '../Services/checkAdmin.js';
import isLogin from '../Services/isLogin.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        var config = {
            authority: "http://localhost:5000",
            client_id: "spa",
            client_serect: "api_secret",
            redirect_uri: "http://localhost:5003/redirect",
            response_type: "code",
            scope:"openid profile email address phone gearapi",
            post_logout_redirect_uri : "http://localhost:5003/",
            userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
          };

        this.state = {
            mgr : new Oidc.UserManager(config),
            isLogin: false,
            user: "",
            admin: false,
            catalogs: [],
            search: "",
            filter: [],
            currentPage: 1,
            totalPage: 1,
            onePageShow: 7,
            currentUser: "",
            cartcount: 0,
        }

        this.handleChange = this.handleChange.bind(this);
    }
    // async componentDidMount() {
    //     var user = await isLogin();

    //     this.setState({
    //         currentUser: user,
    //     });

    //     // if(user) {
    //     //     axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
    //     // }
    //     // else {

    //     // }
        
    //     // axios.get('https://localhost:5001/api/catalog').then(result => {
    //     //     this.setState({
    //     //         catalogs: result.data, 
    //     //         filter: result.data,
    //     //         totalPage: Math.ceil(result.data.length/this.state.onePageShow),
    //     //     });
    //     // });
    // }

    handleChange(e) {
        this.setState({search : e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.search !== "")
        window.location.href = "/search/" + this.state.search ;
    }

    checkExipres = (user) => {
        var now = new Date().getTime() / 1000;
        if(user.expires_at < now) {
            this.state.mgr.signoutRedirect({ 'id_token_hint': user.id_token });
        }
    }

    async componentDidMount() {
        await this.getcatalog();
        var user = await isLogin();
        
        this.checkExipres(user);
        this.setState({
            user: user,
        });
        if(user) {
                    axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
                    try {
                        await checkAdmin();
                        this.setState({
                            admin: true,
                            isLogin:true,
                        });
                    }
                    catch {
                        this.setState({
                            admin: false,
                            isLogin:true,
                        });
                } 
            }
            await this.getcart();
            console.log(this.state);
    }
   
    getcatalog(){
        return new Promise((resolve, reject) => {
            axios.get('https://localhost:5001/api/catalog/').then(result => {      
              // this.setState({
              //     products: result.data, 
              //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
              // });
              this.setState({
                  catalogs: result.data, 
              });  
              console.log(this.state);
           })   
          .catch(error => {
          });
            resolve("OK");
        
    });
    }
    
    getcart() {
        return new Promise((resolve, reject) => {
        if(this.state.isLogin)
        {
        axios.get('https://localhost:5001/api/carts/user/'+this.state.user.profile.sub).then(result => {      
          // this.setState({
          //     products: result.data, 
          //     // totalPage: Math.ceil(result.data.length/this.state.onePageShow),
          // });
          console.log(result.data);
          this.setState({
              cartcount: result.data.length, 
          });  
       })   
      .catch(error => {
      });
      }
      resolve("ok");
    });
    }

    Login = () => {
        this.state.mgr.signinRedirect();
    }

    Logout = () => {
        this.state.mgr.signoutRedirect({ 'id_token_hint': this.state.user.id_token });
    }

    LoginRender = () => {
        if(this.state.user && this.state.admin) {
            return (
                <li className="nav-item dropdown mr-auto dropleft"> 
                <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown"><i className="fas fa-user"></i></a>
                <div className="dropdown-menu dropleft">
                <Link to="/admin/user" className="dropdown-item" href="#">Trang quản lý</Link>
                <Link className="dropdown-item" to="/profile/user">Tài khoản/Đơn hàng</Link>
                <a className="dropdown-item" onClick={this.Logout}>Đăng xuất</a>
                </div>
                </li>
            )
        }
        else if(this.state.user) {
            return (
                <li className="nav-item dropdown mr-auto dropleft"> 
                <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown"><i className="fas fa-user"></i></a>
                <div className="dropdown-menu dropleft">
                <Link className="dropdown-item" to="/profile/user">Tài khoản/Đơn hàng</Link>
                <a className="dropdown-item" onClick={this.Logout}>Đăng xuất</a>
                </div>
                </li>
            )
        }
        else {
            return (<li className="nav-item dropdown mr-auto dropleft">
                <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
                    <i className="fas fa-user"></i></a>
                    <div className="dropdown-menu dropleft">
                        <a className="dropdown-item" onClick={this.Login}>Đăng nhập</a>
                        <Link className="dropdown-item" to="/sign-up">Đăng ký</Link>
                    </div>
                </li>);
        }
    }

    CartClick = () => {
        if(this.state.isLogin) {
            window.location.href="/cart";
        }
        else {
            this.Login();
        }
    }

    render() {
        const {isLogin} = this.state;
        let clist = this.state.catalogs.map((catalog,i)=>{
            return(
                <Link to= {'/product-category/'+ catalog.id} className="dropdown-item"  key={i}>{catalog.name}</Link>
            )
        })
        return (
            <div id="menu" className="menu">
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <Link className="navbar-brand padding-gear-40" to="/">HHL</Link>
            <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
                aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav mt-2 mt-lg-0">
                <li className="nav-item dropdown padding-gear-20">
                    <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">Danh mục</a>
                    <div className="dropdown-menu">
                    { clist}
                    </div>
                </li>
                </ul>
                <div className="col-sm-10">
                <form className="form-inline my-2 my-lg-0 padding-gear-30">
                    <input className="form-control mr-sm-2" value={this.state.search} name="seach" onChange={this.handleChange} type="text" placeholder="Search" />
                    <button className="btn btn-outline-dark my-2 my-sm-0" type="submit" onClick={this.handleSubmit}><i className="fas fa-search"></i></button>
                </form>
                </div>
                <ul className="navbar-nav mt-2 mt-lg-0">
                <li className="nav-item cart">
                    <div className="count">{this.state.cartcount}</div>
                    <a className="nav-link" onClick={this.CartClick}><i className="fas fa-shopping-cart"></i></a>
                </li>
                    {this.LoginRender()}
                
                </ul>
            </div>
            </nav>
        </div>
        );
    }
}
  
export default Header;
  