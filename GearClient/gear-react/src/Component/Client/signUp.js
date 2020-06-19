import React from 'react';
import axios from 'axios';
import Oidc from 'oidc-client';

class SignUp extends React.Component {
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
    };var config = {
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
        email:"",
        password: "",
        passwordCheck: "",
        address: "",
        phone: null,
        role: "Member",
        status: "Ok",
        name: "",
        success: "",
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    
  }


handleChange = (e) => {
    let inputName = e.target.name;
    this.setState({
        [inputName] : e.target.value
    })
}

handleSubmit = async  (e) => {
    
    e.preventDefault();
    try {
        await this.handleInputError();

    }
    catch (error_) {
        alert(error_);
        return 0;
    }
   
    var data = {
        'UserName': this.state.email,
        'Email': this.state.email,
        'Name': this.state.name,
        'Password': this.state.password,
        'Address': this.state.address,
        'PhoneNumber': this.state.phone,
        'Role': this.state.role,
        'Status': this.state.status,
    };

    axios.post("https://localhost:5001/api/user", data, {
        headers: {
            'Content-Type': 'application/json',
                }
         })
         .then(result => {
            var success_ = "Tạo thành công tài khoản " + result.data.email;
            alert(success_);
            this.state.mgr.signinRedirect();
         })
         .catch((error) => {
            if(error.response.status === 400)
            {
              alert("Email đã có người sử dụng");
            }
         });
}

handleInputError = () => {
    return new Promise((resolve, reject) => {
        if(!this.state.email.match(/^[A-Za-z0-9]+@+[a-z]+\.+[a-z]+$/) || !this.state.email){
            reject("Địa chỉ email không hợp lệ");
        }

        if(this.state.password == "")
        {
          reject("Mật khẩu không được để trống ");
        }

        if(!this.state.password.match(/^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/) && this.state.password !== ""){
            reject("Mật khẩu ít nhất 4 chữ cái và có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số, với 1 chữ cái đặc biệt");
        }

        if(this.state.passwordCheck !== this.state.password){
            reject("Mật khẩu không khớp");
        }
        
        if(!this.state.name){
            reject("Tên không được để trống");
        }

        if(!this.state.address){
            reject("Địa chỉ không được để trống");
        }

        if(!this.state.phone || !this.state.phone.match(/^[0-9]{8,}$/)){
            reject("Số điện thoại phải có ít nhất 8 số");
        }

        resolve("ok");
    })
  }

  tologin=()=>
  {

    this.state.mgr.signinRedirect();
  }

  render() {
    return (
      <div className="container">
        <div class="row centered-form">
      <div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-6 m-auto py-5">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3>Đăng ký</h3>
          </div>
          <hr class="mb-4" />
          <div class="panel-body">
            <form role="form">
              <div class="form-group">
                <input type="text" name="ame" id="name" class="form-control input-sm" value={this.state.name} name="name" onChange={this.handleChange} placeholder="Tên" />
              </div>
              <div class="form-group">
                <input type="email" name="email" id="email" class="form-control input-sm" value={this.state.email} name="email" onChange={this.handleChange} placeholder="Email" />
              </div>
              <div class="form-group">
                <input type="tel" name="tel" id="tel" class="form-control input-sm" value={this.state.phone} name="phone" onChange={this.handleChange} placeholder="Số điện thoại" />
              </div>
              <div class="form-group">
                <input type="text" name="text" id="text" class="form-control input-sm" value={this.state.address} name="address" onChange={this.handleChange} placeholder="Địa chỉ" />
              </div>
              <div class="row">
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <input type="password" name="password" id="password" value={this.state.password} name="password" onChange={this.handleChange} class="form-control input-sm"
                      placeholder="Mật khẩu" />
                  </div>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6">
                  <div class="form-group">
                    <input type="password" name="password_confirmation" id="password_confirmation" value={this.state.passwordCheck} name="passwordCheck" onChange={this.handleChange}
                      class="form-control input-sm" placeholder="Xác nhận mật khẩu" />
                  </div>
                </div>
              </div>
              <input type="submit" value="Register" onClick={this.handleSubmit} class="btn btn-info btn-block" />
            </form>
            <br />
            <hr class="mb-4" />
            <div>
              <i>Đã có tài khoản?</i><b class="float-right"><a href="#" onClick={this.tologin}>Đăng nhập</a></b>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    );
  }
}
  
export default SignUp;