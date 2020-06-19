import React from 'react';
import ProfileTab from '../ProfileTab.js';
import OrdersTab from '../OrdersTab.js';
import EditProfileTab from '../EditProfileTab.js';
import ChangePasswordTab from '../ChangePasswordTab';
import isLogin from '../../Services/isLogin.js';
import Oidc from 'oidc-client';
import axios from 'axios';
import {Link} from 'react-router-dom';

class ProflieOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: "",
        loaded1: false,
        loaded2: false,
        user:"",
        page: this.props.match.params.page,
    }

    this.handleChange = this.handleChange.bind(this);
  }
  
  async componentDidMount(){
    var user = await isLogin().catch(()=>{
    })
    if(user) {
      axios.defaults.headers.common = {'Authorization': `Bearer ${user.access_token}`};
    }
    else {

    }
    this.setState({currentUser:user, loaded1: true});
    this.getuserdata();
  }

  getuserdata(){
    axios.get('https://localhost:5001/api/user/'+this.state.currentUser.profile.sub, {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(result => {
      
      this.setState({
          user: result.data, 
          loaded2: true
      });
    });
  }

  componentWillReceiveProps(nextProps)
  {    
      this.setState({
        page: nextProps.match.params.page,
        tab: 'tab-pane',
      });  
  }

  handleChange(e){}
  
  render() {
    var u = "nav-link active";
    var o = "nav-link";
    if(this.state.page ==="order")
    {
      var o = "nav-link active";
      var u = "nav-link";
    }

    var p = "nav-link";
    if(this.state.loaded1 === false || this.state.loaded2===false)
    return "Loading";
    return (
      <div className="container">
        <div className="row m-y-2">
          <div className="col-lg-4 pull-lg-8 text-xs-center mx-auto my-auto">
            <h4>Xin chào,</h4>
            <br />
            <h2>{this.state.user.name}</h2>
          </div>
          <div className="col-lg-8 push-lg-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link to="/profile/user" data-target="#profile" data-toggle="tab" className={u}><b>Thông tin</b></Link>
              </li>
              <li className="nav-item">
                <Link to="/profile/order" data-target="#orders" data-toggle="tab" className={o}><b>Đơn hàng</b></Link>
              </li>
              <li className="nav-item">
                <Link to="/profile/change-profile" data-target="#edit" data-toggle="tab" className={p}><b>Thay đổi thông tin</b></Link>
              </li>
              <li className="nav-item">
                <Link to="/profile/change-password"  data-target="#pass" data-toggle="tab" className={p}><b>Thay đổi mật khẩu</b></Link>
              </li>
            </ul>
            <div className="tab-content p-b-3">
              <ProfileTab user1={this.state.user} cur={this.state.page}/>
              <OrdersTab user2={this.state.user} cur={this.state.page}/>
              <EditProfileTab userdata1={this.state.user} tab={this.state.tab}/>
              <ChangePasswordTab userdata2={this.state.user} tab={this.state.tab}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
  
export default ProflieOrders;;
  