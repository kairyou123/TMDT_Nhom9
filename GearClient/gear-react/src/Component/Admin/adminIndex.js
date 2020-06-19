import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import isLogin from '../../Services/isLogin.js';
import Oidc from 'oidc-client';

class adminIndex extends React.Component {
    constructor(props) {
        super(props);
        var config = {
            authority: "http://localhost:5000",
            client_id: "spa",
            redirect_uri: "http://localhost:5003/redirect",
            response_type: "code",
            scope:"openid profile email address phone gearapi",
            post_logout_redirect_uri : "http://localhost:5003/",
            userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
        };
        this.state = {
            mgr: new Oidc.UserManager(config),
            isLogin: false,
            user: "",
            path : window.location.pathname,
            loaded: false,
        }
    }

    async componentDidMount() {
        var user_ = await isLogin();
        this.setState({
           user : user_,
           loaded: true,
        })
        this.checkExipres(user_);
    }
    
    
    checkExipres = (user) => {
        var now = new Date().getTime() / 1000;
        if(user.expires_at < now) {
            this.state.mgr.signoutRedirect({ 'id_token_hint': user.id_token });
        }
    }


    render() {
        const {user} = this.state;
        
        if(!this.state.loaded) return "Loading";
      
        return (
            <div className="gear-admin">
                <div className="admin-right">
                    <div className="admin-user">
                        <div className="admin-user-text">
                            <span className="admin-user-name">{user.profile.name}</span>
                            <img src="/images/admin.png" height="40px" />
                        </div>
                        
                    </div>
                    {this.props.children}
                </div>
                <div className="admin-left col-3">
                    <div className="admin-logo-box">
                        <Link to="/"><img src="/images/gearvn.png" className="admin-logo-img" height="70px" /></Link>
                    </div>
                    <div className="admin-left-menu">
                        <NavLink to="/admin/user" activeClassName="admin-active">
                        <div className="menu-section row" id="admin-user">
                        <div className="col-9">
                                <div className="row">
                                    <div className="col-3 text-center"><i className="fas fa-user"></i></div>
                                    <span className="menu-text">Người dùng</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <span className="padding-right-5"><i className="fas fa-arrow-circle-right"></i></span>
                            </div>
                        </div>
                        </NavLink>
                        <NavLink to="/admin/product" activeClassName="admin-active">
                        <div className="menu-section row">
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-3 text-center"><i className="fab fa-product-hunt font-size-20"></i></div>
                                    <span className="menu-text">Sản phẩm</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <span className="padding-right-5"><i className="fas fa-arrow-circle-right"></i></span>
                            </div>
                        </div>
                        </NavLink>
                        <NavLink to="/admin/catalog" activeClassName="admin-active">
                        <div className="menu-section row">
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-3 text-center"><i className="fas fa-box font-size-20"></i></div>
                                    <span className="menu-text">Chủng loại</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <span className="padding-right-5"><i className="fas fa-arrow-circle-right"></i></span>
                            </div>
                        </div>
                        </NavLink>
                        <NavLink to="/admin/manufactuer" activeClassName="admin-active">
                        <div className="menu-section row">
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-3 text-center"><i className="fas fa-industry font-size-20"></i></div>
                                    <span className="menu-text">Nhà sản xuất</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <span className="padding-right-5"><i className="fas fa-arrow-circle-right"></i></span>
                            </div>
                        </div>
                        </NavLink>
                        <NavLink to="/admin/order" activeClassName="admin-active">
                        <div className="menu-section row">
                            <div className="col-9">
                                <div className="row">
                                    <div className="col-3 text-center"><i className="fas fa-clipboard-list font-size-20"></i></div>
                                    <span className="menu-text">Đơn hàng</span>
                                </div>
                            </div>
                            <div className="col-2">
                                <span className="padding-right-5"><i className="fas fa-arrow-circle-right"></i></span>
                            </div>
                        </div>
                        </NavLink>
                    </div>
                </div>
                
            </div>
        );
    }
}
  
export default adminIndex;
  